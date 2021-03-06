/*jshint esversion: 8 */
/*jshint -W030*/

// Initialise Map
// the MapBox token is now passed in via EJS in the Post Shot Layout (post-show-layout.ejs) using dotenv for security


// I've wrapped it in and if statement so code doesn't run when no location exists
// it would probably have been simpler to use post.location but good learning experience
// although I guess this is stronger - for instance if location entered but no matches means no coordinates

if (Array.isArray(post.geometry.coordinates) && post.geometry.coordinates.length) {

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mikechalmers/ckc4vs39n13g61iqgatv4ryoa',
    center: post.geometry.coordinates,
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
    .setLngLat(post.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups - pixels above marker center
    .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
    .addTo(map);


} // end of if




// toggle edit review form - my own ES6 js

button = document.querySelectorAll('.toggle-edit-form');
for (i = 0; i < button.length; i++) {
  button[i].onclick = function() {
    // toggle the edit button text on click
    this.innerHTML === 'Edit' ? this.innerHTML = 'Cancel' : this.innerHTML = 'Edit';
    // toggle visibility of edit review form
    this.nextElementSibling.classList.toggle('toggle');
};
}

  // click listener for star ratings
  // I think it needs a for loop as there may an edit review as well as create review

stars = document.querySelectorAll('.clear-rating');
for (i = 0; i < stars.length; i++) {
 stars[i].onclick = function() {
  this.nextElementSibling.click();
  };
}
