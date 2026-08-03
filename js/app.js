import { DiningMap } from './map.js';
import { FilterEngine } from './filters.js';

const START_LAT = 33.3920;
const START_LNG = -111.9163;

document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('./data/restaurants.json');
  const restaurants = await response.json();

  const mapInstance = new DiningMap('map', START_LAT, START_LNG);
  const filterInstance = new FilterEngine(restaurants);

  const priceSelect = document.getElementById('filter-price');
  const styleSelect = document.getElementById('filter-style');
  const cuisineSelect = document.getElementById('filter-cuisine');
  const radiusInput = document.getElementById('filter-radius');
  const radiusVal = document.getElementById('radius-val');
  const listContainer = document.getElementById('location-list');

  function renderList(dataset) {
    listContainer.innerHTML = '';
    if (dataset.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding: 40px 20px; color: #64748b;">
          <b>No places match your criteria.</b><br>
          <span style="font-size:0.8rem;">Try setting max price to $$$ or expanding your distance slider.</span>
        </div>`;
      return;
    }

    dataset.forEach((loc, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.id = `card-${loc.id}`;
      card.innerHTML = `
        <div class="card-header-row">
          <div class="card-title">${idx + 1}. ${loc.name}</div>
          <div class="rating-badge">${loc.rating}</div>
        </div>
        <div class="tag-container">
          <span class="dist-tag">🚘 ${loc.distMiles} mi (${loc.driveTime})</span>
          <span class="price-tag">💰 ${loc.priceDisplay}</span>
          <span class="cuisine-tag">${loc.cuisine}</span>
          ${loc.isBuffet ? '<span class="buffet-tag">🍱 AYCE / Buffet</span>' : ''}
        </div>
        <div class="card-address">📍 ${loc.address}</div>
        <div class="foodie-highlight">🍗 <b>Non-Beef/Pork Stars:</b> ${loc.dishes}</div>
        <div class="btn-group">
          <a href="${loc.navUrl}" target="_blank" class="action-btn btn-nav" onclick="event.stopPropagation();">🚗 Route from Home</a>
          <a href="${loc.menuUrl}" target="_blank" class="action-btn btn-secondary" onclick="event.stopPropagation();">📖 Menu</a>
          <a href="${loc.googleMapUrl}" target="_blank" class="action-btn btn-secondary" onclick="event.stopPropagation();">⭐ Reviews</a>
        </div>
      `;

      card.addEventListener('click', () => {
        mapInstance.focusLocation(loc.lat, loc.lng);
        document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });

      listContainer.appendChild(card);
    });
  }

  function handleFilterChange() {
    const criteria = {
      maxPrice: priceSelect.value,
      style: styleSelect.value,
      cuisine: cuisineSelect.value,
      maxRadius: parseFloat(radiusInput.value)
    };

    radiusVal.innerText = `${criteria.maxRadius} mi`;
    const filteredData = filterInstance.filter(criteria);
    
    renderList(filteredData);
    mapInstance.updateMarkers(filteredData);
  }

  priceSelect.addEventListener('change', handleFilterChange);
  styleSelect.addEventListener('change', handleFilterChange);
  cuisineSelect.addEventListener('change', handleFilterChange);
  radiusInput.addEventListener('input', handleFilterChange);

  // Initial setup run
  handleFilterChange();
});
