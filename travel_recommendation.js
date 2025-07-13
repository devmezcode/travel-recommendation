let travelData = null;

// Fetch JSON on load
fetch('travel_recommendation_api.json')
  .then(res => res.json())
  .then(data => {
    console.log("Fetched data:", data);
    travelData = data;
    showRecommendations(data);  // optional: show all by default
  });

// Listen for search button click
document.getElementById('searchButton').addEventListener('click', () => {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  handleSearch(keyword);
});

// Listen for clear button click
document.getElementById('clearButton').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  clearRecommendations();
  showRecommendations(travelData); // show all again
});

// Handle search
function handleSearch(keyword) {
  if (!travelData) return;

  clearRecommendations();

  if (keyword === 'beach' || keyword === 'beaches') {
    showItems(travelData.beaches);
  } else if (keyword === 'temple' || keyword === 'temples') {
    showItems(travelData.temples);
  } else {
    // Try to match country
    const country = travelData.countries.find(c => c.name.toLowerCase().includes(keyword));
    if (country) {
      showItems(country.cities);
    } else {
      // No match found
      showMessage(`No results found for "${keyword}".`);
    }
  }
}

// Show list of items (cities, temples, beaches)
function showItems(items) {
  const container = document.getElementById('recommendations');
  items.forEach(item => {
    const card = createCard(item.name, item.imageUrl, item.description);
    container.appendChild(card);
  });
}

// Show all recommendations
function showRecommendations(data) {
  clearRecommendations();

  // All cities
  data.countries.forEach(country => {
    country.cities.forEach(city => {
      const card = createCard(city.name, city.imageUrl, city.description);
      document.getElementById('recommendations').appendChild(card);
    });
  });

  // Temples
  data.temples.forEach(temple => {
    const card = createCard(temple.name, temple.imageUrl, temple.description);
    document.getElementById('recommendations').appendChild(card);
  });

  // Beaches
  data.beaches.forEach(beach => {
    const card = createCard(beach.name, beach.imageUrl, beach.description);
    document.getElementById('recommendations').appendChild(card);
  });
}

// Create a card
function createCard(name, imageUrl, description) {
  const div = document.createElement('div');
  div.className = 'recommendation';
  div.innerHTML = `
    <h2>${name}</h2>
    <img src="${imageUrl}" alt="${name}">
    <p>${description}</p>
  `;
  return div;
}

// Clear all displayed recommendations
function clearRecommendations() {
  document.getElementById('recommendations').innerHTML = '';
}

// Show a message if no results
function showMessage(message) {
  const container = document.getElementById('recommendations');
  container.innerHTML = `<p>${message}</p>`;
}