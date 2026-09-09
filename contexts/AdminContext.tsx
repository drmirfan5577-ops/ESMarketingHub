import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppFeature {
  id: string;
  label: string;
  icon: string;
  route: string;
  enabled: boolean;
  color: string;
}

export interface AppSettings {
  appName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
  showWatermark: boolean;
  notificationsEnabled: boolean;
  defaultAITone: string;
  adminEmail: string;
  version: string;
  buildNumber: number;
  maintenanceMode: boolean;
}

export interface CustomContent {
  importedFiles: { name: string; type: string; uri: string; addedAt: string }[];
  customTools: { id: string; name: string; description: string; category: string; icon: string; color: string }[];
  customTemplates: { id: string; name: string; type: string; content: string }[];
  announcements: { id: string; text: string; active: boolean; color: string }[];
}

interface AdminContextType {
  isAdminUnlocked: boolean;
  features: AppFeature[];
  settings: AppSettings;
  customContent: CustomContent;
  unlockAdmin: (password: string) => boolean;
  lockAdmin: () => void;
  toggleFeature: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  addCustomTool: (tool: CustomContent['customTools'][0]) => void;
  removeCustomTool: (id: string) => void;
  addImportedFile: (file: CustomContent['importedFiles'][0]) => void;
  removeImportedFile: (name: string) => void;
  addAnnouncement: (text: string, color: string) => void;
  removeAnnouncement: (id: string) => void;
  resetAllSettings: () => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'Admin5577';

const DEFAULT_FEATURES: AppFeature[] = [
  { id: 'prompts', label: 'AI Prompts Generator', icon: 'auto-fix-high', route: '/prompts', enabled: true, color: '#FFD700' },
  { id: 'medical', label: 'Medical Builder', icon: 'local-hospital', route: '/medical', enabled: true, color: '#FF1744' },
  { id: 'videoad', label: 'Video Ad Maker', icon: 'videocam', route: '/videoad', enabled: true, color: '#7B2FBE' },
  { id: 'calendar', label: 'Content Calendar', icon: 'event', route: '/calendar', enabled: true, color: '#00D4FF' },
  { id: 'roi', label: 'ROI Analytics', icon: 'bar-chart', route: '/roi', enabled: true, color: '#00C853' },
  { id: 'game', label: 'Game Generator', icon: 'sports-esports', route: '/game', enabled: true, color: '#FF6B35' },
  { id: 'ai-copy', label: 'AI Copy Writer', icon: 'auto-awesome', route: '/ai-copy', enabled: true, color: '#FFD700' },
  { id: 'template-editor', label: 'Template Editor', icon: 'edit', route: '/template-editor', enabled: true, color: '#00D4FF' },
  { id: 'trending-ads', label: 'Trending Ads', icon: 'trending-up', route: '/trending-ads', enabled: true, color: '#00C853' },
  { id: 'analytics-charts', label: 'Analytics Charts', icon: 'insert-chart', route: '/analytics-charts', enabled: true, color: '#FF6B35' },
  { id: 'promo', label: 'App Promo Kit', icon: 'campaign', route: '/promo', enabled: true, color: '#FF6B35' },
  { id: 'tools', label: 'Marketing Tools', icon: 'build', route: '/(tabs)/tools', enabled: true, color: '#FFD700' },
  { id: 'templates', label: 'Templates Library', icon: 'layers', route: '/(tabs)/templates', enabled: true, color: '#00D4FF' },
  { id: 'social', label: 'Social Media Hub', icon: 'people', route: '/(tabs)/social', enabled: true, color: '#00C853' },
];

const DEFAULT_SETTINGS: AppSettings = {
  appName: 'E-S Marketing Hub',
  tagline: 'Your Complete Marketing Powerhouse',
  primaryColor: '#FFD700',
  accentColor: '#00D4FF',
  darkMode: true,
  showWatermark: true,
  notificationsEnabled: true,
  defaultAITone: 'Professional',
  adminEmail: 'admin@esmarketing.hub',
  version: '2.0.0',
  buildNumber: 200,
  maintenanceMode: false,
};

const DEFAULT_CONTENT: CustomContent = {
  importedFiles: [],
  customTools: [],
  customTemplates: [],
  announcements: [
    { id: 'a1', text: '🚀 Welcome to E-S Marketing Hub v2.0 — 53+ tools, AI powered!', active: true, color: '#FFD700' },
  ],
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [features, setFeatures] = useState<AppFeature[]>(DEFAULT_FEATURES);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [customContent, setCustomContent] = useState<CustomContent>(DEFAULT_CONTENT);

  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('@admin_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.features) setFeatures(data.features);
        if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        if (data.customContent) setCustomContent({ ...DEFAULT_CONTENT, ...data.customContent });
      }
    } catch {}
  };

  const persist = async (feat: AppFeature[], sett: AppSettings, cont: CustomContent) => {
    try {
      await AsyncStorage.setItem('@admin_data', JSON.stringify({ features: feat, settings: sett, customContent: cont }));
    } catch {}
  };

  const unlockAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminUnlocked(true);
      return true;
    }
    return false;
  };

  const lockAdmin = () => setIsAdminUnlocked(false);

  const toggleFeature = (id: string) => {
    const updated = features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f);
    setFeatures(updated);
    persist(updated, settings, customContent);
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    persist(features, updated, customContent);
  };

  const addCustomTool = (tool: CustomContent['customTools'][0]) => {
    const updated = { ...customContent, customTools: [...customContent.customTools, tool] };
    setCustomContent(updated);
    persist(features, settings, updated);
  };

  const removeCustomTool = (id: string) => {
    const updated = { ...customContent, customTools: customContent.customTools.filter(t => t.id !== id) };
    setCustomContent(updated);
    persist(features, settings, updated);
  };

  const addImportedFile = (file: CustomContent['importedFiles'][0]) => {
    const updated = { ...customContent, importedFiles: [...customContent.importedFiles, file] };
    setCustomContent(updated);
    persist(features, settings, updated);
  };

  const removeImportedFile = (name: string) => {
    const updated = { ...customContent, importedFiles: customContent.importedFiles.filter(f => f.name !== name) };
    setCustomContent(updated);
    persist(features, settings, updated);
  };

  const addAnnouncement = (text: string, color: string) => {
    const ann = { id: `ann_${Date.now()}`, text, active: true, color };
    const updated = { ...customContent, announcements: [...customContent.announcements, ann] };
    setCustomContent(updated);
    persist(features, settings, updated);
  };

  const removeAnnouncement = (id: string) => {
    const updated = { ...customContent, announcements: customContent.announcements.filter(a => a.id !== id) };
    setCustomContent(updated);
    persist(features, settings, updated);
  };

  const resetAllSettings = () => {
    setFeatures(DEFAULT_FEATURES);
    setSettings(DEFAULT_SETTINGS);
    setCustomContent(DEFAULT_CONTENT);
    AsyncStorage.removeItem('@admin_data');
  };

  return (
    <AdminContext.Provider value={{
      isAdminUnlocked, features, settings, customContent,
      unlockAdmin, lockAdmin, toggleFeature, updateSettings,
      addCustomTool, removeCustomTool, addImportedFile, removeImportedFile,
      addAnnouncement, removeAnnouncement, resetAllSettings,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
