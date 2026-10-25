'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FacebookUser, FacebookPage, AdAccount, ConnectedMetaAccount } from '@/types';
import { MOCK_FACEBOOK_USER, MOCK_FACEBOOK_PAGES, MOCK_AD_ACCOUNTS } from '@/data/mockData';
import { useToast } from '@/components/ui/Toast';

interface MetaAuthContextType {
  isConnected: boolean;
  user: FacebookUser | null;
  pages: FacebookPage[];
  activePage: FacebookPage | null;
  adAccounts: AdAccount[];
  activeAdAccount: AdAccount | null;
  isConnecting: boolean;
  showConnectModal: boolean;
  setShowConnectModal: (show: boolean) => void;
  selectPage: (pageId: string) => Promise<void>;
  selectAdAccount: (adAccountId: string) => Promise<void>;
  connectFacebook: () => Promise<void>;
  disconnectFacebook: () => Promise<void>;
}

const MetaAuthContext = createContext<MetaAuthContextType>({
  isConnected: true,
  user: MOCK_FACEBOOK_USER,
  pages: MOCK_FACEBOOK_PAGES,
  activePage: MOCK_FACEBOOK_PAGES[0],
  adAccounts: MOCK_AD_ACCOUNTS,
  activeAdAccount: MOCK_AD_ACCOUNTS[0],
  isConnecting: false,
  showConnectModal: false,
  setShowConnectModal: () => {},
  selectPage: async () => {},
  selectAdAccount: async () => {},
  connectFacebook: async () => {},
  disconnectFacebook: async () => {}
});

export const useMetaAuth = () => useContext(MetaAuthContext);

export const MetaAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [user, setUser] = useState<FacebookUser | null>(MOCK_FACEBOOK_USER);
  const [pages, setPages] = useState<FacebookPage[]>(MOCK_FACEBOOK_PAGES);
  const [activePageId, setActivePageId] = useState<string>(MOCK_FACEBOOK_PAGES[0].id);
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>(MOCK_AD_ACCOUNTS);
  const [activeAdAccountId, setActiveAdAccountId] = useState<string>(MOCK_AD_ACCOUNTS[0].id);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { showToast } = useToast();

  const activePage = pages.find(p => p.id === activePageId) || pages[0] || null;
  const activeAdAccount = adAccounts.find(a => a.id === activeAdAccountId) || adAccounts[0] || null;

  // Initial fetch from backend API
  useEffect(() => {
    fetch('/api/v2/auth/facebook')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setIsConnected(res.data.isConnected);
          setUser(res.data.user);
          setPages(res.data.pages);
          if (res.data.activePageId) setActivePageId(res.data.activePageId);
          if (res.data.activeAdAccountId) setActiveAdAccountId(res.data.activeAdAccountId);
        }
      })
      .catch(() => {});
  }, []);

  const selectPage = async (pageId: string) => {
    try {
      const res = await fetch('/api/v2/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'select_page', pageId })
      });
      const data = await res.json();
      if (data.success) {
        setActivePageId(pageId);
        const p = pages.find(x => x.id === pageId);
        showToast(`เปลี่ยนเพจเป้าหมายเป็น: ${p?.name || pageId}`, 'success');
      }
    } catch {
      setActivePageId(pageId);
    }
  };

  const selectAdAccount = async (adAccountId: string) => {
    try {
      const res = await fetch('/api/v2/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'select_ad_account', adAccountId })
      });
      const data = await res.json();
      if (data.success) {
        setActiveAdAccountId(adAccountId);
        const a = adAccounts.find(x => x.id === adAccountId);
        showToast(`เปลี่ยนบัญชีโฆษณาเป็น: ${a?.name || adAccountId}`, 'success');
      }
    } catch {
      setActiveAdAccountId(adAccountId);
    }
  };

  const connectFacebook = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/v2/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect' })
      });
      const data = await res.json();
      if (data.success) {
        setIsConnected(true);
        setUser(data.data.user);
        setPages(data.data.pages);
        setShowConnectModal(false);
        showToast('เชื่อมต่อบัญชี Facebook & เพจสำเร็จเรียบร้อย!', 'success');
      }
    } catch {
      showToast('การเชื่อมต่อขัดข้อง กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFacebook = async () => {
    try {
      await fetch('/api/v2/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' })
      });
      setIsConnected(false);
      setUser(null);
      showToast('ยกเลิกการเชื่อมต่อบัญชี Meta แล้ว', 'info');
    } catch {
      setIsConnected(false);
      setUser(null);
    }
  };

  return (
    <MetaAuthContext.Provider
      value={{
        isConnected,
        user,
        pages,
        activePage,
        adAccounts,
        activeAdAccount,
        isConnecting,
        showConnectModal,
        setShowConnectModal,
        selectPage,
        selectAdAccount,
        connectFacebook,
        disconnectFacebook
      }}
    >
      {children}
    </MetaAuthContext.Provider>
  );
};
