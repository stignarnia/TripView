import { createBasicInfoContent } from './sections/basicInfo.js';
import { createFlightDetailsContent } from './sections/flightDetails.js';
import { createRailDetailsContent } from './sections/railDetails.js';
import { createTravelersContent } from './sections/travelers.js';

export function createActivityContent(activity) {
    const sections = [
        `<h2>${activity.display_name}</h2>`,
        createBasicInfoContent(activity),
    ];

    // Add transport details based on activity type
    if (activity.display_name.toLowerCase().includes('flight')) {
        sections.push(createFlightDetailsContent(activity));
    } else if (activity.display_name.toLowerCase().includes('rail')) {
        sections.push(createRailDetailsContent(activity));
    }

    // Add travelers section last
    sections.push(createTravelersContent(activity));

    return sections.filter(Boolean).join('');
}
