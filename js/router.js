/**
 * router.js
 * Routing utility using Open Source Routing Machine (OSRM)
 * Calculates real-world driving distance and ETA without an API key.
 */

// Reference origin coordinate (3255 S Dorsey Ln, Tempe, AZ)
const ORIGIN_LAT = 33.3920;
const ORIGIN_LNG = -111.9163;
const ORIGIN_ADDRESS = "3255+S+Dorsey+Ln,+Tempe,+AZ+85282";

/**
 * Fallback Manhattan Grid calculation if OSRM is unreachable
 */
function computeGridFallback(lat1, lon1, lat2, lon2) {
  const dy = Math.abs(lat2 - lat1) * 69.0;
  const dx = Math.abs(lon2 - lon1) * 57.8;
  const gridDistMiles = dx + dy;
  const estTimeMins = Math.round(gridDistMiles * 1.5);

  return {
    distMiles: parseFloat(gridDistMiles.toFixed(1)),
    driveTime: `~${estTimeMins} mins`
  };
}

/**
 * Fetches driving distance & ETA for a single destination using OSRM.
 * @param {number} destLat - Destination latitude
 * @param {number} destLng - Destination longitude
 * @returns {Promise<{distMiles: number, driveTime: string}>}
 */
async function fetchRouteDetails(destLat, destLng) {
  // OSRM format requires: longitude,latitude
  const url = `https://router.project-osrm.org/route/v1/driving/${ORIGIN_LNG},${ORIGIN_LAT};${destLng},${destLat}?overview=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();

    if (data.code === 'Ok' && data.routes.length > 0) {
      const route = data.routes[0];
      
      // Convert meters to miles (1 meter = 0.000621371 miles)
      const miles = (route.distance * 0.000621371).toFixed(1);
      
      // Convert seconds to minutes
      const mins = Math.round(route.duration / 60);

      return {
        distMiles: parseFloat(miles),
        driveTime: `~${mins} mins`
      };
    } else {
      throw new Error('OSRM returned no routes');
    }
  } catch (error) {
    console.warn(`OSRM fetch failed for (${destLat}, ${destLng}). Falling back to grid distance:`, error);
    return computeGridFallback(ORIGIN_LAT, ORIGIN_LNG, destLat, destLng);
  }
}

/**
 * Enriches the raw restaurant dataset with real OSRM driving data and Google Maps directions URLs.
 * @param {Array<Object>} restaurants - Array of raw restaurant objects
 * @returns {Promise<Array<Object>>} Enriched restaurant list
 */
async function processRestaurants(restaurants) {
  // Fetch route info in parallel for fast rendering
  const routePromises = restaurants.map(loc => fetchRouteDetails(loc.lat, loc.lng));
  const routeResults = await Promise.all(routePromises);

  return restaurants.map((loc, idx) => {
    const routeInfo = routeResults[idx];
    const encodedAddr = encodeURIComponent(loc.address);

    return {
      ...loc,
      distMiles: routeInfo.distMiles,
      driveTime: routeInfo.driveTime,
      navUrl: `https://www.google.com/maps/dir/?api=1&origin=${ORIGIN_ADDRESS}&destination=${encodedAddr}`
    };
  });
}
