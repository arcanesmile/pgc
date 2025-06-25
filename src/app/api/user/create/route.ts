import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/firebase/firebaseAdmin';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.split('Bearer ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = await verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid Token' }, { status: 403 });

  const body = await req.json();
  await dbConnect();

  const user = await User.create({
    uid: decoded.uid,
    email: decoded.email,
    ...body,
  });

  return NextResponse.json({ user });
}
