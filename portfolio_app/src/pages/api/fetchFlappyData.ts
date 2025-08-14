import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount: ServiceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY!
);

let database = 'flappybird-db';
let collectionName = 'highScores';

// Initialize Firebase Admin SDK with error handling
let app;
try {
  if (!getApps().length) {
    app = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    app = getApps()[0];
    console.log('Using existing Firebase Admin SDK app');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  throw error;
}

// Initialize Firestore
let db;
try {
  db = getFirestore(app, database);
  console.log(`Firestore initialized for database: ${database}`);
} catch (error) {
  console.error('Error initializing Firestore:', error);
  throw error;
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const scoresQuery = db
        .collection(collectionName)
        .orderBy('score', 'desc')
        .orderBy('distance', 'desc')
        .limit(5);
      const querySnapshot = await scoresQuery.get();
      const scores = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        score: doc.data().score,
        distance: doc.data().distance,
        date: doc.data().date,
      }));
      console.log('GET: Fetched high scores:', scores);
      return res.status(200).json({ scores });
    } catch (error: any) {
      console.error('GET: Error fetching scores:', error.message, error.stack);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, score, distance, date } = req.body;
      if (!name || score == null || distance == null || !date) {
        console.error('POST: Invalid request body');
        return res.status(400).json({ error: 'Invalid request body' });
      }

      const docRef = db.collection(collectionName).doc(name);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const existingData = docSnap.data();
        if (
          score > existingData.score ||
          (score === existingData.score && distance > existingData.distance)
        ) {
          await docRef.set({ name, score, distance, date });
          console.log(`POST: Updated score for ${name}: score=${score}, distance=${distance}`);
        } else {
          console.log(`POST: No update needed for ${name}: existing score=${existingData.score}, distance=${existingData.distance}`);
          return res.status(200).json({ message: 'Score not updated (lower or equal)' });
        }
      } else {
        await docRef.set({ name, score, distance, date });
        console.log(`POST: Saved new score for ${name}: score=${score}, distance=${distance}`);
      }

      // Fetch updated scores to return
      const scoresQuery = db
        .collection(collectionName)
        .orderBy('score', 'desc')
        .orderBy('distance', 'desc')
        .limit(5);
      const querySnapshot = await scoresQuery.get();
      const scores = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        score: doc.data().score,
        distance: doc.data().distance,
        date: doc.data().date,
      }));
      return res.status(200).json({ scores });
    } catch (error: any) {
      console.error('POST: Error saving score:', error.message, error.stack);
      return res.status(500).json({ error: `Failed to save score: ${error.message}` });
    }
  }

  console.error(`Method ${req.method} not allowed`);
  return res.status(405).json({ error: 'Method not allowed' });
}