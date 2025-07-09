// pages/api/test-firestore.ts
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

let db;

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SA_KEY!);
  initializeApp({ credential: cert(serviceAccount) });
}
db = getFirestore();

export default async function handler(req, res) {
  try {
    const docRef = db.collection('stupid-button-counter').doc('counter1');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      // Create the doc with initial value
      await docRef.set({ counter: 0 });
      return res.status(200).json({ counter: 0, created: true });
    }

    const counter = docSnap.data()?.counter ?? 0;
    res.status(200).json({ counter });
  } catch (err: any) {
    console.error('[Test Firestore Error]', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
