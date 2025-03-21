import { getTripData, formatDate } from './data.js';

let currentTrip = null;
export function getCurrentTrip() {
    return currentTrip;
}

export function setCurrentTrip(trip) {
    currentTrip = trip;
}

export function initializeTripList(onTripSelect) {
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';

    const tripData = getTripData();
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
            setCurrentTrip(trip);
            onTripSelect(trip);
        });
        tripList.appendChild(tripCard);
    });
}
