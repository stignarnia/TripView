import { formatDate, formatDateTime } from './utils/data.js';
import { Popup } from './popup/popup.js';

const popup = new Popup();

function renderJourneyCard(type, segments) {
    const firstSegment = segments[0];
    return `
        <div class="detail-card activity-card clickable" data-full-journey='${JSON.stringify(firstSegment.fullObject)}'>
            <h4>${type}</h4>
            ${segments.map(item => `
                <div class="journey-info">
                    <div class="route">
                        <span>${type === 'Flight' ? 
                            item.segment.start_airport_code : 
                            item.segment.start_station_name?.split(' ')[0]}</span>
                        <span class="arrow">→</span>
                        <span>${type === 'Flight' ? 
                            item.segment.end_airport_code : 
                            item.segment.end_station_name?.split(' ')[0]}</span>
                    </div>
                    <div class="time">
                        ${formatDateTime(item.segment.StartDateTime)}
                    </div>
                    <div class="details">
                        ${type === 'Flight' ? 
                            `${item.segment.marketing_airline} ${item.segment.marketing_flight_number}` : 
                            `${item.segment.train_type} ${item.segment.train_number}`}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

export function showTripDetails(trip) {
    const details = document.getElementById('tripDetails');
    
    // Generate trip details HTML
    let detailsHTML = `
        <div class="detail-section">
            <h3>Trip Overview</h3>
            <div class="detail-card clickable">
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
        
        // Create timeline of all activities
        let timeline = [];
        trip.Objects.forEach(obj => {
            if (obj.is_purchased === "true") {
                if ((obj.display_name === 'Flight' || obj.display_name === 'Rail') && 
                    obj.Segment && Array.isArray(obj.Segment) && obj.Segment.length > 0) {
                    // Group segments by date
                    const segments = obj.Segment.filter(s => Object.keys(s).length > 0)
                        .map(segment => ({
                            type: obj.display_name,
                            segment: segment,
                            fullObject: obj,
                            date: segment.StartDateTime.date,
                            startTime: new Date(segment.StartDateTime.date + 'T' + segment.StartDateTime.time)
                        }));
                    timeline.push(...segments);
                } else {
                    timeline.push({
                        type: 'other',
                        object: obj,
                        date: obj.StartDateTime?.date,
                        startTime: obj.StartDateTime ? 
                            new Date(obj.StartDateTime.date + 'T' + obj.StartDateTime.time) : 
                            new Date(0)
                    });
                }
            }
        });

        // Sort timeline chronologically
        timeline.sort((a, b) => a.startTime - b.startTime);

        // Process timeline in order, keeping segments together when they belong to same booking
        let journeySegments = [];

        timeline.forEach((item, index) => {
            if (item.type === 'Flight' || item.type === 'Rail') {
                const nextItem = timeline[index + 1];
                const isSameBooking = journeySegments.length > 0 && 
                                    journeySegments[0].fullObject === item.fullObject;
                
                // Start new group if:
                // 1. No current segments, or
                // 2. Different booking, or
                // 3. Next item is a different type of activity
                if (!isSameBooking) {
                    if (journeySegments.length > 0) {
                        detailsHTML += renderJourneyCard(journeySegments[0].type, journeySegments);
                        journeySegments = [];
                    }
                    journeySegments.push(item);
                } else {
                    journeySegments.push(item);
                    
                    // Check if we should render the current group
                    if (!nextItem || nextItem.type === 'other' || 
                        (nextItem.type === item.type && nextItem.fullObject !== item.fullObject)) {
                        detailsHTML += renderJourneyCard(journeySegments[0].type, journeySegments);
                        journeySegments = [];
                    }
                }
            } else {
                if (journeySegments.length > 0) {
                    detailsHTML += renderJourneyCard(journeySegments[0].type, journeySegments);
                    journeySegments = [];
                }

                detailsHTML += `
                    <div class="detail-card activity-card clickable">
                        <h4>${item.object.display_name}</h4>
                        ${item.object.StartDateTime ? `
                            <p>Start: ${formatDateTime(item.object.StartDateTime)}</p>
                            <p>End: ${formatDateTime(item.object.EndDateTime)}</p>
                        ` : ''}
                        ${item.object.Address ? `<p class="location">${item.object.Address.address}</p>` : ''}
                        ${item.object.notes ? `<p class="notes">${item.object.notes}</p>` : ''}
                    </div>
                `;
            }
        });

        // Render any remaining journey segments
        if (journeySegments.length > 0) {
            detailsHTML += renderJourneyCard(journeySegments[0].type, journeySegments);
        }

        detailsHTML += '</div>';
    }

    // Update trip content
    details.innerHTML = detailsHTML;

    // Add click handler for trip overview
    const overviewCard = details.querySelector('.detail-section:first-child .detail-card');
    overviewCard.addEventListener('click', () => {
        const content = popup.createActivityContent({
            display_name: trip.TripData.display_name,
            StartDateTime: { date: trip.TripData.start_date, time: "00:00:00" },
            EndDateTime: { date: trip.TripData.end_date, time: "23:59:59" },
            Address: trip.TripData.PrimaryLocationAddress,
            image_url: trip.TripData.image_url
        });
        popup.show(content);
    });

    // Add click handlers for activity cards
    document.querySelectorAll('.activity-card').forEach(card => {
        card.addEventListener('click', () => {
            const fullJourney = card.getAttribute('data-full-journey');
            const activity = fullJourney ? JSON.parse(fullJourney) : 
                            trip.Objects.find(obj => 
                                obj.is_purchased === "true" && 
                                obj.display_name === card.querySelector('h4').textContent);
            const content = popup.createActivityContent(activity);
            popup.show(content);
        });
    });
}
