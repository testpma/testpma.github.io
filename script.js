function filterDbfData(regionFilter, municipalityFilter, chronologyFilter, typeFilter) {
  // Initialize an array to store matching IDs
  const matchingIds = [];

  // Loop through each entry in the dbfData JSON
  for (const entry of dbfData) {
    // Check if the provided filters match the entry's data
    if (
      (regionFilter === '' || entry.region.includes(regionFilter)) &&
      (municipalityFilter === '' || entry.municipality.includes(municipalityFilter)) &&
      (chronologyFilter === '' || entry.chronology.includes(chronologyFilter)) &&
      (typeFilter === '' || entry.type.includes(typeFilter))
    ) {
      // If all filters match, add the ID to the matchingIds array
      matchingIds.push(entry.id);
    }
  }

  // Return the list of matching IDs
  return matchingIds;
}

// Function to populate a <select> element with options from a JSON file	function filterDbfData(regionFilter, municipalityFilter, chronologyFilter, typeFilter) {
function populateSelectFromJSON(selectId, jsonFile) {	  // Initialize an array to store matching IDs
    const selectElement = document.getElementById(selectId);	  const matchingIds = [];


    // Fetch data from the JSON file	  // Loop through each entry in the dbfData JSON
    fetch(jsonFile)	  for (const entry of dbfData) {
        .then(response => response.json())	    // Check if the provided filters match the entry's data
        .then(data => {	    if (
            // Populate the <select> element with options	      (regionFilter === '' || entry.region.includes(regionFilter)) &&
            data.forEach(item => {	      (municipalityFilter === '' || entry.municipality.includes(municipalityFilter)) &&
                const option = document.createElement('option');	      (chronologyFilter === '' || entry.chronology.includes(chronologyFilter)) &&
                option.value = item.id; // Adjust to the appropriate property in your JSON data	      (typeFilter === '' || entry.type.includes(typeFilter))
                option.textContent = item.description; // Adjust to the appropriate property in your JSON data	    ) {
                selectElement.appendChild(option);	      // If all filters match, add the ID to the matchingIds array
            });	      matchingIds.push(entry.id);
        })	    }
        .catch(error => {	  }
            console.error('Error fetching data:', error);	
        });	
}	


// Function to update markers on the map based on selected filter values	  // Return the list of matching IDs
function updateMarkers() {	  return matchingIds;
    // Get selected filter values	}
    const selectedRegion = document.getElementById('filter-regions').value;	// Define the function to load regions data and populate the "Regions" filter
    const selectedChronology = document.getElementById('filter-chronologies').value;	function loadRegions() {
    const selectedType = document.getElementById('filter-types').value;		  // Select the filter-regions dropdown element
    const selectedMunicipality = document.getElementById('filter-municipalities').value;	  const regionsDropdown = document.getElementById('filter-regions');


    // Clear existing markers	  // Make an AJAX request to fetch the regions.json data
    map.eachLayer(function (layer) {	  fetch('regions.json')
        if (layer instanceof L.Marker) {	    .then((response) => response.json())
            map.removeLayer(layer);	    .then((data) => {
        }	      // Create an option element for each region and populate the select element
      data.forEach((region) => {
        const option = document.createElement('option');
        option.value = region.id;
        option.text = region.description;
        regionsDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Error loading regions data:', error);
    });	    });


    // Fetch the coordinates from "markers.json" using fetch	  // Call the functions to load Chronologies, Types, and Municipalities
    fetch('markers.json')	  loadChronologies();
        .then(response => response.json())	  loadTypes();
        .then(coordinates => {	  loadMunicipalities();
            // Fetch the filter criteria from "dbf.json" using fetch	}
            fetch('dbf.json')	
                .then(response => response.json())	
                .then(data => {	
                    console.log('Fetched data:', data);	


                    // Filter data based on selected filter values	// Define the function to load chronologies data and populate the "Chronologies" filter
                    data = data.filter(item => {	function loadChronologies() {
                        return (	  // Select the chronologies-dropdowns container element
                            (selectedRegion === '' || item.region.includes(selectedRegion)) &&	  const chronologiesDropdowns = document.getElementById('chronologies-dropdowns');
                            (selectedChronology === '' || item.chronology.includes(selectedChronology)) &&	
                            (selectedType === '' || item.type.includes(selectedType))	
                        );	
                    });	


                    // Create markers from the filtered data	  // Make an AJAX request to fetch the chronologies.json data
                    var markers = [];	  fetch('chronologies.json')
    .then((response) => response.json())
    .then((data) => {
      // Call a recursive function to build the hierarchical dropdown menus
      const chronologiesMenus = buildDropdownMenus(data);


                    coordinates.forEach(coordinate => {	      // Append the menus to the chronologies-dropdowns container
                        var latitude = coordinate.latitude;	      chronologiesMenus.forEach((menu) => {
                        var longitude = coordinate.longitude;	        chronologiesDropdowns.appendChild(menu);
                        markers.push(L.marker([latitude, longitude]).bindPopup('Marker ' + coordinate.id));	      });
                    });	    })
    .catch((error) => {
      console.error('Error loading chronologies data:', error);
    });
}


                    // Add markers to the map	// Define the function to load types data and populate the "Types" filter
                    markers.forEach(marker => {	function loadTypes() {
                        marker.addTo(map);	  // Select the types-dropdowns container element
                    });	  const typesDropdowns = document.getElementById('types-dropdowns');
                })	
                .catch(error => {	  // Make an AJAX request to fetch the types.json data
                    console.error('Error fetching data:', error);	  fetch('types.json')
                });	    .then((response) => response.json())
        })	    .then((data) => {
        .catch(error => {	      // Call a recursive function to build the hierarchical dropdown menus
            console.error('Error fetching coordinates:', error);	      const typesMenus = buildDropdownMenus(data);
        });	
      // Append the menus to the types-dropdowns container
      typesMenus.forEach((menu) => {
        typesDropdowns.appendChild(menu);
      });
    })
    .catch((error) => {
      console.error('Error loading types data:', error);
    });
}	}


// Event listeners for filter <select> elements	// Define the function to load municipalities data and populate the "Municipalities" filter
document.getElementById('filter-regions').addEventListener('change', updateMarkers);	function loadMunicipalities() {
document.getElementById('filter-chronologies').addEventListener('change', updateMarkers);	  // Select the municipalities-dropdowns container element
document.getElementById('filter-types').addEventListener('change', updateMarkers);	  const municipalitiesDropdowns = document.getElementById('municipalities-dropdowns');
document.getElementById('filter-municipalities').addEventListener('change', updateMarkers);	


// Populate filter <select> elements with options from JSON files	  // Make an AJAX request to fetch the markers.json data
populateSelectFromJSON('filter-regions', 'regions.json');	  fetch('markers.json')
populateSelectFromJSON('filter-chronologies', 'chronologies.json');	    .then((response) => response.json())
populateSelectFromJSON('filter-types', 'types.json');	    .then((data) => {
      // Create an array to store unique municipality descriptions
      const uniqueMunicipalities = [];

      // Iterate through the data and collect unique municipality descriptions
      data.forEach((marker) => {
        if (marker.description && !uniqueMunicipalities.includes(marker.description)) {
          uniqueMunicipalities.push(marker.description);
        }
      });


populateSelectFromJSON('filter-municipalities', 'municipalities.json');	      // Sort the unique municipality descriptions alphabetically
      uniqueMunicipalities.sort();


// Initial marker update	      // Create an option element for each unique municipality description and populate the select element
updateMarkers();