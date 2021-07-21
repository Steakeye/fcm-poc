import firebase from "firebase/app";
import '@firebase/messaging';
import firebaseConfig from './firebase.config.json';

console.log('logging serviceWorker.js');
console.log('firebaseConfig', firebaseConfig);

const { vapidKey, ...firebaseInitOptions } = firebaseConfig;

firebase.initializeApp(firebaseInitOptions);

const messaging = firebase.messaging();

/*const pushToken = await messaging.getToken({ vapidKey });

console.log(`pushToken`, pushToken)

localStorage.setItem(`pushToken`, pushToken);*/
