import { Router } from "express";
import { isLoggedIn } from "../middlewares/login.middleware.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllListDetails,
  getPlayListDetails,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.get("/", isLoggedIn, getAllListDetails);

playlistRouter.get("/:playlistId", isLoggedIn, getPlayListDetails);

playlistRouter.post("/create-playlist", isLoggedIn, createPlaylist);

playlistRouter.post(
  "/:playlistId/add-problem",
  isLoggedIn,
  addProblemToPlaylist,
);

playlistRouter.delete("/:playlistId", isLoggedIn, deletePlaylist);

playlistRouter.delete(
  "/:playlistId/remove-problem",
  isLoggedIn,
  removeProblemFromPlaylist,
);

export default playlistRouter;
