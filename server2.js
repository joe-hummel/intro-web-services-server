//
// This is an Express server-side program that runs as a web app
// inside a web server. Express allows us to get an API --- a set
// of functions --- up and running quickly as a web service using
// JavaScript.
//
// Reference: https://expressjs.com/
//

const express = require("express");
const app = express();
const movielens = require("./movielens.js");

// 
// main() for the node.js app:
//
app.listen(3000, () => {
  console.log('**SERVER: web service running, listening on port 3000...');
});

//
// Function: "/"
//
app.get('/', (req, res) => {
  console.log('**SERVER: call to /');

  res.send('<HTML><body><H3>Home page is empty, we are a movielens service!</H3></body></HTML>');
});

//
// service functions:
//
// database ref: https://github.com/TryGhost/node-sqlite3/wiki/API
//

app.get("/movies", (req, res) => {
  try {
    console.log("**call to /movies...");

    let sql = "Select * From Movies Order By Movie_ID; -- LIMIT 20;";
    let params = [];

    movielens.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ message: err.message, data: [] });
        return;
      }

      // send response in JSON format:
      console.log("sending response");
      res.json({ message: "success", data: rows });
    });

    console.log("about to return");
  } catch (err) {
    res.status(400).json({ message: err.message, data: [] });
  }
});

app.get("/movies/top10", (req, res) => {
  try {
    console.log("**call to /movies/top10...");

    let sql = `Select Movies.Movie_ID, Title, 
      Count(Rating) As NumReviews, Avg(Rating) As AvgRating
      From Movies
      Inner Join Ratings on Movies.Movie_ID = Ratings.Movie_ID
      Group By Ratings.Movie_ID
      Having Count(Rating) >= 100
      Order By Avg(Rating) DESC, Title ASC
      Limit 10;
    `;

    // console.log(sql);

    let params = [];

    movielens.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ message: err.message, data: [] });
        return;
      }

      // send response in JSON format:
      console.log("sending response");
      res.json({ message: "success", data: rows });

      console.log("about to return");
    });
  } catch (err) {
    res.status(400).json({ message: err.message, data: [] });
  }
});

//
// /movies/topNwithM
//
// Retrieves top N movies having at least M reviews.
// By default, N = 10 and M = 100
// Use query parameters to pass N and M
//
// Example: /movies/topNwithM?N=20&M=50
//
app.get("/movies/topNwithM", (req, res) => {
  try {
    let N = 10; // defaults:
    let M = 100;

    if (req.query.N)
      N = parseInt(req.query.N);
    if (req.query.M)
      M = parseInt(req.query.M);

    console.log("**call to /movies/topNwithM where N=", N, "and M=", M);

    let sql = `Select Movies.Movie_ID, Title, 
      Count(Rating) As NumReviews, Avg(Rating) As AvgRating
      From Movies
      Inner Join Ratings on Movies.Movie_ID = Ratings.Movie_ID
      Group By Ratings.Movie_ID
      Having NumReviews >= ?
      Order By AvgRating DESC, Title ASC
      Limit ?;
    `;

    // console.log(sql);

    let params = [M, N];

    movielens.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ message: err.message, data: [] });
        return;
      }

      // send response in JSON format:
      console.log("sending response");
      res.json({ message: "success", data: rows });

      console.log("about to return");
    });
  } catch (err) {
    res.status(400).json({ message: err.message, data: [] });
  }
});

//
// /movies/topNwithM/:genre
//
// Retrieves top N movies having at least M reviews,
// but focusing on the given genre.
// By default, N = 10 and M = 100
// Use query parameters to pass N and M
//
// Example: /movies/topNwithM/drama/N=20&M=50
//
app.get("/movies/topNwithM/:genre", (req, res) => {
  try {
    let N = 10; // defaults:
    let M = 100;

    let genre = req.params.genre;

    if (req.query.N)
      N = parseInt(req.query.N);
    if (req.query.M)
      M = parseInt(req.query.M);

    console.log(
      "**call to /movies/topNwithM/",
      genre,
      "where N=",
      N,
      "and M=",
      M,
    );

    let sql = `Select Movies.Movie_ID, Title, Genre_Name,
      Count(Rating) As NumReviews, Avg(Rating) As AvgRating
      From Movies
      Inner Join Ratings on Movies.Movie_ID = Ratings.Movie_ID
      Inner Join Movie_Genres on Movies.Movie_ID = Movie_Genres.Movie_ID
      Inner Join Genres on Genres.Genre_ID = Movie_Genres.Genre_ID
      Where Genre_Name like ?
      Group By Movies.Movie_ID
      Having NumReviews >= ?
      Order By AvgRating DESC, Title ASC
      Limit ?;
      `;

    // console.log(sql);

    let params = [genre, M, N];

    movielens.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ message: err.message, data: [] });
        return;
      }

      // send response in JSON format:
      console.log("sending response");
      res.json({ message: "success", data: rows });

      console.log("about to return");
    });
  } catch (err) {
    res.status(400).json({ message: err.message, data: [] });
  }
});
