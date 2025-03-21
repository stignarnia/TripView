export function createTravelersContent(activity) {
    if (!activity.Traveler) {
        return '';
    }

    const travelers = Array.isArray(activity.Traveler) ? activity.Traveler : [activity.Traveler];
    
    return `
        <div class="popup-section travelers">
            <h3>👥 Travelers</h3>
            <div class="traveler-list">
                ${travelers.map(traveler => `
                    <div class="traveler-item">
                        <span class="icon">👤</span>
                        <span>${[traveler.first_name, traveler.middle_name, traveler.last_name]
                            .filter(Boolean)
                            .join(' ')}</span>
                        ${traveler.frequent_traveler_number ? `
                            <div class="frequent-traveler">
                                <span class="label">Frequent Traveler:</span>
                                <span class="number">${traveler.frequent_traveler_number}</span>
                            </div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>`;
}
