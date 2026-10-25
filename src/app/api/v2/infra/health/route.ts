import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET() {
  try {
    const health = await supabaseService.getHealth();
    return NextResponse.json({
      success: true,
      data: health
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Database health check failed'
    }, { status: 500 });
  }
}
