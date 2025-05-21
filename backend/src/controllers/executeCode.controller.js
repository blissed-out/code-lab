import {
  getJudge0LangagueId,
  getLanguageName,
  pollBatch,
  submitBatch,
} from "../libs/judge0.lib.js";
import ApiResponse from "../utils/api-response.js";
import { db } from "../libs/db.js";
import asyncHandler from "../utils/asyncHandler.js";

export const executeCode = asyncHandler(async (req, res) => {
  const { source_code, languageId, stdin, expected_output, problemId } =
    req.body;

  const userId = req.user.id;

  // validate test cases

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_output) ||
    expected_output.length !== stdin.length
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing test cases"));
  }

  // prepare each test cases for judge0 submissions

  const submissions = stdin.map((input) => ({
    source_code,
    languageId,
    stdin: input,
  }));

  // send the batch of submissions to judge0

  const submitResponse = await submitBatch(submissions);

  const token = submitResponse.map((res) => res.token);

  // poll the judge- for results of all submitted test cases

  const results = await pollBatch(token);

  // Analyze the test case results

  let allPassed = true;

  const detailedResults = results.map((result, i) => {
    const stdout = result.stdout?.trim();
    const expected_output = expected_output[i].trim();
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

  // store the detailedResults in our database

  const submission = await db.submissions.create({
    data: {
      userId,
      problemId,
      source_code,
      language: getLanguageName(languageId),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compileOutput: detailedResults.some((r) => r.compiled_output)
        ? JSON.stringify(detailedResults.map((r) => r.compiled_output))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: JSON.stringify(detailedResults.map((r) => r.memory)),
      time: JSON.stringify(detailedResults.map((r) => r.time)),
    },
  });

  // if allPassed = true, mark problem as sovled for the user

  if (allPassed) {
    await db.problemSolved.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },

      update: {},
      create: {
        userId,
        problemId,
      },
    });
  }

  // save individual test cases resutls

  const testResults = detailedResults.map((result) => ({
    submissionsId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected_output,
    stderr: result.stderr,
    compileOutput: result.compiled_output,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  await db.TestCaseResult.createMany({
    data: testResults,
  });

  const submissionWithTestCase = await db.submission.findUnique({
    where: {
      id: submission.id,
    },
    includes: {
      testCase: true,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        submissionWithTestCase,
        "Code executed successfully",
      ),
    );
});
