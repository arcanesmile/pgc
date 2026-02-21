// app/support/page.tsx
'use client';
import { useState, useEffect } from 'react';
import StripePaymentForm from '@/components/Stripe/StripePaymentForm';
import PaystackPaymentForm from '@/components/Paystack/PaystackPaymentForm';
import StripeProviderWrapper from '@/components/Stripe/StripeProviderWrapper';
import { getRecommendedPaymentProvider, type PaymentProvider } from '@/utils/geolocation';
import styles from './support.module.css';

export default function SupportPage() {
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function detectProvider() {
      const provider = await getRecommendedPaymentProvider();
      setPaymentProvider(provider);
      setIsLoading(false);
    }
    detectProvider();
  }, []);

  const renderPaymentForm = () => {
    if (isLoading) {
      return <div className={styles.loading}>Detecting your location...</div>;
    }

    switch (paymentProvider) {
      case 'paystack':
        return <PaystackPaymentForm />;
      case 'stripe':
        return (
          <StripeProviderWrapper>
            <StripePaymentForm />
          </StripeProviderWrapper>
        );
      default:
        return (
          <StripeProviderWrapper>
            <StripePaymentForm />
          </StripeProviderWrapper>
        );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Support Us Today</h1>

      <hr />
      <div className={styles.card}>
        <h2 className={styles.subtitle}>Make a Donation</h2>
        <p className={styles.description}>Your support helps us continue our important work.</p>
        
        {/* Provider Selection */}
        <div className={styles.providerSelector}>
          <label className={styles.selectorLabel}>Payment Method:</label>
          <div className={styles.selectorButtons}>

<button
  type="button"
  onClick={() => setPaymentProvider('stripe')}
  data-provider="stripe"
  className={`${styles.providerButton} ${paymentProvider === 'stripe' ? styles.active : ''}`}
>
  {/* <span className={styles.providerIcon}>💳</span> */}
  Stripe
</button>
<button
  type="button"
  onClick={() => setPaymentProvider('paystack')}
  data-provider="paystack"
  className={`${styles.providerButton} ${paymentProvider === 'paystack' ? styles.active : ''}`}
>
  {/* <span className={styles.providerIcon}>🇳🇬</span> */}
  Paystack
</button>
          </div>
          {paymentProvider === 'paystack' && (
            <div className={styles.providerNote}>
              Recommended for users in Nigeria, Ghana, Kenya, and other African countries
            </div>
          )}
        </div>

        {/* Payment Form */}
        {renderPaymentForm()}
      </div>
    </div>
  );
}