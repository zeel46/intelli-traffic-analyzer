(function() {
    const scriptTag = document.currentScript || document.querySelector('script[src*="tracker.js"]');
    const apiKey = scriptTag ? scriptTag.getAttribute('data-key') : null;

    if (!apiKey) {
        console.error('Smart Traffic Tracker: API Key is missing. Ensure the data-key attribute is set.');
        return;
    }

    const trackTraffic = async () => {
        const data = {
            apiKey: apiKey,
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        try {
            // Replace with your actual tracking endpoint usually dynamic when hosted
            const response = await fetch('http://localhost:5000/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                console.warn('Smart Traffic Tracker: Failed to log traffic.');
            }
        } catch (error) {
            console.error('Smart Traffic Tracker: Error logging traffic.', error);
        }
    };

    // Track on load
    if (document.readyState === 'complete') {
        trackTraffic();
    } else {
        window.addEventListener('load', trackTraffic);
    }
})();
