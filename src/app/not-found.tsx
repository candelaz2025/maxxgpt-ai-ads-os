import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 text-2xl font-bold font-mono">
        404
      </div>
      <h1 className="text-xl font-bold text-white">ไม่พบหน้าที่คุณต้องการ (Page Not Found)</h1>
      <p className="text-xs text-gray-400 max-w-sm">
        หน้าที่คุณกำลังเรียกหาอาจถูกย้าย หรือไม่มีอยู่ในระบบ MaxxGPT
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
      >
        <Home className="w-4 h-4" />
        <span>กลับสู่หน้าหลัก</span>
      </Link>
    </div>
  );
}
