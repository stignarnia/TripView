let map = null;
let markers = [];

export function initializeMap(latitude, longitude) {
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
