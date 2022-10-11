import { initializeApp, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDCDO0QEFalmjquiv4hKgDGmokxqf-GycE",
    authDomain: "mychatapp-4f6d8.firebaseapp.com",
    databaseURL: "https://mychatapp-4f6d8-default-rtdb.firebaseio.com",
    projectId: "mychatapp-4f6d8",
    storageBucket: "mychatapp-4f6d8.appspot.com",
    messagingSenderId: "763731372051",
    appId: "1:763731372051:web:416c997db7a817a4a937e6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export { db, auth };