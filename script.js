
// Create the Leaflet map
var map = L.map('map').setView([41.8719, 1.8349], 8); // Adjust the initial map view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

addMarkersFromJSON(map);

function addMarkersFromJSON(map) {
  fetch('markers.json')
    .then(response => response.json())
    .then(data => {
      // Loop through the JSON data and add markers to the map
      data.forEach(marker => {
        const { latitude, longitude, description } = marker;
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(description);
      });
    })
    .catch(error => {
      console.error('Error reading JSON file:', error);
    });
}


// Flag variable to track whether the popup has been opened
let isPopupOpen = false;
let popupWindow = null; // Store the reference to the popup window


document.getElementById('btMu').addEventListener('click', function () {
    // Check if the popup is already open, and do not open it again
    if (isPopupOpen && popupWindow !== null && !popupWindow.closed) {
        return;
    }

    // Set the flag to indicate that the popup is open
    isPopupOpen = true;
	

    // Open a new popup window with a specific size
    popupWindow = window.open('', '_blank', 'width=400,height=400');

    // Define the content for your popup window here
    popupContent = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Filter: Municipalities</title>
        </head>
        <body>
            <h3>Select Municipalities</h3>
            <div id="listMu">
                <!-- Checkbox options will be inserted here dynamically -->
            </div>
            <button id="applyFilter">Apply Filter</button>

            <script>
                // JavaScript code for the popup window
				fetch('markers.json')
					.then((response) => response.json())
					.then((data) => {
						// Create a container div for the list of checkboxes
						const checkboxContainer = document.getElementById('listMu');
						const alphabetDropdown = document.getElementById('alphabetDropdown');
						const applyFilterButton = document.getElementById('applyFilter');

						checkboxContainer.style.overflowY = 'scroll';
						checkboxContainer.style.maxHeight = '200px';

						// Function to filter and display checkboxes based on the selected letter
						function filterCheckboxes(letter) {
							// Clear the previous checkboxes
							checkboxContainer.innerHTML = '';

							// Iterate through the data and create checkboxes for descriptions starting with the selected letter
							data.forEach((item) => {
								if (item.description.toUpperCase().startsWith(letter)) {
									const checkbox = document.createElement('input');
									checkbox.type = 'checkbox';
									checkbox.name = 'municipality';
									checkbox.value = item.description;

									const label = document.createElement('label');
									label.appendChild(checkbox);
									label.appendChild(document.createTextNode(item.description));

									checkboxContainer.appendChild(label);
								}
							});
						}

						// Populate the alphabet dropdown
						const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
						alphabet.split('').forEach((letter) => {
							const option = document.createElement('option');
							option.value = letter;
							option.textContent = letter;
							alphabetDropdown.appendChild(option);
						});

						// Handle dropdown change event
						alphabetDropdown.addEventListener('change', function () {
							const selectedLetter = this.value;
							filterCheckboxes(selectedLetter);
						});

						// Handle "Apply Filter" button click event
						applyFilterButton.addEventListener('click', function () {
							window.close();	
						});
					})
					.catch((error) => {
						console.error('Error fetching data:', error);
					});

            </script>
        </body>
        </html>
    `;

    // Write the popup content to the new window and close it after writing
    popupWindow.document.write(popupContent);
    popupWindow.document.close();
	
	// Handle the popup window close event
    popupWindow.addEventListener('beforeunload', function () {
		// Reset the flag when the popup is closed
		isPopupOpen = false;
		popupWindow = null; // Clear the reference to the closed window
    });
});
