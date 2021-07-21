import firebase from "firebase/app";
import '@firebase/messaging';
import firebaseConfig from './firebase.config.json';

console.log('logging serviceWorker.js');
console.log('firebaseConfig', firebaseConfig);

const { vapidKey, ...firebaseInitOptions } = firebaseConfig;

firebase.initializeApp(firebaseInitOptions);

const messaging = firebase.messaging();

async function getClient() {
    const allClients = await clients.matchAll();

    return allClients[0]
}

function postMessageToClient(client, message) {
    client.postMessage(message);
}

async function attemptToGetToken() {
    console.log(`attemptToGetToken`);
    let token;

    try {
        // `getToken` cannot set a service worker via `serviceWorkerRegistration` from within a service worker!
        // token = await messaging.getToken({ vapidKey, serviceWorkerRegistration: registration });
        token = await messaging.getToken({ vapidKey });
    } catch (error) {
        console.error(`Getting messaging token failed`, error);
    } finally {
        console.log(`Messaging token`, token);

        const client = await getClient();

        postMessageToClient(client, {
            type: 'pushToken',
            value: token,
        })
    }
}

async function attemptToDeleteToken() {
    console.log(`attemptToDeleteToken`);
    let tokenDeleted;

    try {
        tokenDeleted = await messaging.deleteToken();
    } catch (error) {
        console.error(`Deleting messaging token failed`, error);
    } finally {
        console.log(`Deleted token`, tokenDeleted);

        if (tokenDeleted) {
            const client = await getClient();

            postMessageToClient(client, {
                type: 'pushToken',
                value: null,
            })
        }
    }
}

attemptToGetToken();

addEventListener(`message`, async ({ data }) => {
    console.log(`sw addEventListener(\`message\``, data);
    if (data) {
        const { type, value } = data;
        if (type === `notification:permission`) {
            if (value) {
                console.log(`await handleMessageTokenRegistration(messaging)`);
                await attemptToGetToken();
                // backgroundMessageUnsubscriber = setupBackgroundMessageListener(messaging);
            } else {
                console.log(`handleMessageTokenDeRegistration(messaging)`);
                await attemptToDeleteToken();
            }
        }
    }
});