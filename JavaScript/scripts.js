const markersById = {};
var filteredIds
let markersData, modeEC, currentFilter;
let chronologies, regions, types, db;
const filterContainers = document.querySelectorAll('.filter-container');
var closePanelButton = document.getElementById("btCP");
var panel = document.getElementById("panel");
const cardPanel = document.getElementById('card-panel');
var btCCP = document.getElementById("btCCP");
var btSP = document.getElementById("btSP");
var btCP = document.getElementById("btCP");



// Create the Leaflet map
var map = L.map('map').setView([41.8719, 1.8349], 8); // Adjust the initial map view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

async function fetchData() {
    try {
        const response = await fetch('JSON/markers.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        markersData = await response.json();	
		filterByMunicipality();	
		document.getElementById('btMu').click();	
		const dbResponse = await fetch('JSON/dbf.json');
        if (!dbResponse.ok) {
            throw new Error('Network response was not ok');
        }
        db = await dbResponse.json();		
		document.getElementById('btClear').click();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function fetchChronologies() {
    return fetch('JSON/chronologies.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}
function fetchRegions() {
    return fetch('JSON/regions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}
function fetchTypes() {
    return fetch('JSON/types.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}
function initializeFilters() {
	fetchChronologies()
		.then(chronologies => {
			// Handle chronologies data here
			filterByChronology(chronologies);
		})
		.catch(error => {
			console.error('Error fetching chronologies:', error);
		});

	fetchRegions()
		.then(regions => {
			// Handle regions data here
			filterByRegion(regions);
		})
		.catch(error => {
			console.error('Error fetching regions:', error);
		});

	fetchTypes()
		.then(types => {
			// Handle types data here
			filterByType(types);
		})
		.catch(error => {
			console.error('Error fetching types:', error);
		});

}

function addMarkersByIdList(map, ids) {
	removeMarkersFromMap()
    // Loop through the provided list of IDs and add markers to the map
    ids.forEach(id => {
        // Find marker data in markersData based on the ID
        const markerData = markersData.find(data => data.id === id);
        
        // If marker data is found, create a marker and add it to the map
        if (markerData) {
            const { latitude, longitude, description, id } = markerData;
			var desc = description.replace(/'/g, "\\'");


            // Create a marker and store it in the markersById object
            const newMarker = L.marker([latitude, longitude])
                .addTo(map)
				.bindPopup(`<a href="#" onclick="showCPanel('${id}', '${desc}')">${description}</a>`);

            // Store the marker reference in the markersById object using the id as the key
            markersById[id] = newMarker;
	   }
    });
}

function removeMarkersFromMap() {
    // Loop through the markersById object and remove each marker from the map
    for (const id in markersById) {
        const marker = markersById[id];
        map.removeLayer(marker);
    }
}

function clearFilter() {
	removeMarkersFromMap();
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
	var checkboxesResult = filterCheckboxes();
	var matchingIds = filterAndFindIds(checkboxesResult);
	var matchingMu = filterAndFindMu(checkboxesResult, matchingIds);
	addMarkersByIdList(map, Object.keys(matchingMu));
}

function filterCheckboxes() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var filteredCheckboxes = {
        'municipality': [],
        'region': [],
        'chronology': [],
        'type': []
    };

    checkboxes.forEach(function(checkbox) {
        if (checkbox.name === 'municipality' && checkbox.checked) {
            filteredCheckboxes['municipality'].push(checkbox);
        } else if (checkbox.name === 'region' && checkbox.checked) {
            filteredCheckboxes['region'].push(checkbox);
        } else if (checkbox.name === 'chronology' && checkbox.checked) {
            filteredCheckboxes['chronology'].push(checkbox);
        } else if (checkbox.name === 'type' && checkbox.checked) {
            filteredCheckboxes['type'].push(checkbox);
        }
    });

    return filteredCheckboxes;
}

function filterAndFindIds(filteredCheckboxes) {
    // Get selected municipality values from filteredCheckboxes
	
    var selectedMu = filteredCheckboxes['municipality'] || [];
    var selectedRe = filteredCheckboxes['region'] || [];
    var selectedTy = filteredCheckboxes['type'] || [];
    var selectedCh = filteredCheckboxes['chronology'] || [];
    // Array to store matching entry IDs
    var matchingIds = [];
    // Loop through entries and check for matching municipalities
    for (var i = 0; i < db.length; i++) {
        var entry = db[i];
		
		var lengthTy = entry['type'] || [];
		var lengthRe = entry['region'] || [];
		var lengthCh = entry['chronology'] || [];  
		
        var hasMatchingRe = !selectedRe.length;
        var hasMatchingTy = !selectedTy.length;
        var hasMatchingCh = !selectedCh.length;
        // Check if selectedRe is defined and has elements
        if (selectedRe && selectedRe.length > 0) {
            for (var j = 0; j < lengthRe.length; j++) {
                var entryRe = entry['region'][j];
                for (var k = 0; k < selectedRe.length; k++) {
                    var selectedReValue = selectedRe[k].value;
                    if (entryRe === selectedReValue) {
                        hasMatchingRe = true;
                        break;
                    }
                }
                if (hasMatchingRe) {
                    break;
                }
            }
        }
        // Check if selectedTy is defined and has elements
        if (selectedTy && selectedTy.length > 0) {
            for (var j = 0; j < lengthTy.length; j++) {
                var entryTy = entry['type'][j];
                for (var k = 0; k < selectedTy.length; k++) {
                    var selectedTyValue = selectedTy[k].value;
                    if (entryTy.startsWith(selectedTyValue)) {
                        hasMatchingTy = true;
                        break;
                    }
                }
                if (hasMatchingTy) {
                    break;
                }
            }
        }
        // Check if selectedCh is defined and has elements
        if (selectedCh && selectedCh.length > 0) {          
			for (var j = 0; j < lengthCh.length; j++) {
                var entryCh = entry['chronology'][j];
                for (var k = 0; k < selectedCh.length; k++) {
                    var selectedChValue = selectedCh[k].value;
                    if (entryCh.startsWith(selectedChValue)) {
                        hasMatchingCh = true;
                        break;
                    }
                }
                if (hasMatchingCh) {
                    break;
                }
            }
        }
        // If all matching criteria are found, add entry ID to matchingIds
        if (hasMatchingRe && hasMatchingTy && hasMatchingCh) {
            matchingIds.push(entry['id']);
        }
    }

    return matchingIds;
}

function filterAndFindMu(checkboxesResult, matchingIds) {
    // Get selected municipality values from checkboxesResult
    var selectedMu = checkboxesResult['municipality'] || [];    
    // Array to store matching entry IDs
    filteredIds = {};	 
    // Loop through matching IDs and check for matching municipalities
    for (var i = 0; i < matchingIds.length; i++) {
        var entryId = matchingIds[i];        
        // Find the entry with the current ID from the database
        var entry = db.find(function(entry) {
            return entry.id === entryId;
        });
        if (entry) {
            var hasMatchingMu = !selectedMu.length;
            // Check if selectedMu is defined and has elements
            if (selectedMu && selectedMu.length > 0) {
                for (var j = 0; j < entry['municipality'].length; j++) {
                    var entryMu = entry['municipality'][j];
                    for (var k = 0; k < selectedMu.length; k++) {
                        var selectedMuValue = selectedMu[k].value;
                       if (entryMu === selectedMuValue) {
                            hasMatchingMu = true;
                            // Store entry ID within filteredIds object using the matching municipality as key
                            if (!filteredIds[entryMu]) {
                                filteredIds[entryMu] = [];
                            }
                            filteredIds[entryMu].push(entry.id);
                            break;
                        }
                    }
                    if (hasMatchingMu) {
                        break;
                    }
                }
            }else{
				for (var j = 0; j < entry['municipality'].length; j++) {
                    var entryMu = entry['municipality'][j];
                    if (!filteredIds[entryMu]) {
                        filteredIds[entryMu] = [];
                    }
                    filteredIds[entryMu].push(entry.id);                
                }				
			}            
        }
    }
    return filteredIds;
}

function getNameById(id) {
    const entry = db.find(item => item.id === id);
    return entry ? entry.name : null;
}
function getMuNameById(id) {
    const entry = markersData.find(item => item.id === id);
    return entry ? entry.name : null;
}

function enableFilters(disabledButtonId) {
  // Get all buttons
  const buttons = {
    'btRe': document.getElementById('btRe'),
    'btCh': document.getElementById('btCh'),
    'btMu': document.getElementById('btMu'),
    'btTy': document.getElementById('btTy')
  };

  // Enable all buttons
  for (const buttonId in buttons) {
    if (buttons.hasOwnProperty(buttonId)) {
      buttons[buttonId].disabled = false;
    }
  }

  // Disable the specified button
  if (buttons.hasOwnProperty(disabledButtonId)) {
    buttons[disabledButtonId].disabled = true;
  } else {
    console.error('Invalid button ID:', disabledButtonId);
  }
}

function showFilterContainer(indexToShow) {
    const filterContainers = document.querySelectorAll('.filter-container');

    // Ensure the index is within the valid range
    if (indexToShow >= 0 && indexToShow < filterContainers.length) {
        // Hide all filter containers
        filterContainers.forEach(container => {
            container.style.display = 'none';
        });

        // Show the specified filter container
        filterContainers[indexToShow].style.display = 'flex';
    } else {
        console.error('Invalid index provided.');
    }
}


function expandMuRe(filterContainer) {
    // Find the content div within the filterContainer
    const content = filterContainer.nextElementSibling.children; // Assuming the content div is the second child

    // Find the toggle button within the filterContainer
    const toggleButton = filterContainer.querySelector('.toggle-button');
    // Update button text to indicate collapse or expand state
    toggleButton.textContent = '-';

    // Toggle visibility for each municipality in the group
	for (let i = 0; i < content.length; i++) {
		content[i].style.display = 'flex';
	}
}

function collapseMuRe(filterContainer) {
    // Find the content div within the filterContainer
    const content = filterContainer.nextElementSibling.children; // Assuming the content div is the second child

    // Find the toggle button within the filterContainer
    const toggleButton = filterContainer.querySelector('.toggle-button');
    // Update button text to indicate collapse or expand state
    toggleButton.textContent = '+';

    // Toggle visibility for each municipality in the group
	for (let i = 0; i < content.length; i++) {
		content[i].style.display = 'none';
	}
}


function removeToggleButtonIfNotUnique(checkbox) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const currentValue = checkbox.value;

    // Check if currentValue is the prefix for any other checkbox's value (excluding itself)
    const hasMatch = Array.from(checkboxes).some(otherCheckbox => {
        if (otherCheckbox !== checkbox ) {
			const otherValue = otherCheckbox.value;
			if(otherValue.length - 3 === currentValue.length){
				return otherValue.startsWith(currentValue);
			}
		}
        return false; // Skip comparison for the current checkbox
    });

    // Remove the toggle button if there is no match
    const parentDiv = checkbox.parentElement;
    const toggleButton = parentDiv.querySelector('button');
    if (!hasMatch && toggleButton) {
        parentDiv.removeChild(toggleButton);
    }
}

function hidePanel() {
    panel.style.display = "none";
    btSP.style.display = "block";
    btCP.style.display = "none";
}

function showPanel() {
    panel.style.display = "block";
    btSP.style.display = "none";
    btCP.style.display = "inline-block";
}

function hideCPanel() {
    cardPanel.style.display = "none";
}

function showCPanel(idMu, description) {
	initializeCPanel(idMu, description);
    cardPanel.style.display = "block";
}

function initializeCPanel(idMu, description) {
    const municipiNameElement = document.getElementById("municipi-name");
    municipiNameElement.textContent = description;
    const cardContainer = document.getElementById("card-container");
	// Get the corresponding IDs array based on the description
    const ids = filteredIds[idMu];
	// Clear previous content
    cardContainer.innerHTML = "";

    // Iterate through the IDs array and populate the card container with ID and Name pairs
    for (const id of ids) {
        const idDiv = document.createElement("div");
        idDiv.textContent = `ID: ${id}`;

        const nameDiv = document.createElement("div");
        nameDiv.textContent = `Name: ${getNameById(id)}`; // Assuming you have a function to get names based on IDs

		// Add a click event listener to nameDiv
		nameDiv.addEventListener("click", function() {
			// Construct the URL with the id parameter
			const newUrl = `https://histomap.cat/card?id=${id}`;
			// Open the new URL in a new tab or window
			window.open(newUrl, '_blank');
		});
		
        // Append ID and Name pairs to the card container
        cardContainer.appendChild(idDiv);
        cardContainer.appendChild(nameDiv);
    }
	
}

function expandAllContent() {	
    const groups = filterContainers[currentFilter].querySelectorAll('div[data-isec="true"]');

    for (let i = 0; i < groups.length; i += 1) {
        const content = groups[i].children;
        for (let j = 0; j < content.length; j++) {
            content[j].style.display = 'flex';
        }
    }
	
	// Find the toggle button within the filterContainer
    const toggleButtons = filterContainers[currentFilter].querySelectorAll('.toggle-button');
	for (let i = 0; i < toggleButtons.length; i += 1) {
		const toggleButton = toggleButtons[i];
		// Update button text to indicate collapse or expand state
		toggleButton.textContent = '-';
	}
}

function collapseAllContent() {
    const groups = filterContainers[currentFilter].querySelectorAll('div[data-isec="true"]');

    for (let i = 0; i < groups.length; i += 1) {
        const content = groups[i].children;
        for (let j = 0; j < content.length; j++) {
            content[j].style.display = 'none';
        }
    }
	// Find the toggle button within the filterContainer
    const toggleButtons = filterContainers[currentFilter].querySelectorAll('.toggle-button');
	for (let i = 0; i < toggleButtons.length; i += 1) {
		const toggleButton = toggleButtons[i];
		// Update button text to indicate collapse or expand state
		toggleButton.textContent = '+';
	}
}

function expandAllContent1() {	
	// Expand all child nodes except nodes with values of length 3
	const allNodes = document.querySelectorAll('input[type="checkbox"]');
	allNodes.forEach(node => {
		const parentDiv = node.closest('div');
		// Update the corresponding toggle button to '-'
		const toggleButton = parentDiv.querySelector('button');
		if (toggleButton) {
			toggleButton.textContent = '-';
		}
		if (parentDiv && node.value.length > 3) {
			parentDiv.style.display = 'flex';
		}
	});   
}

function collapseAllContent1() {
    // Collapse all child nodes except nodes with values of length 3
    const allNodes = document.querySelectorAll('input[type="checkbox"]');
    allNodes.forEach(node => {
        const parentDiv = node.closest('div');
		// Update the corresponding toggle button to '+'
		const toggleButton = parentDiv.querySelector('button');
		if (toggleButton) {
			toggleButton.textContent = '+';
		}
        if (parentDiv && node.value.length > 3) {
            parentDiv.style.display = 'none';            
        }
    });
}

function selectAllContent() {	
    const checkboxes = filterContainers[currentFilter].querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = true;
    });
}

function unselectAllContent() {
	const checkboxes = filterContainers[currentFilter].querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
}

function filterByMunicipality() {
  filterContainer = filterContainers[0];
  const municipalities = [];

  // Clear existing content in the filter container
  filterContainer.innerHTML = '';

  // Loop through the markers data
  markersData.forEach(markerData => {
    const { id, description } = markerData;

    // Push id and name to municipalities array
    municipalities.push({ id: id, name: description });
  });

  // Sort the municipalities alphabetically by name, ignoring accentuation
  const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
  municipalities.sort((a, b) => collator.compare(a.name, b.name));

  // Now the municipalities array is sorted alphabetically by the municipality property, ignoring accentuation


  // Initialize variables to group municipalities by starting letter
  let currentLetter = '';
  let currentGroup = null;
  
  // Loop through sorted municipalities
  municipalities.forEach(({ id, name }) => {
    const firstLetter = collator.compare(name.charAt(0), currentLetter) === 0 ? currentLetter : name.charAt(0);

    // If the starting letter has changed, create a new group header (letter)
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;

        // Create a new group header (letter) and make it clickable
		const groupContainer = document.createElement('div');
		groupContainer.style.display = 'flex'; // Set display property to flex for inline layout

		const letterHeader = document.createElement('div');
		letterHeader.textContent = currentLetter;
		letterHeader.style.cursor = 'pointer';
		letterHeader.style.display = 'inline-flex'; // Set display property to inline-flex for inline layout

		const toggleButton = document.createElement('button');
		toggleButton.textContent = '+';
		toggleButton.style.marginLeft = '10px';
		toggleButton.style.cursor = 'pointer';
		// Assign a class to the toggleButton element
		toggleButton.classList.add('toggle-button');

		// Create a container div to hold letterHeader and toggleButton
		const containerDiv = document.createElement('div');
		containerDiv.style.display = 'flex'; // Set display property to flex for column layout
		containerDiv.style.alignItems = 'center'; // Align items vertically in the flex container
		containerDiv.appendChild(letterHeader);
		containerDiv.appendChild(toggleButton);

		containerDiv.addEventListener('click', function () {
			const isExpanded = toggleButton.textContent === '-';
			// Check if the clicked checkbox is checked and the toggleButton is expanded, or if the toggleButton is collapsed
			if (isExpanded) {
				collapseMuRe(groupContainer);
			} else {
				expandMuRe(groupContainer);
			}			
		});

		groupContainer.appendChild(containerDiv);


		filterContainer.appendChild(groupContainer);

		// Create a new group container for municipalities with that starting letter
		currentGroup = document.createElement('div');
		currentGroup.setAttribute('data-isec', 'true');
		filterContainer.appendChild(currentGroup);
    }

	// Inside your loop to create checkboxes
	const checkboxLabelContainer = document.createElement('div'); // Create a new div container
	checkboxLabelContainer.style.display = 'flex'; // Set display property to flex for inline layout
	checkboxLabelContainer.style.alignItems = 'center'; // Align items vertically in the center

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.name = 'municipality';
	checkbox.value = id;
	checkbox.style.marginRight = '10px';

	const label = document.createElement('label');
	label.textContent = name;
	label.style.fontSize = 'smaller'; // Set smaller font size for the label text		

	checkboxLabelContainer.appendChild(checkbox); // Append checkbox to the div container
	checkboxLabelContainer.appendChild(label); // Append label to the div container

	currentGroup.appendChild(checkboxLabelContainer); // Append the div container to the currentGroup div


	// Add an event listener to the label to toggle the checkbox when clicked
	label.addEventListener('click', function() {
		checkbox.checked = !checkbox.checked; // Toggle the checkbox state
	});
	/*checkbox.addEventListener('change', function() {
		if (this.checked) {
			console.log('Selected municipality:', this.value);
			// Handle selection logic
		} else {
			console.log('Deselected municipality:', this.value);
			// Handle deselection logic
		}
	});*/
  });
}

function filterByRegion(re) {
  regions = re;
  filterContainer = filterContainers[1];
  //const regionsResponse = await fetch('regions.json'); // Assuming your JSON file is named regions.json
  //const regions = await regionsResponse.json();

  // Clear existing content in the filter container
  filterContainer.innerHTML = '';

  // Initialize variables to group municipalities by starting letter
  let currentLetter = '';
  let currentGroup = null;

  // Sort the regions alphabetically by description
  regions.sort((a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }));

  // Loop through sorted regions
  regions.forEach(({ id, description }) => {
    const firstLetter = description.charAt(0).toUpperCase();

    // If the starting letter has changed, create a new group header (letter)
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;

      // Create a new group header (letter) and make it clickable
		const groupContainer = document.createElement('div');
		groupContainer.style.display = 'flex'; // Set display property to flex for inline layout

		const letterHeader = document.createElement('div');
		letterHeader.textContent = currentLetter;
		letterHeader.style.cursor = 'pointer';
		letterHeader.style.display = 'inline-flex'; // Set display property to inline-flex for inline layout

		const toggleButton = document.createElement('button');
		toggleButton.textContent = '+';
		toggleButton.style.marginLeft = '10px';
		toggleButton.style.cursor = 'pointer';
		// Assign a class to the toggleButton element
		toggleButton.classList.add('toggle-button');

		// Create a container div to hold letterHeader and toggleButton
		const containerDiv = document.createElement('div');
		containerDiv.style.display = 'flex'; // Set display property to flex for column layout
		containerDiv.style.alignItems = 'center'; // Align items vertically in the flex container
		containerDiv.appendChild(letterHeader);
		containerDiv.appendChild(toggleButton);

		containerDiv.addEventListener('click', function () {
			const isExpanded = toggleButton.textContent === '-';
			// Check if the clicked checkbox is checked and the toggleButton is expanded, or if the toggleButton is collapsed
			if (isExpanded) {
				collapseMuRe(groupContainer);
			} else {
				expandMuRe(groupContainer);
			}			
		});
		groupContainer.appendChild(containerDiv);
		filterContainer.appendChild(groupContainer);

		// Create a new group container for municipalities with that starting letter
		currentGroup = document.createElement('div');
		currentGroup.setAttribute('data-isec', 'true');
		filterContainer.appendChild(currentGroup);
    }

    // Inside your loop to create checkboxes
    const checkboxLabelContainer = document.createElement('div'); // Create a new div container
    checkboxLabelContainer.style.display = 'flex'; // Set display property to flex for inline layout
    checkboxLabelContainer.style.alignItems = 'center'; // Align items vertically in the center

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'region';
    checkbox.value = id;
    checkbox.style.marginRight = '10px';

    const label = document.createElement('label');
    label.textContent = description;	
	label.style.fontSize = 'smaller'; // Set smaller font size for the label text		

    checkboxLabelContainer.appendChild(checkbox); // Append checkbox to the div container
    checkboxLabelContainer.appendChild(label); // Append label to the div container

    currentGroup.appendChild(checkboxLabelContainer); // Append the div container to the currentGroup div

    // Add an event listener to the label to toggle the checkbox when clicked
    label.addEventListener('click', function() {
      checkbox.checked = !checkbox.checked; // Toggle the checkbox state
      //console.log('Checkbox state:', checkbox.checked); // Log the checkbox state (optional)
    });
    /*checkbox.addEventListener('change', function() {
      if (this.checked) {
        console.log('Selected region:', this.value);
        // Handle selection logic
      } else {
        console.log('Deselected region:', this.value);
        // Handle deselection logic
      }
    });*/
  });
}

function filterByType(ty) {
	types = ty;
    filterContainer = filterContainers[2];
    //const typesResponse = await fetch('types.json'); // Assuming your JSON file is named Types.json
    //const types = await typesResponse.json();

    // Clear existing content in the filter container
    filterContainer.innerHTML = '';

    function createCheckboxNode(node) {
        const checkboxLabelContainer = document.createElement('div');
        checkboxLabelContainer.style.marginLeft = node.level * 20 + 'px'; // Adjust margin for hierarchy level
        checkboxLabelContainer.style.display = 'flex'; // Set display property to flex for inline layout
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'type';
        checkbox.value = node.node.key;
        checkbox.style.marginRight = '10px';

        const label = document.createElement('label');
        label.textContent = node.node.value;
		label.style.fontSize = 'smaller'; // Set smaller font size for the label text		
		label.addEventListener('click', function() {
			checkbox.checked = !checkbox.checked; // Toggle the checkbox state
			//console.log('Checkbox state:', checkbox.checked); // Log the checkbox state (optional)
		});
		
		function collapseTy(clickedValue) {
		// Recursively collapse all child nodes that contain the clicked checkbox value
			const allNodes = document.querySelectorAll('input[type="checkbox"]');
			allNodes.forEach(node => {
				const parentDiv = node.closest('div');
				if (parentDiv && node.value.startsWith(clickedValue) && node.value !== clickedValue) {
					parentDiv.style.display = 'none';
					// Update the corresponding toggle button to '+'
					const toggleButton = parentDiv.querySelector('button');
					if (toggleButton) {
						toggleButton.textContent = '+';
					}
				}
			});
		}

		function expandTy(clickedValue) {
		// Recursively expand  all child nodes that contain the clicked checkbox value
			const allNodes = document.querySelectorAll('input[type="checkbox"]');
			allNodes.forEach(node => {
				const parentDiv = node.closest('div');
				if (parentDiv && node.value.startsWith(clickedValue) && node.value !== clickedValue && (node.value.length - 3) === clickedValue.length) {
					parentDiv.style.display = 'flex';
				}
			});
		}
		
		const toggleButton = document.createElement('button');
		toggleButton.textContent = '+';
		toggleButton.style.marginLeft = '10px';
		toggleButton.style.cursor = 'pointer';
		toggleButton.addEventListener('click', function () {
			
			const clickedValue = checkbox.value; // Get the clicked checkbox value
			// Check the current state of the toggleButton
			const isExpanded = toggleButton.textContent === '-';
			// Check if the clicked checkbox is checked and the toggleButton is expanded, or if the toggleButton is collapsed
			if (!isExpanded) {
				expandTy(clickedValue);
			} else {
				collapseTy(clickedValue);
			}
			// Update button text to indicate collapse or expand state
			toggleButton.textContent = toggleButton.textContent === '+' ? '-' : '+';
		});

        checkboxLabelContainer.appendChild(checkbox);
        checkboxLabelContainer.appendChild(label);		
		checkboxLabelContainer.appendChild(toggleButton); // Append toggle button to the div container

        filterContainer.appendChild(checkboxLabelContainer);

        /*checkbox.addEventListener('change', function() {
            if (this.checked) {
                console.log('Selected type:', this.value);
                // Handle selection logic
            } else {
                console.log('Deselected type:', this.value);
                // Handle deselection logic
            }
        });*/
    }

    function createFilterTree(nodes) {
        nodes.forEach(node => {
            createCheckboxNode(node);
            if (node.children.length > 0) {
                createFilterTree(node.children);
            }
        });		
		// Outside the loop after all checkboxes are created
		const chronologyCheckboxes = document.querySelectorAll('input[name="type"]');
		chronologyCheckboxes.forEach(checkbox => {
			removeToggleButtonIfNotUnique(checkbox);
		});
    }
    createFilterTree(types);
}

function filterByChronology(ch) {
  chronologies = ch;
  filterContainer = filterContainers[3];
  //const chronologiesResponse = await fetch('chronologies.json'); // Assuming your JSON file is named chronologies.json
  //const chronologies = await chronologiesResponse.json();

  // Clear existing content in the filter container
  filterContainer.innerHTML = '';

  function createCheckboxNode(node) {
    const checkboxLabelContainer = document.createElement('div');
    checkboxLabelContainer.style.marginLeft = node.level * 10 + 'px'; // Adjust margin for hierarchy level
    checkboxLabelContainer.style.display = 'flex'; // Set display property to flex for inline layout
    
    const labelText = node.node.value;
    const endIndex = labelText.indexOf('(Any inici:');
    const displayedText = endIndex !== -1 ? labelText.substring(0, endIndex) : labelText;
    const ignoredText = endIndex !== -1 ? labelText.substring(endIndex) : ''; // Ignored text starting from (Any inici:

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'chronology';
    checkbox.value = node.node.key;
    checkbox.style.marginRight = '10px';

    const label = document.createElement('label');
    label.textContent = displayedText;
    label.title = ignoredText; // Set ignored text as the title attribute
    label.style.fontSize = 'smaller'; // Set smaller font size for the label text
	label.addEventListener('click', function() {
		checkbox.checked = !checkbox.checked; // Toggle the checkbox state
		//console.log('Checkbox state:', checkbox.checked); // Log the checkbox state (optional)
	});
    
	function collapseCh(clickedValue) {
    // Recursively collapse all child nodes that contain the clicked checkbox value
		const allNodes = document.querySelectorAll('input[type="checkbox"]');
		allNodes.forEach(node => {
			const parentDiv = node.closest('div');
			if (parentDiv && node.value.startsWith(clickedValue) && node.value !== clickedValue) {
				parentDiv.style.display = 'none';
				// Update the corresponding toggle button to '+'
				const toggleButton = parentDiv.querySelector('button');
				if (toggleButton) {
					toggleButton.textContent = '+';
				}
			}
		});
	}

	function expandCh(clickedValue) {
    // Recursively expand  all child nodes that contain the clicked checkbox value
		const allNodes = document.querySelectorAll('input[type="checkbox"]');
		allNodes.forEach(node => {
			const parentDiv = node.closest('div');
			if (parentDiv && node.value.startsWith(clickedValue) && node.value !== clickedValue && (node.value.length - 3) === clickedValue.length) {
				parentDiv.style.display = 'flex';
			}
		});
	}
	
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '+';
    toggleButton.style.marginLeft = '10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.addEventListener('click', function () {
		const clickedValue = checkbox.value; // Get the clicked checkbox value

		// Check the current state of the toggleButton
		const isExpanded = toggleButton.textContent === '-';

		// Check if the clicked checkbox is checked and the toggleButton is expanded, or if the toggleButton is collapsed
		if (!isExpanded) {
			expandCh(clickedValue);
		} else {
			collapseCh(clickedValue);
		}

		// Update button text to indicate collapse or expand state
		toggleButton.textContent = toggleButton.textContent === '+' ? '-' : '+';
	});

	// Check if node.node.key contains a '?'
	if (!node.node.key.includes('?')) {
		checkboxLabelContainer.appendChild(checkbox); // Append checkbox to the div container
		checkboxLabelContainer.appendChild(label); // Append label to the div container		
		checkboxLabelContainer.appendChild(toggleButton); // Append toggle button to the div container
		
		filterContainer.appendChild(checkboxLabelContainer); // Append the div container to the filter container
	}
    // Add event listeners for checkbox interactions
    /*checkbox.addEventListener('change', function() {
        if (this.checked) {
            console.log('Selected chronology:', this.value);
            // Handle selection logic
        } else {
            console.log('Deselected chronology:', this.value);
            // Handle deselection logic
        }
    });*/
}


  function createFilterTree(nodes) {
    nodes.forEach(node => {
      createCheckboxNode(node);
      if (node.children.length > 0) {
        createFilterTree(node.children);
      }
    });
	// Outside the loop after all checkboxes are created
	const chronologyCheckboxes = document.querySelectorAll('input[name="chronology"]');
	chronologyCheckboxes.forEach(checkbox => {
		removeToggleButtonIfNotUnique(checkbox);
	});
  }
  // Start creating the filter tree from the top-level nodes
  createFilterTree(chronologies);
}


// Event listener for the "Expand All" button
document.getElementById('btEA').addEventListener('click', function() {
    if (modeEC === 0){
        // Call function for mode 0
        expandAllContent();
    } else if (modeEC === 1){
        // Call function for mode one
        expandAllContent1();
    }
});

// Event listener for the "Collapse All" button
document.getElementById('btCA').addEventListener('click', function() {
    if (modeEC === 0){
        // Call function for mode zero
        collapseAllContent();
    } else if (modeEC === 1){
        // Call function for mode one
        collapseAllContent1();
    }
});

// Event listener for the "Select All" button
document.getElementById('btSA').addEventListener('click', function() {
    selectAllContent();
});

// Event listener for the "Unselect All" button
document.getElementById('btUA').addEventListener('click', function() {
    unselectAllContent();
});

// Event listener for the "Municipalities" button
document.getElementById('btMu').addEventListener('click', function() {	
	modeEC = 0;
	currentFilter = 0;
    collapseAllContent();
    showFilterContainer(0);	
    enableFilters('btMu');
});

// Event listener for the "Region" button
document.getElementById('btRe').addEventListener('click', function() {
	modeEC = 0;
	currentFilter = 1;
	collapseAllContent();
    showFilterContainer(1);	
    enableFilters('btRe');
});

// Event listener for the "Types" button
document.getElementById('btTy').addEventListener('click', function() {
	modeEC = 1;
	currentFilter = 2;
	collapseAllContent1();
    showFilterContainer(2);	
    enableFilters('btTy');
});

// Event listener for the "Chronology" button
document.getElementById('btCh').addEventListener('click', function() {
	modeEC = 1;
	currentFilter = 3;
	collapseAllContent1();
    showFilterContainer(3);	
    enableFilters('btCh');
});

// Event listener for the "Search" button
document.getElementById('btFilter').addEventListener('click', function() {
	var checkboxesResult = filterCheckboxes();
	var matchingIds = filterAndFindIds(checkboxesResult);
	var matchingMu = filterAndFindMu(checkboxesResult, matchingIds);
	addMarkersByIdList(map, Object.keys(matchingMu));
});

// Event listener for the "Clear" button
document.getElementById('btClear').addEventListener('click', function() {
	clearFilter();
});

btSP.addEventListener("click", showPanel);
btCP.addEventListener("click", hidePanel);


btCCP.addEventListener("click", hideCPanel);