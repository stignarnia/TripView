import { formatDateTime } from '../../utils/data.js';

export function createRailDetailsContent(activity) {
    if (!activity.Segment || (Array.isArray(activity.Segment) && activity.Segment.length === 0)) {
        return '';
    }

    const segments = Array.isArray(activity.Segment) ? activity.Segment : [activity.Segment];
    if (Object.keys(segments[0]).length === 0) return '';

    // Check if it's a round trip (A->B and B->A)
    const isRoundTrip = segments.length === 2 &&
        segments[0].start_station_name === segments[1].end_station_name &&
        segments[0].end_station_name === segments[1].start_station_name;

    return `
        <div class="popup-section rail">
            <h3>🚂 Rail Journey</h3>
            ${segments.map((segment, index) => `
                <div class="rail-segment">
                    <h4>${isRoundTrip ? (index === 0 ? 'Outbound' : 'Return') : `Segment ${index + 1}`}</h4>
                    <div class="rail-route">
                        <div class="station">
                            <span class="name">${segment.start_station_name}</span>
                            <span class="time">${formatDateTime(segment.StartDateTime)}</span>
                        </div>
                        <div class="rail-arrow">→</div>
                        <div class="station">
                            <span class="name">${segment.end_station_name}</span>
                            <span class="time">${formatDateTime(segment.EndDateTime)}</span>
                        </div>
                    </div>
                    <div class="rail-details">
                        ${segment.carrier_name ? `
                            <div class="detail-item">
                                <span class="icon">🚆</span>
                                <span>${segment.carrier_name}</span>
                            </div>` : ''}
                        ${segment.train_type ? `
                            <div class="detail-item">
                                <span class="icon">ℹ️</span>
                                <span>${segment.train_type}</span>
                            </div>` : ''}
                        ${segment.train_number ? `
                            <div class="detail-item">
                                <span class="icon">🎫</span>
                                <span>Train ${segment.train_number}</span>
                            </div>` : ''}
                        ${(segment.coach_number || segment.seats) ? `
                            <div class="detail-item">
                                <span class="icon">💺</span>
                                <span>${[
                                    segment.coach_number ? `Coach ${segment.coach_number}` : '',
                                    segment.seats ? `Seat ${segment.seats}` : ''
                                ].filter(Boolean).join(', ')}</span>
                            </div>` : ''}
                        ${segment.service_class ? `
                            <div class="detail-item">
                                <span class="icon">⭐</span>
                                <span>Class: ${segment.service_class}</span>
                            </div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>`;
}
