export class Popup {
    constructor() {
        this.createPopupElements();
        this.setupEventListeners();
    }

    createPopupElements() {
        // Create main popup container
        this.popup = document.createElement('div');
        this.popup.className = 'popup';
        this.popup.style.display = 'none';

        // Create popup content
        this.popupContent = document.createElement('div');
        this.popupContent.className = 'popup-content';

        // Create close button
        this.closeBtn = document.createElement('button');
        this.closeBtn.className = 'popup-close';
        this.closeBtn.innerHTML = '×';

        // Assemble popup
        this.popupContent.appendChild(this.closeBtn);
        this.popup.appendChild(this.popupContent);
        document.body.appendChild(this.popup);
    }

    setupEventListeners() {
        // Close on button click
        this.closeBtn.addEventListener('click', () => this.hide());

        // Close on click outside
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.hide();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.style.display === 'block') {
                this.hide();
            }
        });
    }

    show(content) {
        this.popupContent.innerHTML = this.closeBtn.outerHTML + content;
        this.popup.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Reattach event listener to the new close button
        const newCloseBtn = this.popupContent.querySelector('.popup-close');
        newCloseBtn.addEventListener('click', () => this.hide());
    }

    hide() {
        this.popup.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }

    createActivityContent(activity) {
        let content = `
            <h2>${activity.display_name}</h2>
            <div class="popup-section">
                <h3>Booking Information</h3>
                ${activity.booking_site_name ? `<p><strong>Booked via:</strong> ${activity.booking_site_name}</p>` : ''}
                ${activity.booking_site_url ? `<p><strong>Booking URL:</strong> <a href="${activity.booking_site_url}" target="_blank">${activity.booking_site_url}</a></p>` : ''}
                ${activity.booking_site_phone ? `<p><strong>Booking Phone:</strong> ${activity.booking_site_phone}</p>` : ''}
            </div>`;

        if (activity.supplier_name || activity.supplier_phone || activity.supplier_url) {
            content += `
                <div class="popup-section">
                    <h3>Supplier Details</h3>
                    ${activity.supplier_name ? `<p><strong>Name:</strong> ${activity.supplier_name}</p>` : ''}
                    ${activity.supplier_phone ? `<p><strong>Phone:</strong> ${activity.supplier_phone}</p>` : ''}
                    ${activity.supplier_url ? `<p><strong>Website:</strong> <a href="${activity.supplier_url}" target="_blank">${activity.supplier_url}</a></p>` : ''}
                </div>`;
        }

        if (activity.StartDateTime || activity.EndDateTime) {
            content += `
                <div class="popup-section">
                    <h3>Schedule</h3>
                    ${activity.StartDateTime ? `<p><strong>Check-in:</strong> ${formatDateTime(activity.StartDateTime)}</p>` : ''}
                    ${activity.EndDateTime ? `<p><strong>Check-out:</strong> ${formatDateTime(activity.EndDateTime)}</p>` : ''}
                </div>`;
        }

        if (activity.Address) {
            content += `
                <div class="popup-section">
                    <h3>Location</h3>
                    <p>${activity.Address.address}</p>
                    ${activity.Address.city ? `<p>${activity.Address.city}${activity.Address.state ? `, ${activity.Address.state}` : ''}</p>` : ''}
                    ${activity.Address.country ? `<p>${activity.Address.country}</p>` : ''}
                </div>`;
        }

        if (activity.notes || activity.restrictions) {
            content += `
                <div class="popup-section">
                    <h3>Additional Information</h3>
                    ${activity.notes ? `<p><strong>Notes:</strong> ${activity.notes}</p>` : ''}
                    ${activity.restrictions ? `<p><strong>Restrictions:</strong> ${activity.restrictions}</p>` : ''}
                </div>`;
        }

        // Handle flight segments
        if (activity.Segment && Array.isArray(activity.Segment) && activity.Segment.length > 0) {
            content += `
                <div class="popup-section">
                    <h3>Flight Details</h3>
                    ${activity.Segment.map((segment, index) => `
                        <div class="flight-segment">
                            <h4>Flight ${index + 1}</h4>
                            <p><strong>From:</strong> ${segment.start_airport_code} - ${segment.start_city_name}</p>
                            <p><strong>To:</strong> ${segment.end_airport_code} - ${segment.end_city_name}</p>
                            <p><strong>Departure:</strong> ${formatDateTime(segment.StartDateTime)}</p>
                            <p><strong>Arrival:</strong> ${formatDateTime(segment.EndDateTime)}</p>
                            ${segment.marketing_airline ? `<p><strong>Airline:</strong> ${segment.marketing_airline} ${segment.marketing_flight_number}</p>` : ''}
                            ${segment.aircraft_display_name ? `<p><strong>Aircraft:</strong> ${segment.aircraft_display_name}</p>` : ''}
                            ${segment.service_class ? `<p><strong>Class:</strong> ${segment.service_class}</p>` : ''}
                            ${segment.duration ? `<p><strong>Duration:</strong> ${segment.duration}</p>` : ''}
                        </div>
                    `).join('')}
                </div>`;
        }

        // Handle travelers
        if (activity.Traveler) {
            const travelers = Array.isArray(activity.Traveler) ? activity.Traveler : [activity.Traveler];
            content += `
                <div class="popup-section">
                    <h3>Travelers</h3>
                    ${travelers.map(traveler => `
                        <p>${[traveler.first_name, traveler.middle_name, traveler.last_name].filter(Boolean).join(' ')}</p>
                    `).join('')}
                </div>`;
        }

        return content;
    }
}

function formatDateTime(dt) {
    if (!dt || !dt.date || !dt.time) return '';
    const datetime = new Date(`${dt.date}T${dt.time}`);
    return datetime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: dt.timezone || 'UTC',
    }) + (dt.timezone ? ` (${dt.timezone})` : '');
}
