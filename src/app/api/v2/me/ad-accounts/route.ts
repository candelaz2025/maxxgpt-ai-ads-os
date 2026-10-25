import { NextResponse } from 'next/server';
import { MOCK_AD_ACCOUNTS } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    data: MOCK_AD_ACCOUNTS,
    count: MOCK_AD_ACCOUNTS.length
  });
}
