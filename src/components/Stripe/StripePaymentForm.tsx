// components/StripePaymentForm.tsx
'use client';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import styles from './StripePaymentForm.module.css';

export default function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState<number>(10); // Default $10
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Convert dollars to cents
      const amountInCents = Math.round(amount * 100);

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amountInCents,
          email: email 
        }),
      });

      const { clientSecret } = await response.json();

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: email,
          },
        },
        receipt_email: email,
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Payment processing failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          placeholder="your@email.com"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="amount" className={styles.label}>
          Donation Amount ($)
        </label>
        <input
          id="amount"
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className={styles.input}
          placeholder="10.00"
          required
        />
      </div>

      <div className={styles.cardElementContainer}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && (
        <div className={styles.success}>
          Thank you for your ${amount} donation!
        </div>
      )}

      <button
  type="submit"
  disabled={!stripe || loading}
  className={styles.submitButton}
>
  {loading ? (
    <>
      <span className={styles.loadingSpinner} />
      Processing...
    </>
  ) : (
    `Donate $${amount.toFixed(2)}`
  )}
</button>
    </form>
  );
}