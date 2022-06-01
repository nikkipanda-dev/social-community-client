// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase

export function getFirebaseValues(values) {
    const firebaseConfig = {
        apiKey: values.apiKey,
        authDomain: values.authDomain,
        databaseURL: values.databaseURL,
        projectId: values.projectId,
        storageBucket: values.storageBucket,
        messagingSenderId: values.messagingSenderId,
        appId: values.appId,
    };

    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app);
    const db = getFirestore(app);

    return [
        {
            auth: auth,
            db: db,
        }
    ];
}