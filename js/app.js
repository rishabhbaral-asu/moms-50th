import { DiningMap } from './map.js';
import { FilterEngine } from './filters.js';

const START_LAT = 33.3920;
const START_LNG = -111.9163;

document.addEventListener('DOMContentLoaded', async () => {
  // Use global data and router to calculate real driving distances
  const listContainer = document.getElementById('location-list');
  listContainer.innerHTML = `<div style="padding: 20px; text-align: center;">Calculating real driving routes...</div>`;
  
  // processRestaurants uses OSRM to get real distances using RESTAURANTS_RAW[cite: 5]
  const restaurants = await processRestaurants(RESTAURANTS_RAW); 

  const mapInstance = new DiningMap('map', START_LAT, START_LNG);
  const filterInstance = new FilterEngine(restaurants);

  // Get all HTML elements
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-by');
  const priceSelect = document.getElementById('filter-price');
  const buffetCheckbox = document.getElementById('filter-buffet');
  const cuisineSelect = document.getElementById('filter-cuisine');
  const radiusInput = document.getElementById('filter-distance');
  const radiusVal = document.getElementById('distance-val');

  // Highlight a card when a map pin is clicked
  function highlightCard(id) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    const targetCard = document.getElementById(`card-${id}`);
    if (targetCard) {
      targetCard.classList.add('active');
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function renderList(dataset) {
    listContainer.innerHTML = '';
    if (dataset.length === 0) {
      listContainer.innerHTML = `<div style="text-align:center; padding: 40px 20px; color: #64748b;"><b>No places match your criteria.</b></div>`;
      return;
    }

    dataset.forEach((loc, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.id = `card-${loc.id}`;
      // Use your existing card HTML structure here...
      card.innerHTML = `
        <div class="card-title">${idx + 1}. ${loc.name}</div>
        <div class="tag-container">
          <span>🚘 ${loc.distMiles} mi (${loc.driveTime})</span>
          <span>💰 ${loc.priceDisplay}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        mapInstance.focusLocation(loc.lat, loc.lng);
        highlightCard(loc.id);
      });

      listContainer.appendChild(card);
    });
  }

  function handleFilterChange() {
    const criteria = {
      searchQuery: searchInput.value,
      sortBy: sortSelect.value,
      maxPrice: priceSelect.value,
      buffetOnly: buffetCheckbox.checked,
      cuisine: cuisineSelect.value,
      maxRadius: parseFloat(radiusInput.value)
    };

    radiusVal.innerText = `${criteria.maxRadius} mi`;
    
    // Use the new filterAndSort method
    const filteredData = filterInstance.filterAndSort(criteria);
    
    renderList(filteredData);
    
    // Pass the highlightCard callback so clicking pins updates the UI
    mapInstance.updateMarkers(filteredData, highlightCard);
  }

  // Bind all event listeners
  searchInput.addEventListener('input', handleFilterChange);
  sortSelect.addEventListener('change', handleFilterChange);
  priceSelect.addEventListener('change', handleFilterChange);
  buffetCheckbox.addEventListener('change', handleFilterChange);
  cuisineSelect.addEventListener('change', handleFilterChange);
  radiusInput.addEventListener('input', handleFilterChange);

  // Initial setup run
  handleFilterChange();
});
