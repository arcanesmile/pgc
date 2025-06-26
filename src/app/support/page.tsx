// app/support/page.tsx
'use client';
import StripePaymentForm from '@/components/Stripe/StripePaymentForm';
import StripeProviderWrapper from '@/components/Stripe/StripeProviderWrapper';
import styles from './support.module.css';

export default function SupportPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Support Us Today</h1>

      <hr />
      <div className={styles.card}>
        <h2 className={styles.subtitle}>Make a Donation</h2>
        <p className={styles.description}>Your support helps us continue our important work.</p>
        
        <StripeProviderWrapper>
          <StripePaymentForm />
        </StripeProviderWrapper>
      </div>
    </div>
  );
}