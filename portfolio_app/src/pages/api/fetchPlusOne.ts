// pages/api/fetchPlusOne.ts

import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ✅ Load and parse service account from a secure private env var
const raw = process.env.NEXT_PUBLIC_FIRESTORE_SA_KEY;
if (!raw) throw new Error('NEXT_PUBLIC_FIRESTORE_SA_KEY is not set');
const serviceAccount = JSON.parse(raw) as ServiceAccount;

// Firestore database info
const database = 'firestore-datasbase'; // typo? maybe 'firestore-database'?
const collection = 'counter-collection';
const document = 'counter-document';

// ✅ Initialize Firebase Admin SDK once
let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
  console.log('✅ Firebase Admin initialized');
} else {
  app = getApps()[0];
}

const db = getFirestore(app, database);

// ✅ API handler
export default async function handler(req: any, res: any) {
  const docRef = db.collection(collection).doc(document);

  if (req.method === 'GET') {
    try {
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        console.error('GET: Document not found');
        return res.status(404).json({ error: 'Document not found' });
      }
      const counter = Number(docSnap.data()?.counter);
      console.log(`GET: Counter = ${counter}`);
      return res.status(200).json({ counter });
    } catch (error: any) {
      console.error('GET: Error fetching counter:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        console.error('POST: Document not found');
        return res.status(404).json({ error: 'Document not found' });
      }
      const currentCounter = Number(docSnap.data()?.counter);
      const newCounter = currentCounter + 1;
      await docRef.update({ counter: newCounter });
      console.log(`POST: Updated counter to ${newCounter}`);
      return res.status(200).json({ counter: newCounter });
    } catch (error: any) {
      console.error('POST: Error updating counter:', error.message);
      return res.status(500).json({ error: 'Failed to update counter' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}



// import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';

// const serviceAccount = JSON.parse(process.env.NEXT_PUBLIC_FIRESTORE_SA_KEY!);

// let database='firestore-datasbase';
// let collection='counter-collection';
// let document='counter-document';

// // Initialize Firebase Admin SDK with error handling
// let app;
// try {
//   if (!getApps().length) {
//     app = initializeApp({
//       credential: cert(serviceAccount),
//     });
//     console.log('Firebase Admin SDK initialized successfully');
//   } else {
//     app = getApps()[0];
//     console.log('Using existing Firebase Admin SDK app');
//   }
// } catch (error) {
//   console.error('Error initializing Firebase Admin SDK:', error);
//   throw error;
// }


// let db;
// try {
//   db = getFirestore(app, database);
//   console.log('Firestore initialized for database: dabase2');
// } catch (error) {
//   console.error('Error initializing Firestore:', error);
//   throw error;
// }

// export default async function handler(req: any, res: any) {
//   const docRef = db.collection(collection).doc(document);

//   if (req.method === 'GET') {
//     try {
//       const docSnap = await docRef.get();
//       if (!docSnap.exists) {
//         console.error('GET: Document not found');
//         return res.status(404).json({ error: 'Document not found' });
//       }
//       const data = docSnap.data();
//       const counter = Number(data?.counter);
//       console.log(`GET: Fetched counter: ${counter}`);
//       return res.status(200).json({ counter });
//     } catch (error: any) {
//       console.error('GET: Error fetching data:', error.message, error.stack);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   if (req.method === 'POST') {
//     try {
//       const docSnap = await docRef.get();
//       if (!docSnap.exists) {
//         console.error('POST: Document not found');
//         return res.status(404).json({ error: 'Document not found' });
//       }
//       const data = docSnap.data();
//       const currentCounter = Number(data?.counter);
//       const newCounter = currentCounter + 1;

//       console.log(`POST: Current counter: ${currentCounter}, New counter: ${newCounter}`);
//       await docRef.update({ counter: newCounter });
//       console.log('POST: Counter updated successfully');
//       return res.status(200).json({ counter: newCounter });
//     } catch (error: any) {
//       console.error('POST: Error updating counter:', error.message, error.stack);
//       return res.status(500).json({ error: `Failed to update counter: ${error.message}` });
//     }
//   }

//   console.error(`Method ${req.method} not allowed`);
//   return res.status(405).json({ error: 'Method not allowed' });
// }
