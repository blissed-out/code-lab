import { Role } from "../generated/prisma/index.js";
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
    if (results[i].status.id !== 3) {
      return res.status(200).json(new ApiResponse(403, null, `Testcase ${i + 1} failed for language ${language}`))
    }
  }

  const newProblem = await db.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      example,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolution,
      userId: req.user.id,
    },
  })

  res.status(200).json(new ApiResponse(200, newProblem, "Problem created successfully"));

})

export const getAllProblems = asyncHandler(async (req, res) => {

  const problem = await db.problem.findMany();

  if (!problem) {
    return res.status(401).json(new ApiResponse(401, null, "No Problem found"));
  }

  res.status(200).json(new ApiResponse(200, problem, "Problem found"));

})

export const getProblemById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: { id },
  })

  if (!problem) {
    return res.status(404).json(new ApiResponse(404, null, "Problem not found"));
  }

  res.status(200).json(new ApiResponse(200, problem, "problem found, data fetched successfully"));
})

export const updateProblem = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const { title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution } = req.body;

  const updateProblem = await db.problem.update({

    where: { id },

    data: { title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution }

  });

  if (!updateProblem) {
    return res.status(404).json(new ApiResponse(404, null, "Failure in updating the problem"));
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

    const newProblem = await db.problem.create({
      data: {
        title, description, difficulty, tags, example, constraints, hints, editorial, testcases, codeSnippets, referenceSolution, userId: req.user.id
      }
    })

    res.status(200).json(new ApiResponse(200, newProblem, "Problem updated successfully"));
  }

})


export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = db.problem.findUnique({ where: { id } });

  if (!problem) {
    return res.status(404).json(new ApiResponse(404, null, "problem not found"));
  }

  await db.problem.delete({
    where: { id },
  })

  res.status(200).json(new ApiResponse(200, null, "problem deleted successfully"));

})

export const getAllSolvedProblemsByUser = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  const problem = await db.problem.findMany({
    solvedBy: {
      some: {
        userId,
      },

      include: {
        solvedby: {
          where: {
            userId
          }
        }
      }
    }
  })

  res.status(200).json(new ApiResponse(200, problem, "problems fetched succsssfully"));

})

