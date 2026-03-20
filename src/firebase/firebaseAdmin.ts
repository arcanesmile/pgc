import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let initialized = false;

const initFirebaseAdmin = () => {
  if (initialized || getApps().length) {
    initialized = true;
    return;
  }

  const rawCredentials = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!rawCredentials) {
    return;
  }

  const serviceAccount = JSON.parse(rawCredentials);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  initializeApp({
    credential: cert(serviceAccount),
  });
  initialized = true;
};

const getAdminAuth = (): Auth | null => {
  initFirebaseAdmin();
  return getApps().length ? getAuth() : null;
};

export const verifyToken = async (token: string) => {
  const authInstance = getAdminAuth();
  if (!authInstance) {
    console.warn('Firebase Admin is not configured; token verification skipped.');
    return null;
  }

  try {
    return await authInstance.verifyIdToken(token);
  } catch {
    return null;
  }
};
