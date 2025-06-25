import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error('Missing Firebase Admin credentials');
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  initializeApp({
    credential: cert(serviceAccount)
  });
}

export const adminAuth = getAuth();

// Add this verifyToken function
export const verifyToken = async (token: string) => {
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    return null;
  }
};