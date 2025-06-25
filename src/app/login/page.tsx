// app/login/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import styles from './loginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for success message from registration redirect
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Registration successful! Please log in.');
      // Clear the query param without reloading
      router.replace('/login');
    }
  }, [searchParams, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/'), 1500);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      
      if (err instanceof Error) {
        if (err.message.includes('user-not-found') || err.message.includes('wrong-password')) {
          setError('Invalid email or password');
        } else if (err.message.includes('too-many-requests')) {
          setError('Account temporarily locked due to many failed attempts');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError('Failed to sign in with Google');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to access your account</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleEmailLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`${styles.button} ${styles.primaryButton}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingText}>Signing In...</span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <div className={styles.dividerText}>Or continue with</div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            className={`${styles.button} ${styles.secondaryButton}`}
            disabled={isLoading}
          >
            <Image 
              src="/google-icon.png"
              alt="Google logo"
              width={20}
              height={20}
              className={styles.googleIcon}
            />
            Sign in with Google
          </button>
        </div>

        <div className={styles.links}>
          <p>Don't have an account?{' '}
            <Link href="/register" className={styles.link}>
              Register here
            </Link>
          </p>
          <p>
            <Link href="/forgot-password" className={styles.link}>
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}