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
// Define the function to load regions data and populate the "Regions" filter
function loadRegions() {
  // Select the filter-regions dropdown element
  const regionsDropdown = document.getElementById('filter-regions');

  // Make an AJAX request to fetch the regions.json data
  fetch('regions.json')
    .then((response) => response.json())
    .then((data) => {
      // Create an option element for each region and populate the select element
      data.forEach((region) => {
        const option = document.createElement('option');
        option.value = region.id;
        option.text = region.description;
        regionsDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Error loading regions data:', error);
    });

  // Call the functions to load Chronologies, Types, and Municipalities
  loadChronologies();
  loadTypes();
  loadMunicipalities();
}

// Define the function to load chronologies data and populate the "Chronologies" filter
function loadChronologies() {
  // Select the chronologies-dropdowns container element
  const chronologiesDropdowns = document.getElementById('chronologies-dropdowns');

  // Make an AJAX request to fetch the chronologies.json data
  fetch('chronologies.json')
    .then((response) => response.json())
    .then((data) => {
      // Call a recursive function to build the hierarchical dropdown menus
      const chronologiesMenus = buildDropdownMenus(data);

      // Append the menus to the chronologies-dropdowns container
      chronologiesMenus.forEach((menu) => {
        chronologiesDropdowns.appendChild(menu);
      });
    })
    .catch((error) => {
      console.error('Error loading chronologies data:', error);
    });
}

// Define the function to load types data and populate the "Types" filter
function loadTypes() {
  // Select the types-dropdowns container element
  const typesDropdowns = document.getElementById('types-dropdowns');

  // Make an AJAX request to fetch the types.json data
  fetch('types.json')
    .then((response) => response.json())
    .then((data) => {
      // Call a recursive function to build the hierarchical dropdown menus
      const typesMenus = buildDropdownMenus(data);

      // Append the menus to the types-dropdowns container
      typesMenus.forEach((menu) => {
        typesDropdowns.appendChild(menu);
      });
    })
    .catch((error) => {
      console.error('Error loading types data:', error);
    });
}

// Define the function to load municipalities data and populate the "Municipalities" filter
function loadMunicipalities() {
  // Select the municipalities-dropdowns container element
  const municipalitiesDropdowns = document.getElementById('municipalities-dropdowns');

  // Make an AJAX request to fetch the markers.json data
  fetch('markers.json')
    .then((response) => response.json())
    .then((data) => {
      // Create an array to store unique municipality descriptions
      const uniqueMunicipalities = [];

      // Iterate through the data and collect unique municipality descriptions
      data.forEach((marker) => {
        if (marker.description && !uniqueMunicipalities.includes(marker.description)) {
          uniqueMunicipalities.push(marker.description);
        }
      });

      // Sort the unique municipality descriptions alphabetically
      uniqueMunicipalities.sort();

      // Create an option element for each unique municipality description and populate the select element
      uniqueMunicipalities.forEach((municipality) => {
        const option = document.createElement('option');
        option.value = municipality;
        option.text = municipality;
        municipalitiesDropdowns.appendChild(option);
