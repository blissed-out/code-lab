import { db } from "../libs/db.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/api-error.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const userId = req.user.id;

  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created successfully"));
});

export const getAllListDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const playlistName = await db.playlist.findMany({
    where: { userId: userId },

    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlistName) {
    throw new ApiError(404, "No playlist found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlistName,
        "playlist details fetched successfully",
      ),
    );
});

export const getPlayListDetails = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(404, "Playlist Id not found");
  }

  const playlistDetails = await db.playlist.findUnique({
    where: {
      id: playlistId,
    },

    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlistDetails,
        "playlist details fetched successfully",
      ),
    );
});

export const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { problemIds } = req.body;
  const { playlistId } = req.params;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Invalid problem ids");
  }

  const problemInPlaylist = await db.problemInPlaylist.createMany({
    data: problemIds.map((problemId) => ({
      playlistId,
      problemId,
    })),
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        problemInPlaylist,
        "problem added to the playlist successfully",
      ),
    );
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(404, "Playlist Id not found");
  }

  // delete throws error for some reason
  const deletePlaylist = await db.playlist.deleteMany({
    where: {
      id: playlistId,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, deletePlaylist, "playlist deleted succesfully"));
});

export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const { problemIds, playlistId } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Invalid problem ids");
  }

  const removeProblem = await db.problemInPlaylist.deleteMany({
    where: {
      playlistId,
      problemId: {
        in: problemIds,
      },
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        removeProblem,
        "problem deleted from playlist successfully",
      ),
    );
});
