import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js"
import { db } from "../libs/db.js"

export const getAllSubmission = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  const submissions = await db.submission.findMany({
    where: { userId },
  });

  res.status(200).json(new ApiResponse(200, submissions, "data fetched successfully"));

})

export const getSubmissionForProblem = asyncHandler(async (req, res) => {

  const { problemId } = req.params;

  const submission = await db.submission.count({
    where: { problemId },
  })

  res.status(200).json(new ApiResponse(200, submission, "submission fetched succsfully"));

})

export const getAllTheSubmissionsForProblem = asyncHandler(async (req, res) => {

  const { problemId } = req.params;
  const userId = req.user.id;

  const submissions = await db.submission.findMany({
    where: { userId, problemId }
  })

  res.status(200).json(new ApiResponse(200, submissions, "submissions fetched succsfully"));

})

