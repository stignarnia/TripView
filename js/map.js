let map = null;
let markers = [];

export function initializeMap(latitude, longitude) {
    if (!map) {
        map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }
}

export function updateMap(trip) {
    setTimeout(() => {
        if (!map) {
            initializeMap(trip.TripData.PrimaryLocationAddress.latitude, 
                trip.TripData.PrimaryLocationAddress.longitude);
        } else {
            // Clear existing markers
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            map.setView([trip.TripData.PrimaryLocationAddress.latitude, 
                trip.TripData.PrimaryLocationAddress.longitude], 13);
            map.invalidateSize();
        }

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
