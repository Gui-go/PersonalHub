import type { NextApiRequest, NextApiResponse } from 'next';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SA_KEY!);
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const docRef = db.collection('counters').doc('stupid_button');
    await docRef.update({ count: FieldValue.increment(1) });
    const snapshot = await docRef.get();
    const count = snapshot.data()?.count || 0;

    res.status(200).json({ success: true, count });
  } catch (err) {
    console.error('Firestore error:', err);
    res.status(500).json({ error: 'Failed to increment counter' });
  }
}
