function navigateToSubpage(subpage) {
    // Redirect to the desired subpage URL
    window.location.href = subpage;
  }


// Event listener for the "btInici" button
document.getElementById('btInici').addEventListener('click', navigateToSubpage('index'));

// Event listener for the "btMapa" button
document.getElementById('btMapa').addEventListener('click', navigateToSubpage('map'));

// Event listener for the "btContacte" button
//document.getElementById('btContacte').addEventListener('click', navigateToSubpage('contact.html'));