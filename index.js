import express from "express";
import axios from "axios";

import "dotenv/config";

const app = express();

const PORT = 3000;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.MOVIEDB_API_KEY}`,
  },
};

app.get("/", async (req, res) => {
  const response = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/authenticationasdasdf`,
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err));

  res.send({ resonse: response });
});

// 1. Fetch Popular Movies
// Endpoint: GET /movies/popular
// Task:
// Use TMDB’s popular movies endpoint to fetch a list of movies.
// Extract and return key details such as:
// - id
// - title
// - release_date
// - vote_average
app.get("/movies/popular", async (req, res) => {
  const response = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/movie/popular?language=en-US&page=1`,
    })
    .then((res) => res.data)
    .catch((err) => console.error(err));

  res.send({ success: "ok", data: response });
});

// 2. Search Movies by Title
// Endpoint: GET /movies/search?query=<search_query>
// Task:
// Use the search endpoint to find movies by title.
// Example: /movies/search?title=Inception
// Return the top 5 results, including:
// - id
// - title
// - overview
// - release_date
app.get("/movies/search", async (req, res) => {
  const { query } = req.query;

  const response = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/search/movie?query=${query}&language=en-US&page=1`,
    })
    .then((res) => res.data)
    .catch((err) => console.error(err));

  res.send({ success: "ok", data: response });
});

// 3. Get Details of a Specific Movie
// Endpoint: GET /movies&query=<movie_title>
// Task:
// Fetch and return detailed information about a specific movie using its name.
// Example: /movies&query=Inception
// Include details such as:
// - title
// - tagline
// - overview
// - release_date
// - runtime
app.get("/movies", async (req, res) => {
  const { query } = req.query;
  const movieId = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/search/movie?query=${query}&language=en-US&page=1`,
    })
    .then((res) => res.data.results[0].id)
    .catch((err) => console.error(err));

  console.log(movieId);

  const response = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/movie/${movieId}?language=en-US`,
    })
    .then((res) => res.data)
    .catch((err) => console.error(err));

  res.send({ success: "ok", data: response });
});

// 4. Fetch Now Playing Movies
// Endpoint: GET /movies/now-playing
// Task:
// Use the “Now Playing” endpoint to list movies currently in theaters.
// Return the top 10 movies with details:
// - title
// - release_date
// - poster_path (poster image URL)
app.get("/movies/now-playing", async (req, res) => {
  const response = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/movie/now_playing?language=en-US&page=1`,
    })
    .then((res) => res.data)
    .catch((err) => console.error(err));

  res.send({ success: "ok", data: response });
});

// 5. Fetch Movies by Genre
// Endpoint: GET /movies/genre?query=<genre_name>
// Task:
// Use the genres endpoint to fetch movies for a specific genre.
// Example: /movies/genre?query=Action (Action)
// Return the first 10 results with:
// - id
// - title
// - genre_ids (list of genre IDs)
app.get("/movies/genre", async (req, res) => {
  const { query } = req.query;

  const genreId = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/genre/movie/list?language=en-US`,
    })
    .then((res) => res.data.genres.find((genre) => genre.name === query).id)
    .catch((err) => console.error(err));

  const response = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/discover/movie?with_genres=${genreId}&language=en-US&page=1`,
    })
    .then((res) => res.data)
    .catch((err) => console.error(err));

  res.send({ success: "ok", data: response });
});

// 6. Fetch Credits for a Movie
// Endpoint: GET /movies/credits&query=<movie_name>
// Task:
// Fetch the cast and crew of a specific movie using its ID.
// Example: /movies/credits?query=Inception
// Return a JSON object with:
// cast: Array of actors:
// - id, name, character
// - crew: Array of crew members (limit to top 3):
// - id, name, job
app.get("/movies/credits", async (req, res) => {
  const { query } = req.query;
  const movieId = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/search/movie?query=${query}&language=en-US&page=1`,
    })
    .then((res) => res.data.results[0].id)
    .catch((err) => console.error(err));

  const response = await axios
    .request({
      ...options,
      url: `${process.env.MOVIE_DB_URL}/movie/${movieId}/credits?language=en-US`,
    })
    .then((res) => res.data)
    .catch((err) => console.error(err));

  res.send({ success: "ok", data: response });
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT} 🚚`);
});
