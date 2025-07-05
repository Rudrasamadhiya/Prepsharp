// Minimal Consent Banner for Google Analytics
(function() {
    // Check if consent already given
    if (localStorage.getItem('cookieConsent')) return;

    // Create banner
    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.innerHTML = `
        <div style="position:fixed;bottom:0;left:0;right:0;background:#333;color:#fff;padding:15px;text-align:center;z-index:10000;font-family:Arial,sans-serif;font-size:14px;">
            <span>We use cookies to improve your experience and analyze site usage. </span>
            <button onclick="acceptCookies()" style="background:#4f46e5;color:#fff;border:none;padding:8px 16px;margin:0 5px;border-radius:4px;cursor:pointer;">Accept</button>
            <button onclick="declineCookies()" style="background:transparent;color:#fff;border:1px solid #fff;padding:8px 16px;margin:0 5px;border-radius:4px;cursor:pointer;">Decline</button>
        </div>
    `;
    document.body.appendChild(banner);

    // Accept function
    window.acceptCookies = function() {
        localStorage.setItem('cookieConsent', 'accepted');
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
        document.getElementById('consent-banner').remove();
    };

    // Decline function
    window.declineCookies = function() {
        localStorage.setItem('cookieConsent', 'declined');
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });
        document.getElementById('consent-banner').remove();
    };

    // Set default consent to denied
    gtag('consent', 'default', {
        'analytics_storage': 'denied'
    });
})();