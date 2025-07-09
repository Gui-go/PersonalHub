// pages/api/test-firestore.js (for Pages Router)
// or app/api/test-firestore/route.js (for App Router)

import admin from 'firebase-admin';

// Initialize Firebase Admin (server-side)
const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    // Parse the service account from environment variable
    const serviceAccount = JSON.parse(process.env.FIRESTORE_SERVICE_ACCOUNT_JSON_KEY);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
      databaseURL: `https://firestore1.firebaseio.com/` 
    });
  }
  
  // Try specifying the database name from your Terraform configuration
  // If this doesn't work, try just admin.firestore() for the default database
  return admin.firestore(admin.app());
};

// For Pages Router (pages/api/test-firestore.js)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Firebase Admin
    const db = initializeFirebaseAdmin();

    // Reference to the document
    const docRef = db.collection('c1').doc('d1');
    
    // Get the document
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const counterValue = data.f1;

      return res.status(200).json({
        success: true,
        f1: counterValue,
        message: 'Successfully fetched counter value from Firestore'
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'The counter document does not exist'
      });
    }
  } catch (error) {
    console.error('Firestore connection error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to connect to Firestore'
    });
  }
}

// For App Router (app/api/test-firestore/route.js)
/*
export async function GET() {
  try {
    // Initialize Firebase Admin
    const db = initializeFirebaseAdmin();

    // Reference to the document
    const docRef = db.collection('stupid-button-counter').doc('counter1');
    
    // Get the document
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const counterValue = data.counter;

      return Response.json({
        success: true,
        counter: counterValue,
        message: 'Successfully fetched counter value from Firestore'
      });
    } else {
      return Response.json({
        success: false,
        error: 'Document not found',
        message: 'The counter document does not exist'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Firestore connection error:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to connect to Firestore'
    }, { status: 500 });
  }
}
*/