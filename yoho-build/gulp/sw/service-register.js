(function () {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
        navigator.serviceWorker.register('service-worker.js?v={{version}}').then(function (registration) {
            registration.onupdatefound = function () {
                if (navigator.serviceWorker.controller) {
                    var installingWorker = registration.installing;
                    installingWorker.onstatechange = function () {
                        if (installingWorker.state === 'installed') {
                            window.location.reload();
                        }
                    };
                }
            };
        });
    }
})();
