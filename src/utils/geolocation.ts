// utils/geolocation.ts
export type PaymentProvider = 'stripe' | 'paystack' | null;
export async function getRecommendedPaymentProvider(): Promise<PaymentProvider> {
  // For development/testing, you can use a mock
  if (process.env.NODE_ENV === 'development') {
    // Mock based on URL parameter or localStorage
    const mockProvider = localStorage.getItem('mockPaymentProvider') as PaymentProvider;
    if (mockProvider) return mockProvider;
  }

  try {
    // Get user's country from IP or browser
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Countries where Paystack is popular (West Africa)
    const paystackCountries = [
      'NG', // Nigeria
      'GH', // Ghana
      'KE', // Kenya
      'ZA', // South Africa
      'CI', // Côte d'Ivoire
      'SN', // Senegal
      'UG', // Uganda
      'TZ', // Tanzania
    ];
    
    if (paystackCountries.includes(data.country_code)) {
      return 'paystack';
    }
    
    // Default to Stripe for other countries
    return 'stripe';
  } catch (error) {
    console.error('Failed to detect location:', error);
    return 'stripe'; // Fallback to Stripe
  }
}