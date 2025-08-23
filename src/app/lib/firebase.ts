// Import the necessary modules from firebase-admin
import admin from "firebase-admin";
import { serviceAccount } from "../../config/serviceAccount";


// Initialize the Firebase Admin SDK with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});


export const fcm = admin.messaging();;
