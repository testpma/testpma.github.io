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
                        // Filter by regions from regions.json
                        if (filters.regions) {
                            const regionIds = item.region.map(String);
                            const regionFilterIds = ['1', '2']; // Replace with your selected region IDs from regions.json
                            const regionMatch = regionIds.some(id => regionFilterIds.includes(id));
                            if (!regionMatch) {
                                return false;
                            }
                        }

                        // Filter by chronologies from chronologies.json
                        if (filters.chronologies) {
                            const chronologyKey = '01.01.01.'; // Replace with your selected chronology key from chronologies.json
                            if (!item.chronology.includes(chronologyKey)) {
                                return false;
                            }
                        }

                        // Filter by types from types.json
                        if (filters.types) {
                            const typeKey = '01.01.01.'; // Replace with your selected type key from types.json
                            if (!item.type.includes(typeKey)) {
                                return false;
                            }
                        }

                        return true;
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
