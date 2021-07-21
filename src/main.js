import firebase from "firebase/app";
import '@firebase/messaging';
import firebaseConfig from './firebase.config.json';
import { AppModel } from '@gitliveapp/core';

console.log('logging main.js');

const appModel = AppModel({
    version: `1.0.0`,
    store(key, value) {
        console.log(`store`, key, value);
        localStorage.setItem(key, value);
    },
    retrieve(key, type) {
        console.log(`retrieve`, key, type);
        return localStorage.getItem(key) ?? undefined;
    },
    retrieveOrDefault(key, defaultValue) {
        const resourceValue  = localStorage.getItem(key);

        return resourceValue ?? defaultValue;
    },
    clear(key) {
        localStorage.clear(key);
    },
    reportException(exception) {
        console.error(`AppModel Error`, exception);
    },
});

appModel.urlOpened(location.href);

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


const { vapidKey, ...firebaseInitOptions } = firebaseConfig;

firebase.initializeApp(firebaseInitOptions);

const messaging = firebase.messaging();

messaging.onMessage((event) => {
    console.log(`messaging.onMessage`, event);
    new Notification(`foreground notification!`);
});
