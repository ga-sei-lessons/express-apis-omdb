require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const axios = require('axios');

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// console.log(`http://www.omdbapi.com/?i=tt3896198&apikey=${process.env.API_KEY}`)

// Routes
//GET / -- show search form for OMDB
app.get('/', function(req, res) {
  res.render('index.ejs');
});

//GET /results -- take in data from search form, render search results from OMDB
app.get('/results', (req, res) => {
  const userSearch = req.query.movieInput;
  axios.get(`http://www.omdbapi.com/?s=${userSearch}&apikey=${process.env.API_KEY}`)
  .then(response => {
    console.log(response.data);
    res.render('results.ejs', {
      movies: response.data.Search,
      userSearch,
    });
  })
  .catch(err => {
    console.log(err);
    res.send('server error');
  })
});

// /GET /movies/:id -- render a page of details about a single movie with an id of :id
app.get('/movies/:id', (req, res) => {
  const movieID = req.params.id;
  axios.get(`http://www.omdbapi.com/?i=${movieID}&apikey=${process.env.API_KEY}`)
  .then(response => {
    res.render('detail.ejs', {
      movieDetails: response.data
      
    })
  })
})

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
