import { Role } from "../generated/prisma/index.js";
import { db } from "../libs/db.js";
import {
  getJudge0LangagueId,
  submitBatch,
  pollBatch,
} from "../libs/judge0.lib.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "You are not authorized to create a problem");
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LangagueId(language);

    if (!languageId) {
      throw new ApiError(401, `Language ${language} is not supported`);
    }

    const submission = testcases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expectedOutput: output,
    }));

    console.log("typeof submissions in pcs", typeof submission);
    const submissionResult = await submitBatch(submission);

    const tokens = submissionResult.map((res) => res.token);

    const results = await pollBatch(tokens);

    console.log("this is results here-----------", results);

    for (let i = 0; i < results.length; i++) {
      if (results[i].status.id !== 3) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              403,
              null,
              `Testcase ${i + 1} failed for language ${language}`,
            ),
          );
      }
    }
  }
  const newProblem = await db.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolutions,
      userId: req.user.id,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, newProblem, "Problem created successfully"));
});

export const getAllProblems = asyncHandler(async (req, res) => {
  const problem = await db.problem.findMany({
    include: {
      solvedBy: {
        where: {
          userId: req.user.id,
        },
      },
    },
  });

  if (!problem) {
    return res.status(401).json(new ApiResponse(401, null, "No Problem found"));
  }

  res.status(200).json(new ApiResponse(200, problem, "Problem found"));
});

export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: { id },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, problem, "problem found, data fetched successfully"),
    );
});

export const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  const updateProblem = await db.problem.update({
    where: { id },

    data: {
      title,
      description,
      difficulty: difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolutions,
    },
  });

  if (!updateProblem) {
    throw new ApiError(404, "Problem not found");
  }

  // referenceSolutions and testcases
  let language;
  let solutionCode;
  let submission;

  for ([language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LangagueId(language);

    if (!languageId) {
      throw new ApiError(404, `Language ${language} is not supported`);
    }

    submission = testcases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expectedOutput: output,
    }));
  }

  const submissionResult = await submitBatch(submission);

  const tokens = submissionResult.map((res) => res.token);

  const results = await pollBatch(tokens);

  for (let i = 0; i < results.length; i++) {
    if (results[i].status.id !== 3) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            403,
            null,
            `Testcase ${i + 1} failed for language ${language}`,
          ),
        );
    }
  }

  // save problem to the database

  const newProblem = await db.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolutions,
      userId: req.user.id,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, newProblem, "Problem updated successfully"));
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = db.problem.findUnique({ where: { id } });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  await db.problem.delete({
    where: { id },
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "problem deleted successfully"));
});

export const getAllSolvedProblemsByUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const problem = await db.problem.findMany({
    where: {
      solvedBy: {
        some: {
          userId,
        },
      },
    },

    include: {
      solvedBy: {
        where: {
          userId,
        },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, problem, "problems fetched succsssfully"));
});
