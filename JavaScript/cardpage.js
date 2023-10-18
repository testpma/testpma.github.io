function initializeID() {
    // Retrieve the integer from localStorage
    const myInteger = localStorage.getItem('histoMapID');

    // Get the id-display element
    const idDisplay = document.getElementById('id-display');

    // Check if myInteger is not null or undefined, then update the id-display content
    if (myInteger !== null && myInteger !== undefined) {
        // Fill the id-display div with the retrieved integer
        idDisplay.textContent = `ID: ${myInteger}`;
    } else {
        // Handle the case when the integer is not found in localStorage
        idDisplay.textContent = 'ID Not Found';
    }
}

// Call the function to fill id-display
initializeID();
