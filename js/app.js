import { DiningMap } from './map.js';
import { FilterEngine } from './filters.js';

const START_LAT = 33.3920;
const START_LNG = -111.9163;

document.addEventListener('DOMContentLoaded', async () => {
  // Use global data and router to calculate real driving distances
  const listContainer = document.getElementById('location-list');
  listContainer.innerHTML = `<div style="padding: 20px; text-align: center;">Calculating real driving routes...</div>`;
  
  // processRestaurants uses OSRM to calculate real road distances from RESTAURANTS_RAW
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

  // Highlight a card when a map pin or card is clicked
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

      card.innerHTML = `
        <div class="card-header-row" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div class="card-title" style="font-weight: 700; font-size: 1rem; color: #2d3748;">${idx + 1}. ${loc.name}</div>
          <div class="rating-badge" style="background: #edf2f7; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 0.8rem;">${loc.rating}</div>
        </div>

        <div class="tag-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
          <span class="price-tag" style="background: #e2e8f0; color: #4a5568; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px;">💰 ${loc.priceDisplay}</span>
          <span class="cuisine-tag" style="background: #e2e8f0; color: #4a5568; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px;">${loc.cuisine}</span>
          ${loc.isBuffet ? '<span class="buffet-tag" style="background: #feebc8; color: #742a2a; font-weight: 600; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px;">🍱 AYCE / Buffet</span>' : ''}
        </div>

        <!-- Google Maps Style Prominent Directions Banner -->
        <div style="margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: bold; color: #1e293b; font-size: 0.95rem;">🚘 ${loc.distMiles} mi</div>
            <div style="font-size: 0.8rem; color: #64748b;">${loc.driveTime} drive</div>
          </div>
          <a href="${loc.navUrl}" target="_blank" onclick="event.stopPropagation();" style="background: #2563eb; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.85rem; display: flex; gap: 6px; align-items: center;">
            <span style="font-size: 1.1rem; line-height: 1;">↱</span> Directions
          </a>
        </div>

        <div class="card-address" style="font-size: 0.85rem; color: #4a5568; margin-bottom: 6px;">📍 ${loc.address}</div>
        <div class="foodie-highlight" style="font-size: 0.85rem; color: #4a5568; margin-bottom: 10px;">🍗 <b>Highlights:</b> ${loc.dishes}</div>

        <div class="btn-group" style="display: flex; gap: 8px;">
          <a href="${loc.menuUrl}" target="_blank" class="action-btn btn-secondary" onclick="event.stopPropagation();" style="flex: 1; text-align: center; background: #edf2f7; color: #2d3748; padding: 6px; border-radius: 4px; text-decoration: none; font-size: 0.8rem; font-weight: 600;">📖 Menu</a>
          <a href="${loc.googleMapUrl}" target="_blank" class="action-btn btn-secondary" onclick="event.stopPropagation();" style="flex: 1; text-align: center; background: #edf2f7; color: #2d3748; padding: 6px; border-radius: 4px; text-decoration: none; font-size: 0.8rem; font-weight: 600;">⭐ Reviews</a>
        </div>
      `;

      card.addEventListener('click', () => {
        // NEW: Draw the route line!
        if (loc.geometry) {
          mapInstance.drawRoute(loc.geometry);
        } else {
          // If fallback was used and no route exists, just focus the pin
          mapInstance.focusLocation(loc.lat, loc.lng);
        }
        
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
    
    // Filter and sort dataset
    const filteredData = filterInstance.filterAndSort(criteria);
    
    renderList(filteredData);
    
    // Pass callback to highlight card when map markers are clicked
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
