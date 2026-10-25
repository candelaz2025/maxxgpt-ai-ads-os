'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FacebookUser, FacebookPage, AdAccount } from '@/types';
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
  connectFacebook: (customToken?: string) => Promise<boolean>;
  disconnectFacebook: () => Promise<void>;
  refreshMetaAuth: () => Promise<void>;
}

const MetaAuthContext = createContext<MetaAuthContextType>({
  isConnected: false,
  user: null,
  pages: [],
  activePage: null,
  adAccounts: [],
  activeAdAccount: null,
  isConnecting: false,
  showConnectModal: false,
  setShowConnectModal: () => {},
  selectPage: async () => {},
  selectAdAccount: async () => {},
  connectFacebook: async () => false,
  disconnectFacebook: async () => {},
  refreshMetaAuth: async () => {}
});

export const useMetaAuth = () => useContext(MetaAuthContext);

export const MetaAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [user, setUser] = useState<FacebookUser | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [activePageId, setActivePageId] = useState<string>('');
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [activeAdAccountId, setActiveAdAccountId] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { showToast } = useToast();

  const activePage = pages.find(p => p.id === activePageId) || pages[0] || null;
  const activeAdAccount = adAccounts.find(a => a.id === activeAdAccountId) || adAccounts[0] || null;

  const refreshMetaAuth = async () => {
    try {
      const res = await fetch('/api/v2/auth/facebook');
      const json = await res.json();
      if (json.success && json.data) {
        setIsConnected(Boolean(json.data.isConnected));
        setUser(json.data.user || null);
        setPages(json.data.pages || []);
        if (json.data.activePageId) setActivePageId(json.data.activePageId);
        if (json.data.activeAdAccountId) setActiveAdAccountId(json.data.activeAdAccountId);
      }
    } catch {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    refreshMetaAuth();
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

  const connectFacebook = async (customToken?: string): Promise<boolean> => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/v2/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect_token',
          accessToken: customToken
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setIsConnected(true);
        setUser(data.data.user);
        setPages(data.data.pages || []);
        if (data.data.activePageId) setActivePageId(data.data.activePageId);
        if (data.data.activeAdAccountId) setActiveAdAccountId(data.data.activeAdAccountId);
        setShowConnectModal(false);
        showToast(data.message || 'เชื่อมต่อ Facebook และซิงค์เพจสำเร็จ!', 'success');
        return true;
      } else {
        showToast(data.error || 'การเชื่อมต่อไม่สำเร็จ กรุณาตรวจสอบ Access Token', 'error');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'การเชื่อมต่อขัดข้อง กรุณาลองใหม่อีกครั้ง', 'error');
      return false;
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
      setPages([]);
      setAdAccounts([]);
      showToast('ยกเลิกการเชื่อมต่อบัญชี Meta เรียบร้อย', 'info');
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
        disconnectFacebook,
        refreshMetaAuth
      }}
    >
      {children}
    </MetaAuthContext.Provider>
  );
};
