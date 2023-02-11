const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const movies = data.movies;
const reviews = data.reviews;

async function main() {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();
  const movieHacker = await movies.createMovie("Hackers"
  , "Hackers are blamed for making a virus that will capsize five oil tankers"
  , ["Crime", "Drama", "Romance"]
  , "PG-13"
  , "United Artists"
  , "Iain Softley"
  , ["Jonny Miller", "Angelina Jolie", "Matthew Lillard", "Fisher Stevens"]
  , "09/15/1995"
  , "1h 45min")
  // console.log(movieHacker);
  const movieCenter = await movies.createMovie("Center"
  , "Center are blamed for making a virus that will capsize five oil tankers"
  , ["Crime", "Drama", "Romance"]
  , "PG-13"
  , "United Artists"
  , "Iain Softley"
  , ["Jonny Miller", "Angelina Jolie", "Matthew Lillard", "Fisher Stevens"]
  , "09/15/2001"
  , "2h 45min");

  const centerReview1 = await reviews.createReview(
    movieCenter._id
    , "Not bad" 
    , "Patrick Hill"
    , "This movie was good.  It was entertaining, but as someone who works in IT, it was not very realistic"
    , 3.5);
  
  const movieTheater = await movies.createMovie(
    "Theater"
  , "Theater are blamed for making a virus that will capsize five oil tankers"
  , ["Romance"]
  , "PG-13"
  , "United Tony"
  , "Iain Softley"
  , ["Jonny Miller", "Matthew Lillard", "Fisher Stevens"]
  , "07/06/2016"
  , "2h 45min");

  const movieNBA = await movies.createMovie(
    "movieNBA"
  , "movieNBA are blamed for making a virus that will capsize five oil tankers"
  , ["sports","excited"]
  , "PG-13"
  , "United Tony"
  , "Iain Softley"
  , ["Jonny Miller", "Matthew Lillard", "Fisher Stevens"]
  , "07/06/2018"
  , "2h 45min");
  
  const movieFootball = await movies.createMovie(
    "Football"
  , "Football are football"
  , ["sports","excited"]
  , "PG-13"
  , "United Tony"
  , "Iain Softley"
  , ["Jonny Miller", "Matthew Lillard", "Fisher Stevens"]
  , "07/06/2022"
  , "2h 45min");

  const footballreview1 = await reviews.createReview(
    movieFootball._id
    , "Great" 
    , "Peixuan Woo"
    , "This movie was good. It was exciting football movie"
    , 5);

  const footballreview2 = await reviews.createReview(
    movieFootball._id
    , "bad" 
    , "Lee Smith"
    , "This movie was bad."
    , 2.34);

  const footballreview3 = await reviews.createReview(
    movieFootball._id
    , "average"
    , "Tony Smith"
    , "This movie was average."
    , 4.3);

  


  console.log('Done seeding database');

  await dbConnection.closeConnection();
}

main();
