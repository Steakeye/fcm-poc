console.log('logging main.js');

if (`serviceWorker` in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener(`load`, async () => {
        const {serviceWorker: serviceWorkerContainer} = navigator;
        let existingServiceWorker;

        await Notification.requestPermission();

        try {
            const serviceWorkerRegistration = await serviceWorkerContainer.register(`/assets/js/sw.js`, {
                scope: `/`,
            });
            const { active } = serviceWorkerRegistration;

            if (active) {
                existingServiceWorker = active;
            }
        } catch (error) {
            console.log(`Service worker registration failed, error:`, error);
        }

        if (existingServiceWorker) {
            existingServiceWorker.postMessage({
                type: `notification:permission`,
                value: Notification.permission === `granted`,
            });
        }
    });

    navigator.serviceWorker.addEventListener(`message`, ({ data }) => {
        const { type, value } = data;

        if (type === 'pushToken') {
            console.log(`pushToken message received`);
            localStorage.setItem('pushToken', value);
        }
    });
}
