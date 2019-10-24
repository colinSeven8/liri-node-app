
// So we can read and write environmental variables
require("dotenv").config();

// Grab all the packages that we'll need...
let axios = require("axios");
let Spotify = require("node-spotify-api");
let keys = require("./keys.js");
let moment = require("moment");
let fs = require("fs");
moment().format();

// Grab the Spotify key
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

  // Use axios to retrieve our Bands in Town API data...
  axios.get("https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp")
    .then(
      function (response) {

        // Reference the data that we need
        let data = response.data[0];

        // If there's no upcoming venue for this artist, default to Asgard, The Realm of the Gods
        //let artistName, 
        let concertDate = data.datetime;
        concertDate = moment().utc().format('MM/DD/YYYY');
        // Pass the venue name, location and date
        let output = "\n+++++++++++++++++++++++++++++LIRI found this for you!+++++++++++++++++++++++++++++++\n" +
          "The name of the venue for " + name + " is " + data.venue.name + ".\n" +
          "The location for this show is at " + data.venue.city + ", " + data.venue.region + ", in " + data.venue.country + ".\n" +
          "The show will be on " + concertDate + ".\n" + 
          "The line-up will be: " + data.lineup.join(", ") + ".\n" + 
          "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";

          // Output the data
          outputLog(output);
      })
}

// 2. `node liri.js spotify-this-song '<song name here>'`
function spotifyThisSong() {

  // No data, so we're going with "THe Sign" by "Ace of Base"
  if (!name) { name = "the Sign Ace of Base"; }

  // Run a search through Spotify based on the name of a song...
  spotify_key.search({ type: "track", query: name, limit: 1 }, function (error, data) {
    if (error) { return console.log("Error occurred: " + error); }
    else {
      // Reference the items needed for our search, and declare a variable to concat all artists
      let info = data.tracks.items[0];
      let artists = "";

      // Concat all the artists returned in our search...
      for (let i = 0; i < info.artists.length; i++) {
        if (artists != "") { artists += ", "; }
        artists += info.artists[i].name;
      }
      
      // Pass the formatted output info
      let output = "\n+++++++++++++++++++++++++++++LIRI found this for you!+++++++++++++++++++++++++++++++\n" +
        "Song name: " + info.name + ".\n" +
        "Album name: " + info.album.name + ".\n" +
        "Artist name(s): " + artists + ".\n" +
        "Preview: " + info.external_urls.spotify + ".\n" + 
        "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";

      // Display our results for the user, and log it.
      outputLog(output);
    }
  })
}

// 3. `node liri.js movie-this '<movie name here>'`
function movieThis() {

  // No data, so we're going with "Mr. Nobody"
  if (!name) { name = "Mr. Nobody"; }

  // Use axios to retrieve our OMDB API data...
  axios.get("http://www.omdbapi.com/?apikey=trilogy&limit=1&t=" + name).then(
    function (response) {

      // Reference the data needed for our search, and create a variable to hold the Rotten Tomatoes rating
      let data = response.data;
      let rottenTomatoesRating = "";

      // Whip through each of the ratings until we find the Rotten Tomatoes one...
      for (let i = 0; i < data.Ratings.length; i++) {
        if (data.Ratings[i].Source === "Rotten Tomatoes") { rottenTomatoesRating = data.Ratings[i].Value; }
      }

      let output = "\n+++++++++++++++++++++++++++++LIRI found this for you!+++++++++++++++++++++++++++++++\n" +
        "Movie title: " + data.Title + ".\n" +
        "Year released: " + data.Year + ".\n" +
        "IMDB rating: " + data.imdbRating + ".\n" +
        "Rotten Tomatoes rating: " + rottenTomatoesRating + ".\n" +
        "This movie was produced in : " + data.Country + ".\n" +
        "Original language: " + data.Language + ".\n" +
        "This movie's plot: " + data.Plot + ".\n" +
        "Actors in this movie: " + data.Actors + ".\n" + 
        "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";

      // Output results
      outputLog(output);
    });
}

// 4. `node liri.js do-what-it-says`
function doWhatItSays() {

  // Read the isntructions from the random.txt file...
  fs.readFile("random.txt", "utf8", function (error, data) {

    // Error handling
    if (error) { return console.log(error); }
    else {
      // Pass the command and the name from the random.txt file...
      let fsDataArr = data.split(",");
      command = fsDataArr[0];
      name = fsDataArr[1];

      // Process the new input from the text file through the Spotify Song function...
      spotifyThisSong();
    }
  });
}

function outputLog(data) {
  fs.appendFile("log.txt", data, function (err) {
    if (err) { throw (err); }
    console.log(data);
  })
}
