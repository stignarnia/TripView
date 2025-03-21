import { fetchTripData } from './data.js';
import { initializeTripList } from './trips.js';
import { updateMap, invalidateMapSize } from './map.js';
import { showTripDetails } from './details.js';

// Theme functionality with cookie persistence
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    document.cookie = `theme=${theme};path=/;max-age=31536000`; // 1 year expiry
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    invalidateMapSize();
}

// Initialize theme from cookie
document.addEventListener('DOMContentLoaded', async () => {
    const cookieTheme = document.cookie
        .split('; ')
        .find(row => row.startsWith('theme='))
        ?.split('=')[1];
    if (cookieTheme) {
        setTheme(cookieTheme);
    }

    // Initialize data and UI
    const data = await fetchTripData();
    initializeTripList((trip) => {
        showTripDetails(trip);
        updateMap(trip);
    });
    if (data.Trips.length > 0) {
        showTripDetails(data.Trips[0]);
        updateMap(data.Trips[0]);
    }
});

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});
