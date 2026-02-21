// components/StripePaymentForm.tsx
'use client';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import styles from './StripePaymentForm.module.css';

export default function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState<string>('10'); // Store as string initially
  const [email, setEmail] = useState<string>('');

  // Parse amount safely
  const parseAmount = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || parsed < 1 ? 10 : parsed; // Default to $10 if invalid
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const parsedAmount = parseAmount(amount);
      
      // Convert dollars to cents
      const amountInCents = Math.round(parsedAmount * 100);

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amountInCents,
          email: email 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

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
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get parsed amount for display
  const parsedAmount = parseAmount(amount);

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
          disabled={loading}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="amount" className={styles.label}>
          Donation Amount ($)
        </label>
        <div className={styles.currencyInput}>
          <span className={styles.currencySymbol}>$</span>
          <input
            id="amount"
            type="text" // Changed to text for better control
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            onBlur={() => {

              const parsed = parseAmount(amount);
              setAmount(parsed.toFixed(2));
            }}
            className={styles.input}
            placeholder="10.00"
            required
            disabled={loading}
          />
        </div>
        <small className={styles.helpText}>
          Minimum donation: $1.00
        </small>
      </div>

      <div className={styles.cardElementContainer}>
        <label className={styles.label}>Card Details</label>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
                padding: '10px',
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true,
          }} 
        />
      </div>

      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}
      
      {success && (
        <div className={styles.success}>
          <div className={styles.successHeader}>
            <span className={styles.successIcon}>🎉</span>
            <strong>Thank You!</strong>
          </div>
          <p>Your donation of ${parsedAmount.toFixed(2)} has been received.</p>
          <p className={styles.successNote}>
            A receipt has been sent to your email.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || !email}
        className={styles.submitButton}
      >
        {loading ? (
          <>
            <span className={styles.loadingSpinner} />
            Processing...
          </>
        ) : (
          `Donate $${parsedAmount.toFixed(2)}`
        )}
      </button>
    </form>
  );
}