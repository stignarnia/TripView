let tripData = null;
let currentTrip = null;
let map = null;
let markers = [];

// Fetch and initialize the trip data
fetch('tripitdata.json')
    .then(response => response.json())
    .then(data => {
        tripData = data;
        initializeTripList();
        if (data.Trips.length > 0) {
            showTripDetails(data.Trips[0]);
        }
    });

function initializeTripList() {
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';

    tripData.Trips.sort((a, b) => 
        new Date(b.TripData.start_date) - new Date(a.TripData.start_date)
    ).forEach((trip, index) => {
        const tripCard = document.createElement('div');
        tripCard.className = 'trip-card' + (index === 0 ? ' active' : '');
        tripCard.innerHTML = `
            <h3>${trip.TripData.display_name}</h3>
            <div class="dates">
                ${formatDate(trip.TripData.start_date)} - ${formatDate(trip.TripData.end_date)}
            </div>
            <div class="location">
                ${trip.TripData.primary_location}
            </div>
        `;
        tripCard.addEventListener('click', () => {
            document.querySelectorAll('.trip-card').forEach(card => card.classList.remove('active'));
            tripCard.classList.add('active');
            showTripDetails(trip);
        });
        tripList.appendChild(tripCard);
    });
}

function showTripDetails(trip) {
    currentTrip = trip;
    const details = document.getElementById('tripDetails');
    
    // Update map
    setTimeout(() => {
        if (!map) {
            map = L.map('map').setView([trip.TripData.PrimaryLocationAddress.latitude, 
                trip.TripData.PrimaryLocationAddress.longitude], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        } else {
            // Clear existing markers
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            map.setView([trip.TripData.PrimaryLocationAddress.latitude, 
                trip.TripData.PrimaryLocationAddress.longitude], 13);
            map.invalidateSize();
        }

        // Add markers
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
                    ]).addTo(map);
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

    // Generate trip details HTML
    let detailsHTML = `
        <div class="detail-section">
            <h3>Trip Overview</h3>
            <div class="detail-card">
                <h4>${trip.TripData.display_name}</h4>
                <p class="dates">${formatDate(trip.TripData.start_date)} - ${formatDate(trip.TripData.end_date)}</p>
                <p class="location">${trip.TripData.primary_location}</p>
            </div>
        </div>
    `;

    // Add activities section
    if (trip.Objects && trip.Objects.length > 0) {
        detailsHTML += '<div class="detail-section"><h3>Activities</h3>';
        trip.Objects.forEach(obj => {
            if (obj.is_purchased === "true") {
                detailsHTML += `
                    <div class="detail-card">
                        <h4>${obj.display_name}</h4>
                        ${obj.booking_site_name ? `<p>Booked via: ${obj.booking_site_name}</p>` : ''}
                        ${obj.StartDateTime ? `
                            <p>Start: ${formatDateTime(obj.StartDateTime)}</p>
                            <p>End: ${formatDateTime(obj.EndDateTime)}</p>
                        ` : ''}
                        ${obj.Address ? `<p class="location">${obj.Address.address}</p>` : ''}
                        ${obj.notes ? `<p>${obj.notes}</p>` : ''}
                    </div>
                `;

                // No need to add markers here as they're already added in the map initialization
            }
        });
        detailsHTML += '</div>';
    }

    // Update trip content
    details.innerHTML = detailsHTML;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatDateTime(dt) {
    if (!dt || !dt.date || !dt.time) return '';
    const datetime = new Date(`${dt.date}T${dt.time}`);
    return datetime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Theme functionality with cookie persistence
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    document.cookie = `theme=${theme};path=/;max-age=31536000`; // 1 year expiry
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    if (map) {
        setTimeout(() => map.invalidateSize(), 100);
    }
}

// Initialize theme from cookie
document.addEventListener('DOMContentLoaded', () => {
    const cookieTheme = document.cookie
        .split('; ')
        .find(row => row.startsWith('theme='))
        ?.split('=')[1];
    if (cookieTheme) {
        setTheme(cookieTheme);
    }
});

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});
