
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

document.getElementById('btMu').addEventListener('click', function () {
    // Open a new popup window with a specific size
    const popupWindow = window.open('', '_blank', 'width=400,height=400');

    // Define the content for your popup window here
    const popupContent = `
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

                        // Create an "Apply Filter" button in the popup
                        const applyFilterButton = document.getElementById('applyFilter');

                        // Close the popup window when the "Apply Filter" button is clicked
                        applyFilterButton.addEventListener('click', function () {
                            window.close();
                        });
                    });
            </script>
        </body>
        </html>
    `;

    // Write the popup content to the new window and close it after writing
    popupWindow.document.write(popupContent);
    popupWindow.document.close();
});

