import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js";
import { db } from "../libs/db.js";

export const get = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      submission: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

export const update = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { name, image } = req.body;

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      name,
      image,
    },
  });

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully"),
    );
});
