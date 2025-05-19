import { db } from "../libs/db.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResopnse from "../utils/api-response.js"

export const createPlaylist = asyncHandler(async (req, res) => {

  const { name, description } = req.body;

  const userId = req.user.id;

  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId
    }
  })

  res.status(200).json(new ApiResponse(200, playlist, "playlist created successfully"))

})


export const getAllListDetails = asyncHandler(async (req, res) => {

  const userId = req.body.id;

  const playlistName = await db.playlist.findMany({

    where: { userId: userId },

  })

  if (!playlistName) {
    return res.status(404).json(new ApiResponse(404, null, "No playlist found"))
  }

  res.status(200).json(new ApiResponse(200, playlistName, "playlist details fetched successfully"))

})

export const getPlayListDetails = asyncHandler(async (req, res) => {

  const userId = req.body.id;

  const { problemId } = req.params;

  if (!problemId) {

    return res.status(404).json(new ApiResponse(404, null, "Problem Id not found"));
  }

  const playlistDetails = await db.ProblemInPlaylist.findUnique({

    where: {
      userId: userId
    },

    include: {

      where: {
        problemId: problemId,
      },
    }

  })

})


export const addProblemToPlaylist = asyncHandler(async (req, res) => {

  const { problemId } = req.params;
  const playlistId = req.body.playlistId;


  if (!problemId) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid problemId"));
  }

  const problemInPlaylist = await db.problemInPlaylist.create({
    data: {
      problemId,
      playlistId,
    }
          })

          res.status(200).json( new ApiResponse(200, problemInPlaylist, "problem added to the playlist successfully"));

})


export const deletePlaylist = asyncHandler(async (req, res) => {

  const playlistId = req.body.playlistId;

  if (!playlistId) {
    return res.status(401).json( new ApiResopnse (401, null, "no playlist Id found to delete"));
  }

  const deletePlaylist = await db.playlist.delete({
    where: {
      playlistId,
    },
  })

  res.status(200).json( new ApiResonse(200, deletePlaylist, "playlist deleted succesfully"));

})

export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {

  const {problemId} = req.user.id;

  if (!problemId) {
    return res.status(401).json( new ApiResonse(401, null, "No problem Id found to delete"));
  }

  cosnt removeProblem = await db.problemInPlaylist.delete({
    where: {problemid},
  })

  res.status(200).json( new ApiResponse(200, removeProblem, "problem deleted from playlist successfully"));

})


