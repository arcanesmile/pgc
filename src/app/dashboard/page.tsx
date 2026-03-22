'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig'; // Use the client-side auth

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!auth) return <div>Auth is not configured.</div>;
  if (!user) return <div>Join our movement</div>;

  return <div>Welcome {user.email} to PGC</div>;
}
