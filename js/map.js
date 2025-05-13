import { Popup } from './popup/popup.js';
import { createMapExpandContent } from './popup/sections/mapExpand.js';

let map = null;
let markers = [];
let popup = null;

export function initializeMap(latitude, longitude) {
    // Initialize popup if not already done
    if (!popup) {
        popup = new Popup();
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    // If there's an existing map, clean it up first
    if (map) {
        map.remove();
        map = null;
        markers = [];
    }

    map = L.map('map').setView([latitude, longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add expand button
    const expandButton = document.createElement('button');
    expandButton.className = 'map-expand-button clickable topright-button';
    expandButton.innerHTML = '⤢';
    expandButton.title = 'Expand Map';
    mapContainer.appendChild(expandButton);

    // Add click handler for expand button
    expandButton.addEventListener('click', () => {
        popup.show(createMapExpandContent());
        setTimeout(() => {
            const expandedMapContainer = document.getElementById('expanded-map');
            if (expandedMapContainer) {
                const expandedMap = L.map('expanded-map').setView(map.getCenter(), map.getZoom());
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(expandedMap);
                
                // Copy markers to expanded map
                markers.forEach(marker => {
                    const newMarker = L.marker(marker.getLatLng());
                    if (marker.getPopup()) {
                        newMarker.bindPopup(marker.getPopup().getContent());
                    }
                    newMarker.addTo(expandedMap);
                });
            }
        }, 100);
    });
}

export function updateMap(trip) {
    if (!trip?.TripData?.PrimaryLocationAddress?.latitude || !trip?.TripData?.PrimaryLocationAddress?.longitude) {
        console.error('Invalid trip data for map update');
        return;
    }

    // Initialize or reinitialize the map
    initializeMap(trip.TripData.PrimaryLocationAddress.latitude, 
        trip.TripData.PrimaryLocationAddress.longitude);

    setTimeout(() => {

        // Add primary location marker
        const marker = L.marker([
            trip.TripData.PrimaryLocationAddress.latitude,
            trip.TripData.PrimaryLocationAddress.longitude
        ]).addTo(map);
        markers.push(marker);

        // Add activity markers
        if (trip.Objects) {
            trip.Objects.forEach(obj => {
                if (obj.is_purchased === "true" && obj.Address && obj.Address.latitude && obj.Address.longitude) {
                    const activityMarker = L.marker([
                        obj.Address.latitude,
                        obj.Address.longitude
                    ]).bindPopup(obj.display_name).addTo(map);
                    markers.push(activityMarker);
                }
            });
        }

        // Adjust map bounds
        if (markers.length > 1) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }, 100);
}

export function invalidateMapSize() {
    if (map) {
        setTimeout(() => map.invalidateSize(), 100);
    }
}
