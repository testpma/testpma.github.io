// script.js

// Coordinates for Barcelona
var barcelona = [41.3851, 2.1734];

// Create a map centered on Barcelona
var map = L.map('map').setView(barcelona, 13); // You can adjust the zoom level as needed

// Add a tile layer (you can choose a different provider if needed)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a marker for Barcelona
L.marker(barcelona).addTo(map)
    .bindPopup('Barcelona')
    .openPopup();
