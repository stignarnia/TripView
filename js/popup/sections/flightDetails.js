import { formatDateTime } from '../../utils/data.js';

// Make sure formatDateTime exists in the imports
if (!formatDateTime) {
    console.error('formatDateTime function not found in data.js');
}

export function createFlightDetailsContent(activity) {
    if (!activity.Segment || !Array.isArray(activity.Segment) || activity.Segment.length === 0) {
        return '';
    }

    return `
        <div class="popup-section flights">
            <h3>✈️ Flight Details</h3>
            ${activity.Segment.map((segment, index) => `
                <div class="flight-segment">
                    <h4>Flight ${index + 1}</h4>
                    <div class="flight-route">
                        <div class="airport">
                            <span class="code">${segment.start_airport_code}</span>
                            <span class="city">${segment.start_city_name}</span>
                            <span class="time">${formatDateTime(segment.StartDateTime)}</span>
                        </div>
                        <div class="flight-arrow">→</div>
                        <div class="airport">
                            <span class="code">${segment.end_airport_code}</span>
                            <span class="city">${segment.end_city_name}</span>
                            <span class="time">${formatDateTime(segment.EndDateTime)}</span>
                        </div>
                    </div>
                    <div class="flight-details">
                        ${segment.marketing_airline ? `
                            <div class="detail-item">
                                <span class="icon">🛩️</span>
                                <span>${segment.marketing_airline} ${segment.marketing_flight_number}</span>
                            </div>` : ''}
                        ${segment.aircraft_display_name ? `
                            <div class="detail-item">
                                <span class="icon">🛫</span>
                                <span>${segment.aircraft_display_name}</span>
                            </div>` : ''}
                        ${segment.service_class ? `
                            <div class="detail-item">
                                <span class="icon">💺</span>
                                <span>${segment.service_class}</span>
                            </div>` : ''}
                        ${segment.duration ? `
                            <div class="detail-item">
                                <span class="icon">⏱️</span>
                                <span>${segment.duration}</span>
                            </div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>`;
}
