// components/Paystack/PaystackPaymentForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { 
  FaCreditCard, 
  FaUniversity, 
  FaMobileAlt, 
  FaQrcode,
  FaExchangeAlt
} from 'react-icons/fa';
import styles from './PaystackPaymentForm.module.css';

// Declare Paystack type
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => { openIframe: () => void };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number; // Amount in kobo
  ref: string;
  currency?: string;
  channels?: string[];
  callback: (response: any) => void;
  onClose: () => void;
  metadata?: Record<string, any>;
}

export default function PaystackPaymentForm() {
  const [email, setEmail] = useState<string>('');
  const [amount, setAmount] = useState<string>('500'); // Amount in Naira
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  useEffect(() => {
    // Load Paystack script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () => setError('Failed to load payment service');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const generateReference = () => {
    return `donate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handlePaystackPayment = () => {
    if (!paystackLoaded) {
      setError('Payment service is still loading. Please wait...');
      return;
    }

    if (!email) {
      setError('Please enter your email');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 100) {
      setError('Minimum donation amount is ₦100');
      return;
    }

    // Convert Naira to kobo (1 NGN = 100 kobo)
    const amountInKobo = Math.round(numericAmount * 100);

    setLoading(true);
    setError(null);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: email,
      amount: amountInKobo,
      ref: generateReference(),
      currency: 'NGN',
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      metadata: {
        custom_fields: [
          {
            display_name: "Donation Type",
            variable_name: "donation_type",
            value: "General Support"
          }
        ]
      },
      callback: (response: any) => {
        setSuccess(true);
        setLoading(false);
        
        // Verify payment on your server
        fetch('/api/verify-paystack-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: response.reference }),
        })
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              setError('Payment verification failed. Please contact support.');
              setSuccess(false);
            }
          })
          .catch(() => {
            setError('Verification failed. Please contact support.');
            setSuccess(false);
          });
      },
      onClose: () => {
        setLoading(false);
        setError('Payment was cancelled. You can try again.');
      }
    });

    handler.openIframe();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePaystackPayment();
  };

  const formatAmount = (amountStr: string) => {
    const numericAmount = parseFloat(amountStr);
    if (isNaN(numericAmount)) return '₦0';
    return `₦${numericAmount.toLocaleString('en-NG')}`;
  };

  const paymentMethods = [
    { icon: FaCreditCard, label: 'Credit/Debit Card', color: '#3b82f6' },
    { icon: FaUniversity, label: 'Bank Transfer', color: '#10b981' },
    { icon: FaMobileAlt, label: 'USSD', color: '#8b5cf6' },
    { icon: FaQrcode, label: 'QR Code', color: '#f59e0b' },
    { icon: FaExchangeAlt, label: 'Bank Transfer', color: '#ef4444' },
  ];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="paystack-email" className={styles.label}>
          Email Address
        </label>
        <input
          id="paystack-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          placeholder="you@example.com"
          required
          disabled={loading}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="paystack-amount" className={styles.label}>
          Donation Amount
        </label>
        <div className={styles.currencyInput}>
          <span className={styles.currencySymbol}>₦</span>
          <input
            id="paystack-amount"
            type="number"
            min="100"
            step="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.input}
            placeholder="500"
            required
            disabled={loading}
          />
        </div>
        <small className={styles.helpText}>
          Minimum amount: ₦100
        </small>
      </div>

      <div className={styles.paymentMethodsPreview}>
        <span className={styles.methodsLabel}>Supported Payment Methods:</span>
        <div className={styles.methodsGrid}>
          {paymentMethods.map((method, index) => (
            <div key={index} className={styles.methodItem}>
              <method.icon 
                className={styles.methodIcon} 
                style={{ color: method.color }}
              />
              <span className={styles.methodLabel}>{method.label}</span>
            </div>
          ))}
        </div>
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
          <p>Your donation of {formatAmount(amount)} has been received.</p>
          <p className={styles.successNote}>
            A receipt has been sent to your email.
          </p>
        </div>
      )}

      <button
        type="submit"
        className={styles.paystackButton}
        disabled={loading || !paystackLoaded || !email}
      >
        {loading ? (
          <>
            <span className={styles.loadingSpinner} />
            Processing Payment...
          </>
        ) : !paystackLoaded ? (
          'Loading Payment Gateway...'
        ) : (
          <>
            <span className={styles.buttonIcon}>💝</span>
            Donate {formatAmount(amount)}
          </>
        )}
      </button>

      <div className={styles.securityNote}>
        <span className={styles.lockIcon}>🔒</span>
        Your payment is secure and encrypted
      </div>
    </form>
  );
}