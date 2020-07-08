/*jshint esversion: 8 */

// Initialise Map
mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZWNoYWxtZXJzIiwiYSI6ImNrYzI5dTNoZTIxanMyd214cHJpZmZpdW4ifQ.e3vhqufW1d5uUry3RG8lYg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mikechalmers/ckc4vs39n13g61iqgatv4ryoa',
  center: post.coordinates,
  zoom: 10
});

// // Load GeoJSON data
//
// var geojson = {
//   type: 'FeatureCollection',
//   features: [{
//     type: 'Feature',
//     geometry: {
//       type: 'Point',
//       coordinates: [151.21111, -33.88611]
//     },
//     properties: {
//       title: 'Mapbox',
//       description: 'Surry Hills !!!'
//     }
//   }]
// };

// Add marker to map

// create a HTML element
var el = document.createElement('div');
el.className = 'marker';

// make a marker and add to the map
new mapboxgl.Marker(el)
  .setLngLat(post.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups - pixels above marker center
  .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
  .addTo(map);


// toggle edit review form - my own ES6 js
  const button = document.querySelector('.toggle-edit-form');
  const form = document.querySelector('.edit-review-form');
  button.onclick = function() {
    // toggle the edit button text on click
    button.innerHTML === 'Edit' ? button.innerHTML = 'Cancel' : button.innerHTML = 'Edit';
    // toggle visibility of edit review form
    button.nextElementSibling.classList.toggle('toggle');
  };
