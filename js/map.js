export class DiningMap {
  constructor(mapContainerId, centerLat, centerLng) {
    this.map = L.map(mapContainerId).setView([centerLat, centerLng], 10);
    this.markers = [];
    this.initTileLayer();
    this.addHomeMarker(centerLat, centerLng);
  }

  initTileLayer() {
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.map);
  }

  addHomeMarker(lat, lng) {
    const homeIcon = L.divIcon({
      className: 'home-pin',
      html: `<span>🏠</span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });
    L.marker([lat, lng], { icon: homeIcon }).addTo(this.map)
      .bindPopup(`<b>🏠 Start Point: 3255 S Dorsey Ln</b>`);
  }

updateMarkers(dataset, onMarkerClickCallback) {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    dataset.forEach((loc, idx) => {
      const pinIcon = L.divIcon({
        className: 'custom-pin',
        html: `<span>${idx + 1}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: pinIcon }).addTo(this.map);

      // Your existing popupHTML goes here...
      const popupHTML = `
        <div style="font-family: sans-serif; width: 220px;">
          <h3 style="margin-bottom: 2px; color: #0f172a; font-size: 0.95rem;">${loc.name}</h3>
          <p style="font-size: 0.75rem; color: #166534; font-weight: bold;">🚗 ${loc.distMiles} mi (${loc.driveTime})</p>
          <a href="${loc.navUrl}" target="_blank" style="background: #2563eb; color: white; padding: 4px 8px; font-size: 0.7rem; border-radius: 4px; text-decoration: none; font-weight: bold;">Route</a>
        </div>
      `;
      marker.bindPopup(popupHTML);
      
      // NEW: Trigger callback on click
      marker.on('click', () => {
        if (onMarkerClickCallback) onMarkerClickCallback(loc.id);
      });

      this.markers.push(marker);
    });
  }

  focusLocation(lat, lng) {
    this.map.flyTo([lat, lng], 13, { duration: 1.2 });
  }
}
