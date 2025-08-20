// Import the necessary modules from firebase-admin
import admin from "firebase-admin";
import path from "path";

const serviceAccount = path.resolve(
  __dirname,
  "../../wasiapp-984c1-firebase-adminsdk-fbsvc-f27e070dca.json"
);

// Initialize the Firebase Admin SDK with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});


export const fcm = admin.messaging();;
