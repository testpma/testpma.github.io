function initializeID() {
    // Retrieve the integer from localStorage
    //const id = localStorage.getItem('histoMapID');

    // Get the id-display element
    const idDisplay = document.getElementById('id-display');
	
	const urlParams = new URLSearchParams(window.location.search);
	const id = parseInt(urlParams.get('id'));

    // Check if myInteger is not null or undefined, then update the id-display content
    if (id !== null && id !== undefined) {
        // Fill the id-display div with the retrieved integer
        idDisplay.textContent = `ID: ${id}`;
		
    } else {
        // Handle the case when the integer is not found in localStorage
        idDisplay.textContent = 'ID Not Found';
    }
}

// Call the function to fill id-display
initializeID();
