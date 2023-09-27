// Function to populate a <select> element with options from a JSON file
function populateSelectFromJSON(selectId, jsonFile) {
    const selectElement = document.getElementById(selectId);

    // Fetch data from the JSON file
    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            // Populate the <select> element with options
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id; // Adjust to the appropriate property in your JSON data
                option.textContent = item.description; // Adjust to the appropriate property in your JSON data
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to update markers on the map based on selected filter values
function updateMarkers() {
    // Get selected filter values
    const selectedRegion = document.getElementById('filter-regions').value;
    const selectedChronology = document.getElementById('filter-chronologies').value;
    const selectedType = document.getElementById('filter-types').value;

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

                    // Filter data based on selected filter values
                    data = data.filter(item => {
                        return (
                            (selectedRegion === '' || item.region.includes(selectedRegion)) &&
                            (selectedChronology === '' || item.chronology.includes(selectedChronology)) &&
                            (selectedType === '' || item.type.includes(selectedType))
                        );
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

// Event listeners for filter <select> elements
document.getElementById('filter-regions').addEventListener('change', updateMarkers);
document.getElementById('filter-chronologies').addEventListener('change', updateMarkers);
document.getElementById('filter-types').addEventListener('change', updateMarkers);
document.getElementById('filter-municipalities').addEventListener('change', updateMarkers);

// Populate filter <select> elements with options from JSON files
populateSelectFromJSON('filter-regions', 'regions.json');
populateSelectFromJSON('filter-chronologies', 'chronologies.json');
populateSelectFromJSON('filter-types', 'types.json');
populateSelectFromJSON('filter-municipalities', 'municipalities.json');

// Initial marker update
updateMarkers();
