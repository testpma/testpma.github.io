// Define your map
var map = L.map('map').setView([41.492, 1.560], 8);

// Add a tile layer (you can choose a different provider if needed)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables to store filter states
var filters = {
    markers: true,
    regions: true,
    chronologies: true,
    types: true
};

// Function to update markers on the map based on filters
function updateMarkers() {
    // Clear existing markers
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Fetch the coordinates from "markers.json" using fetch
    fetch('markers.json')
        .then(response => response.json())
        .then(coordinates => {
            // Fetch the filter criteria from "dbf.json" using fetch
            fetch('dbf.json')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data:', data);

                    // Filter data based on selected filters
                    data = data.filter(item => {
                        return (filters.markers && item.region.includes('33')) ||
                            (filters.regions && item.region.includes('33')) ||
                            (filters.chronologies && item.chronology.includes('07.03.02.')) ||
                            (filters.types && item.type.includes('01.02.02.02.03.'));
                    });

                    // Create markers from the filtered data
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
                    console.error('Error fetching data:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}

// Event listeners for filter checkboxes
document.getElementById('filter-markers').addEventListener('change', function () {
    filters.markers = this.checked;
    updateMarkers();
});

document.getElementById('filter-regions').addEventListener('change', function () {
    filters.regions = this.checked;
    updateMarkers();
});

document.getElementById('filter-chronologies').addEventListener('change', function () {
    filters.chronologies = this.checked;
    updateMarkers();
});

document.getElementById('filter-types').addEventListener('change', function () {
    filters.types = this.checked;
    updateMarkers();
});

// Initial marker update
updateMarkers();
