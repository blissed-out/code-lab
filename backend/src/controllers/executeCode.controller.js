import {
  // getJudge0LangagueId,
  // getLanguageName,
  pollBatch,
  submitBatch,
} from "../libs/judge0.lib.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/api-error.js";

export const executeCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs } = req.body;

  // validate test cases

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    throw new ApiError(400, "Invalid or missing test cases");
  }

  // prepare each test cases for judge0 submissions

  const submissions = stdin.map((input) => ({
    source_code,
    language_id: language_id,
    stdin: input,
  }));

  // send the batch of submissions to judge0
  console.log("this is submissions here--------*-", submissions);

  const submitResponse = await submitBatch(submissions);

  const token = submitResponse.map((res) => res.token);

  // poll the judge- for results of all submitted test cases

  const results = await pollBatch(token);

  console.log("result under executeCode controller ----------- ", results);

  // Analyze the test case results

  let allPassed = true;

  const detailedResults = results.map((result, i) => {
    const stdout = result.stdout?.trim();
    const expected_output = expected_outputs[i]?.trim();
    const passed = stdout === expected_output;

    if (!passed) allPassed = false;

    return {
      testCase: i + 1,
      stdout,
      expected: expected_output,
      passed,
      stderr: result.stderr || null,
      compiled_output: result.compiled_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory}KB` : undefined,
      time: result.time ? `${result.time}s` : undefined,
    };
  });

  const testResults = detailedResults.map((result) => ({
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected,
    stderr: result.stderr,
    compileOutput: result.compiled_output,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  res
    .status(200)
    .json(new ApiResponse(200, testResults, "Code executed successfully"));
});
