/*jshint esversion: 8 */

// Mapbox API configuration for Geocoding using dotenv to mask token and requiring as it's separate from the app proper

require('dotenv').config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

// the below is in an example of how to use the Mapbox to get the longitude and latitude (not sure which way round) of Paris. It's written as a promise

// geocodingClient
//   .forwardGeocode({
//     query: 'Paris, France',
//     limit: 1
//   })
//   .send()
//   .then(response => {
//     const match = response.body;
//     console.log(match.features[0].geometry.coordinates[0]);
//     console.log(match.features[0].geometry.coordinates[1]);
//   });



// this is the async await version of the above

// async function geocoder(location) {
//
//   let match = await geocodingClient
//     .forwardGeocode({
//       query: location,
//       limit: 1
//     })
//     .send();
//
//     console.log(match.body.features[0].geometry.coordinates[0]);
//     console.log(match.body.features[0].geometry.coordinates[1]);
// }
//
// geocoder('Cramond, Scotland');

// this is the async await version again with error handling (try and catch)

async function geocoder(location) {
  try {

    let match = await geocodingClient
      .forwardGeocode({
        query: location,
        limit: 1,
        something: 'tryand break it'
      })
      .send();

      console.log(match.body.features[0].geometry.coordinates[0]);
      console.log(match.body.features[0].geometry.coordinates[1]);
    } catch(err) {
      console.log(err.message);
    }

  }


geocoder('Cramond, Scotland');
