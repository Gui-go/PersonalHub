import type { NextApiRequest, NextApiResponse } from 'next';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

let db: ReturnType<typeof getFirestore>;

try {
  if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SA_KEY!);
    initializeApp({ credential: cert(serviceAccount) });
  }
  db = getFirestore();
} catch (error) {
  console.error('[Firebase Init Error]', error);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const docRef = db.collection('stupid-button-counter').doc('counter1');
    const docSnap = await docRef.get();

    // If the document does not exist, create it with count: 1
    if (!docSnap.exists) {
      await docRef.set({ count: 1 });
    } else {
      await docRef.update({ count: FieldValue.increment(1) });
    }

    const updatedDoc = await docRef.get();
    const count = updatedDoc.data()?.count ?? 0;

    res.status(200).json({ success: true, count });
  } catch (error: any) {
    console.error('[Firestore Error]', error);
    res.status(500).json({ error: error.message || 'Failed to increment counter' });
  }
}
