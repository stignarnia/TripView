import { getTripData, formatDate } from './utils/data.js';

let currentTrip = null;
export function getCurrentTrip() {
    return currentTrip;
}

export function setCurrentTrip(trip) {
    currentTrip = trip;
}

function getNextActivityInfo(trip) {
    if (!trip.Activities || trip.Activities.length === 0) return '';
    
    const now = new Date();
    const nextActivity = trip.Activities
        .filter(activity => new Date(activity.StartDateTime?.date) > now)
        .sort((a, b) => new Date(a.StartDateTime?.date) - new Date(b.StartDateTime?.date))[0];
    
    if (!nextActivity) return '';
    
    return `
        <div class="info-row next-activity">
            <span class="icon">⏰</span>
            <span>Next: ${nextActivity.display_name}</span>
        </div>`;
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
            <div class="trip-header">
                <h3>${trip.TripData.display_name}</h3>
                ${trip.TripData.trip_status ? `<span class="trip-status ${trip.TripData.trip_status.toLowerCase()}">${trip.TripData.trip_status}</span>` : ''}
            </div>
            <div class="trip-info">
                <div class="info-row">
                    <span class="icon">📅</span>
                    <span>${formatDate(trip.TripData.start_date)} - ${formatDate(trip.TripData.end_date)}</span>
                </div>
                <div class="info-row">
                    <span class="icon">📍</span>
                    <span>${trip.TripData.primary_location}</span>
                </div>
                ${trip.TripData.total_activities ? `
                <div class="info-row">
                    <span class="icon">📋</span>
                    <span>${trip.TripData.total_activities} Activities</span>
                </div>` : ''}
                ${getNextActivityInfo(trip)}
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
