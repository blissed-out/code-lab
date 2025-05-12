import { db } from "../libs/db";
import { getJudge0LangagueId } from "../libs/judge0.lib";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/asyncHandler";
import { submitBatch } from "../libs/judge0.lib";

export const createProblem = asyncHandler(async (req, res) => {

  const { title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json(new ApiResponse(403, null, "Unauthorized access"))
  }

  // referenceSolution and testcases
  for (const [language, solutionCode] of Object.entries(referenceSolution)) {

    const languageId = getJudge0LangagueId(language);

    if (!languageId) {
      return res.status(401).json(new ApiResponse(401, null, `Language ${language} is not supported`))
    }

    const submission = testcases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expectedOutput: output
    }))
  }

  const submissionResult = await submitBatch(submission);

  const tokens = submissionResult.map((res) => res.token);






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

