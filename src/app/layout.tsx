import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastProvider } from '@/components/ui/Toast';
import { MetaAuthProvider } from '@/context/MetaAuthContext';
import { FacebookConnectModal } from '@/components/auth/FacebookConnectModal';

export const metadata: Metadata = {
  title: 'MaxxGPT - AI Ads Operating System & 30-Subagent Swarm',
  description: 'AI Marketing & Meta Ads Automation platform powered by 30 specialized subagents with Facebook Page login.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#080a0f] text-gray-100 flex min-h-screen">
        <ToastProvider>
          <MetaAuthProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-6 overflow-y-auto">
                {children}
              </main>
            </div>
            <FacebookConnectModal />
          </MetaAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
