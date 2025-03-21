import { createBasicInfoContent } from './sections/basicInfo.js';
import { createFlightDetailsContent } from './sections/flightDetails.js';
import { createTravelersContent } from './sections/travelers.js';

export function createActivityContent(activity) {
    const sections = [
        `<h2>${activity.display_name}</h2>`,
        createBasicInfoContent(activity),
        createFlightDetailsContent(activity),
        createTravelersContent(activity)
    ];

    return sections.filter(Boolean).join('');
}
