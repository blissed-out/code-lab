import { db } from "../libs/db.js";
import { getJudge0LangagueId, submitBatch, pollBatch } from "../libs/judge0.lib.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createProblem = asyncHandler(async (req, res) => {

  const { title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json(new ApiResponse(403, null, "Unauthorized access"))
  }

  // referenceSolution and testcases
  let language;
  let solutionCode;
  let submission;

  for ([language, solutionCode] of Object.entries(referenceSolution)) {

    const languageId = getJudge0LangagueId(language);

    if (!languageId) {
      return res.status(401).json(new ApiResponse(401, null, `Language ${language} is not supported`))
    }

    submission = testcases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expectedOutput: output
    }))
  }

  const submissionResult = await submitBatch(submission);

  const tokens = submissionResult.map((res) => res.token);

  const results = await pollBatch(tokens);

  for (let i = 0; i < results.length; i++) {
    if (results[i] !== 3) {
      return res.status(200).json(new ApiResponse(403, null, `Testcase ${i + 1} failed for language ${language}`))
    }

    // res.status(200).json(new ApiResponse(200, null, `Testcase ${i + 1} passed for language ${language}`))

    // save problem to the database

    const newProblem = await db.user.create({
      data: {
        title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution, userId: req.user.id
      }
    })

    res.status(200).json(new ApiResponse(200, newProblem));


  }

})

export const getAllProblems = asyncHandler(async (req, res) => {
  const { title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution } = req.body;

})

export const getProblem = asyncHandler(async (req, res) => {
  const { title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution } = req.body;
})

export const updateProblem = asyncHandler(async (req, res) => {
  const { title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution } = req.body;
})

export const deleteProblem = asyncHandler(async (req, res) => {
  const { title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution } = req.body;
})

export const getAllSolvedProblemsByUser = asyncHandler(async (req, res) => {
  const { title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution } = req.body;
})

