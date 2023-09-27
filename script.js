// JavaScript code for your map functionality goes here
// Initialize your map and add markers, layers, etc.

// Example: Creating a leaflet map centered at Catalonia
var map = L.map('map').setView([41.8719, 1.8349], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Example: Show the filter popup when the button is clicked
document.getElementById('filterButton').addEventListener('click', function () {
    var filterPopup = document.getElementById('filterPopup');
    filterPopup.style.display = 'block';

    // You can populate the filterPopup with your filter options here, e.g., from a JSON file.
});
