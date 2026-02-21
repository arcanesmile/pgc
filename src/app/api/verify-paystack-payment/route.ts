// app/api/verify-paystack-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();
    
    const response = await fetch('https://api.paystack.co/transaction/verify/' + reference, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      // Payment successful
      // Save to your database, send email, etc.
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully',
        data: data.data 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Paystack verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}