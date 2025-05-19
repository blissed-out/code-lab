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

    include: {
      problems: {
        include: {
          problem: true,
        }
      }
    },

  })

  if (!playlistName) {
    return res.status(404).json(new ApiResponse(404, null, "No playlist found"))
  }

  res.status(200).json(new ApiResponse(200, playlistName, "playlist details fetched successfully"))

})

export const getPlayListDetails = asyncHandler(async (req, res) => {

  const { playlistId } = req.params;

  if (!playlistId) {

    return res.status(404).json(new ApiResponse(404, null, "Playlist Id not found"));
  }

  const playlistDetails = await db.playlist.findUnique({

    where: {
      playlistId,
    },

    include: {
      problems: {
        include: {
          problem: true,
        }
      }
    },

  })


  res.status(200).json( new ApiResponse(200, playlistDetails, "playlist details fetched successfully"));

})


export const addProblemToPlaylist = asyncHandler(async (req, res) => {

  const { problemIds } = req.body;
  const {playlistId} = req.body;

  if (!Array.isArray(problemsId) || problemsId.length === 0) {
    return res.status(400).json ( new ApiResponse(400, null, "invalid problemId"));
  }

  const problemInPlaylist = await db.problemInPlaylist.createMany({
    data: problemIds.map((problemId) => ({
      problemIds,
      playlistIdm
    })
    )
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
      id: playlistId,
    },
  })

  res.status(200).json( new ApiResonse(200, deletePlaylist, "playlist deleted succesfully"));

})

export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {

  const {problemIds, playlistId} = req.body;

  if (!Array.isArray(problemId) || problemId.length === 0) {
    return res.status(401).json( new ApiResonse(401, null, "Invalid problem id"));
  }

  const removeProblem = await db.problemInPlaylist.deleteMany({
    where: {
      playlistId,
      problemId: {
        in: ProblemsId,
      }
    }
  })

  res.status(200).json( new ApiResponse(200, removeProblem, "problem deleted from playlist successfully"));

})


