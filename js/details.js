import { formatDate, formatDateTime } from './data.js';
import { Popup } from './popup.js';

const popup = new Popup();

export function showTripDetails(trip) {
    const details = document.getElementById('tripDetails');
    
    // Generate trip details HTML
    let detailsHTML = `
        <div class="detail-section">
            <h3>Trip Overview</h3>
            <div class="detail-card">
                <h4>${trip.TripData.display_name}</h4>
                <p class="dates">${formatDate(trip.TripData.start_date)} - ${formatDate(trip.TripData.end_date)}</p>
                <p class="location">${trip.TripData.primary_location}</p>
                ${trip.TripData.image_url ? `<img src="${trip.TripData.image_url}" alt="${trip.TripData.display_name}" class="trip-image">` : ''}
            </div>
        </div>
    `;

    // Add activities section
    if (trip.Objects && trip.Objects.length > 0) {
        detailsHTML += '<div class="detail-section"><h3>Activities</h3>';
        trip.Objects.forEach(obj => {
            if (obj.is_purchased === "true") {
                detailsHTML += `
                    <div class="detail-card activity-card">
                        <h4>${obj.display_name}</h4>
                        ${obj.booking_site_name ? `<p>Booked via: ${obj.booking_site_name}</p>` : ''}
                        ${obj.StartDateTime ? `
                            <p>Start: ${formatDateTime(obj.StartDateTime)}</p>
                            <p>End: ${formatDateTime(obj.EndDateTime)}</p>
                        ` : ''}
                        ${obj.Address ? `<p class="location">${obj.Address.address}</p>` : ''}
                        ${obj.notes ? `<p class="notes">${obj.notes}</p>` : ''}
                        <button class="view-details-btn">View Details</button>
                    </div>
                `;
            }
        });
        detailsHTML += '</div>';
    }

    // Update trip content
    details.innerHTML = detailsHTML;

    // Add click handlers for activity cards
    document.querySelectorAll('.activity-card').forEach((card, index) => {
        const activity = trip.Objects.filter(obj => obj.is_purchased === "true")[index];
        card.querySelector('.view-details-btn').addEventListener('click', () => {
            const content = popup.createActivityContent(activity);
            popup.show(content);
        });
    });
}
