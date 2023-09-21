// Create a map centered on Catalonia
var map = L.map('map').setView([41.492, 1.560], 8);

// Add a tile layer (you can choose a different provider if needed)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the coordinates from "coordinates.json" using fetch
fetch('coordinates.json')
    .then(response => response.json())
    .then(coordinates => {
        console.log('Fetched coordinates:', coordinates); 
		// Check if data is correctly fetched
        // Create markers from the fetched coordinates
        var markers = [];

        coordinates.forEach(coordinate => {
            var latitude = coordinate.latitude;
            var longitude = coordinate.longitude;
            markers.push(L.marker([latitude, longitude]).bindPopup('Marker ' + coordinate.id));
        });

        // Add markers to the map
        markers.forEach(marker => {
            marker.addTo(map);
        });
    })
    .catch(error => {
        console.error('Error fetching coordinates:', error);
    });
