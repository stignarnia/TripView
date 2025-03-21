// Fetch and initialize the trip data
export async function fetchTripData() {
    const response = await fetch('tripitdata.json', {
        // Force cache revalidation
        cache: 'no-store',
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    const data = await response.json();
    return data;
}

export async function getTripData() {
    // Always fetch fresh data
    return await fetchTripData();
}

// Format date to readable string
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Format datetime to readable string
export function formatDateTime(dt) {
    if (!dt || !dt.date || !dt.time) return '';
    const datetime = new Date(`${dt.date}T${dt.time}`);
    return datetime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
