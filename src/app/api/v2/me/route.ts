import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET() {
  const account = await supabaseService.getMetaAccount();
  const pages = await supabaseService.getFacebookPages();

  return NextResponse.json({
    success: true,
    user: account ? {
      name: account.name,
      email: 'user@brand.com'
    } : null,
    adAccounts: account ? [account] : [],
    pagesCount: pages.length
  });
}
