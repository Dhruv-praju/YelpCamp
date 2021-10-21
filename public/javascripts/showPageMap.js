mapboxgl.accessToken = mapToken;
// console.log(campground.geometry);
// MAP OBJECT
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

new mapboxgl.Marker({ color: "red" })
  .setLngLat(campground.geometry.coordinates)
  .addTo(map);
