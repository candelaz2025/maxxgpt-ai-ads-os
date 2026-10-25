import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET() {
  const account = await supabaseService.getMetaAccount();
  return NextResponse.json({
    success: true,
    data: account ? [account] : []
  });
}
