import { formatDate, formatDateTime } from '../../utils/data.js';

export function createBasicInfoContent(activity) {
    let content = '';

    // Booking Information
    if (activity.booking_site_name || activity.booking_site_url || activity.booking_site_phone) {
        content += `
            <div class="popup-section">
                <h3>📋 Booking Information</h3>
                ${activity.booking_site_name ? `<p><strong>Booked via:</strong> ${activity.booking_site_name}</p>` : ''}
                ${activity.booking_site_url ? `<p><strong>Booking URL:</strong> <a href="${activity.booking_site_url}" target="_blank">${activity.booking_site_url}</a></p>` : ''}
                ${activity.booking_site_phone ? `<p><strong>Booking Phone:</strong> ${activity.booking_site_phone}</p>` : ''}
            </div>`;
    }

    // Supplier Details
    if (activity.supplier_name || activity.supplier_phone || activity.supplier_url) {
        content += `
            <div class="popup-section">
                <h3>🏢 Supplier Details</h3>
                ${activity.supplier_name ? `<p><strong>Name:</strong> ${activity.supplier_name}</p>` : ''}
                ${activity.supplier_phone ? `<p><strong>Phone:</strong> ${activity.supplier_phone}</p>` : ''}
                ${activity.supplier_url ? `<p><strong>Website:</strong> <a href="${activity.supplier_url}" target="_blank">${activity.supplier_url}</a></p>` : ''}
            </div>`;
    }

    // Schedule
    if (activity.StartDateTime || activity.EndDateTime) {
        content += `
            <div class="popup-section">
                <h3>⏰ Schedule</h3>
                ${activity.StartDateTime ? `<p><strong>Check-in:</strong> ${formatDateTime(activity.StartDateTime)}</p>` : ''}
                ${activity.EndDateTime ? `<p><strong>Check-out:</strong> ${formatDateTime(activity.EndDateTime)}</p>` : ''}
            </div>`;
    }

    // Location
    if (activity.Address) {
        content += `
            <div class="popup-section">
                <h3>📍 Location</h3>
                <p>${activity.Address.address}</p>
                ${activity.Address.city ? `<p>${activity.Address.city}${activity.Address.state ? `, ${activity.Address.state}` : ''}</p>` : ''}
                ${activity.Address.country ? `<p>${activity.Address.country}</p>` : ''}
            </div>`;
    }

    // Additional Information
    if (activity.notes || activity.restrictions) {
        content += `
            <div class="popup-section">
                <h3>ℹ️ Additional Information</h3>
                ${activity.notes ? `<p><strong>Notes:</strong> ${activity.notes}</p>` : ''}
                ${activity.restrictions ? `<p><strong>Restrictions:</strong> ${activity.restrictions}</p>` : ''}
            </div>`;
    }

    return content;
}
