// So we can read and write environmental variables
require("dotenv").config();

// Grab all the packages that we'll need...
let axios = require("axios");
let inquirer = require("inquirer");
let Spotify = require("node-spotify-api");
let keys = require("./keys.js");
let moment = require("moment");
let fs = require("fs");

// Grab the Spotify key
let spotify_key = new Spotify(keys.spotify);
let spotify_key = new Spotify(keys.spotify);
let spotify_key = new Spotify(keys.spotify);

// Variables for the user commands and band/song/movie names
let command = process.argv[2];
let name = process.argv[3];

// Depending on what the user wants to do, switch to the appropriate method
switch (command) {
  case "concert-this": concertThis();
    break;
  case "spotify-this-song": spotifyThisSong();
    break;
  case "movie-this": movieThis();
    break;
  case "do-what-it-says": doWhatItSays();
    break;
}

// 1. `node liri.js concert-this <artist/band name here>`
function concertThis() {
  axios.get("https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp")
  .then(
    function(response) {
      let data = response.data[0];

      // Print the venue name, location and date
      console.log("\n+++++++++++++++++++++++++++++LIRI found this for you!+++++++++++++++++++++++++++++++\n");
      console.log("The name of the venue for " + name + " is " + data.venue.name + ".");
      console.log("The location for this show is at " + data.venue.city + ", " + data.venue.region + ", in " + data.venue.country + ".");
      console.log("The show will be on " + data.datetime.moment().utc().format('MM/DD/YYYY') + ".");
    })
  }

  // 2. `node liri.js spotify-this-song '<song name here>'`
  function spotifyThisSong() {

    //
  }

  // 3. `node liri.js movie-this '<movie name here>'`
  function movieThis() {

  }

  // 4. `node liri.js do-what-it-says`
  function doWhatItSays() {

  }

  // Run the axios.all and axios.get functions...
  // Get the Spotiy, Bands in Town, and OMDB APIs...
  axios.all([
    axios.get("https://www.npmjs.com/package/node-spotify-api"),
    axios.get("http://www.artists.bandsintown.com/bandsintown-api"),
    axios.get("http://www.omdbapi.com"),
    axios.get("https://www.npmjs.com/package/moment"),
    axios.get("https://www.npmjs.com/package/dotenv")
  ])
    .then(axios.spread(function (spotifyResponse, bandsResponse, omdbResponse, momentResponse, dotenvResponse) {
      // If the axios was successful...
      // Then log the body from the site!
      console.log(response.data);
    }))
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
