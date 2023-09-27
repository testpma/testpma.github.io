
// Create the Leaflet map
var map = L.map('map').setView([41.8719, 1.8349], 8); // Adjust the initial map view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Load data from markers.json
fetch('markers.json')
    .then((response) => response.json())
    .then((data) => {
        const listMu = document.getElementById('municipalityList');

        // Iterate through the data and create checkboxes
        data.forEach((item) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'municipality';
            checkbox.value = item.description; // Use the Description value

            const label = document.createElement('label');
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(item.description));

            listMu.appendChild(label);
        });
    });

// JavaScript code for opening the popup in a new window
document.getElementById('btMu').addEventListener('click', function () {
	// Define the content for your popup window here
	const popupContent = `
		<html>
		<head>
			<!-- Your popup window head content here -->
		</head>
		<body>
			<h3>Select Municipalities</h3>
			<div id="listMu">
				<!-- Checkbox options will be inserted here dynamically -->
			</div>
			<button id="applyFilter">Apply Filter</button>

			<script>
				fetch('markers.json')
					.then((response) => response.json())
					.then((data) => {
						// Create a new window for the popup
						const popupWindow = window.open('', '_blank', 'width=400,height=400');

						// Create a container div for the list of checkboxes
						const checkboxContainer = document.createElement('div');
						checkboxContainer.style.overflowY = 'scroll';
						checkboxContainer.style.maxHeight = '200px'; // Set the maximum height for scrollable content

						// Iterate through the data and create checkboxes
						data.forEach((item) => {
							const checkbox = document.createElement('input');
							checkbox.type = 'checkbox';
							checkbox.name = 'municipality';
							checkbox.value = item.description; // Use the Description value

							const label = document.createElement('label');
							label.appendChild(checkbox);
							label.appendChild(document.createTextNode(item.description));

							checkboxContainer.appendChild(label);
						});

						// Add the checkbox container to the popup window
						popupWindow.document.body.appendChild(checkboxContainer);

						// Create an "Apply Filter" button in the popup
						const applyFilterButton = document.createElement('button');
						applyFilterButton.id = 'applyFilter';
						applyFilterButton.textContent = 'Apply Filter';
						popupWindow.document.body.appendChild(applyFilterButton);

						// Close the popup window when the "Apply Filter" button is clicked
						applyFilterButton.addEventListener('click', function () {
							popupWindow.close();
						});

						// Set the content type and close the popup window document
						popupWindow.document.close();
					});
			</script>
		</body>
		</html>
	`;

	// Open a new popup window with your content
	const popupWindow = window.open('', '_blank', 'width=400,height=400');
	popupWindow.document.write(popupContent);
	popupWindow.document.close();
});
