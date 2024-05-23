import express from "express";
import { getAllMovies, findMovie, getWinnerMovies, getMoviesByLangauge, getMoviesOrderedByFresh, getCommentsByUserId } from "../data/movies.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getAllMovies(pageSize, page));
});

router.get("/winners", async (req, res) => {

  res.json(await getWinnerMovies());
});

router.get("/fresh", async (req, res) => {

  res.json(await getMoviesOrderedByFresh());
});

router.get("/language/:language", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getMoviesByLangauge(pageSize, page, req.params.language));
});

router.get("/comments/:userId", async (req, res) => {
  const comments = await getCommentsByUserId(req.params.userId);
  res.json(comments);
});

router.get("/:_id", async (req, res) => {
  const movie = await findMovie(req.params._id);
  res.json(movie);
});



export default router;
