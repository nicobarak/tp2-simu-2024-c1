import getConnection from "./conn.js";
import { ObjectId } from "mongodb";
const DATABASE = "sample_mflix";
const MOVIES = "movies";
const USERS = "users";
const COMMENTS = "comments";

async function getAllMovies(pageSize, page) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({})
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}

async function getCommentsByUserId(userId) {
  const connectiondb = await getConnection();

  const user = await connectiondb
    .db(DATABASE)
    .collection(USERS)
    .findOne({ _id: new ObjectId(userId) });

  const comments = await connectiondb
    .db(DATABASE)
    .collection(COMMENTS)
    .find({ email: user.email })
    .toArray();

    const comment_movie_ids = comments.map(comment =>  comment.movie_id);

    const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({})
    .toArray();


  //const userComments = comments.filter((comment) => comment.email == user.email);

  const fullComments = comments.map((comment) => {
    const movie = movies.find(movie => movie._id.toString() == comment.movie_id.toString());  
    console.log(movie.poster)
    return {
      _id: comment._id,
      name: comment.name,
      email: comment.email,
      text: comment.text,
      date: comment.date,
      title: movie?.title,
      poster: movie?.poster,
    };
  });

  return fullComments;
}

async function getWinnerMovies() {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({})
    .toArray();
  const winnerMovies = movies.filter((movie) => movie.awards.wins > 0);

  return winnerMovies;
}

async function getMoviesByLangauge(pageSize, page, language) {
  const connectiondb = await getConnection();
  const lang_movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({ languages: language })
    .skip(pageSize * page)
    .limit(pageSize)
    .toArray();

  return lang_movies;
}

async function findMovie(_id) {
  const connectiondb = await getConnection();
  const movie = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .findOne({ _id: new ObjectId(_id) });
  return movie;
}

async function getMoviesOrderedByFresh() {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({ "tomatoes.fresh": { $exists: true } })
    .toArray();

  const orderedMovies = movies.sort(
    (a, b) => b.tomatoes.fresh - a.tomatoes.fresh
  );
  return orderedMovies;
}

export {
  getAllMovies,
  findMovie,
  getWinnerMovies,
  getMoviesByLangauge,
  getMoviesOrderedByFresh,
  getCommentsByUserId,
};
