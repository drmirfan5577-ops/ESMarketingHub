import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Switch, Modal, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useAdmin } from '@/hooks/useAdmin';
import { useAlert } from '@/template';

const ADMIN_SECTIONS = [
  { id: 'features', label: 'Feature Controls', icon: 'toggle-on', color: '#00C853' },
  { id: 'settings', label: 'App Settings', icon: 'settings', color: '#00D4FF' },
  { id: 'content', label: 'Content Manager', icon: 'folder-open', color: '#FFD700' },
  { id: 'addmore', label: 'Add More Content', icon: 'add-circle', color: '#FF6B35' },
  { id: 'announcement', label: 'Announcements', icon: 'campaign', color: '#7B2FBE' },
  { id: 'tools', label: 'Custom Tools', icon: 'build', color: '#FF1744' },
  { id: 'deploy', label: 'Deploy & Export', icon: 'rocket-launch', color: '#00D4FF' },
  { id: 'docs', label: 'Documentation', icon: 'description', color: '#FFD700' },
  { id: 'ownership', label: 'Ownership & Legal', icon: 'gavel', color: '#00C853' },
  { id: 'backup', label: 'Backup & Recovery', icon: 'backup', color: '#FF6B35' },
];

const DEPLOY_PLATFORMS = [
  {
    name: 'GitHub', icon: 'code', color: '#ffffff', steps: [
      '1. Open OnSpace → Click GitHub icon (top toolbar)',
      '2. Connect your GitHub account (first time)',
      '3. Click "Push to GitHub" → creates repo automatically',
      '4. Your repo: github.com/YOUR_USERNAME/es-marketing-hub',
      '5. Set up auto-push: git add . && git commit -m "update" && git push',
    ],
    url: 'https://github.com',
    account: 'Create free at github.com → Sign Up',
  },
  {
    name: 'Netlify', icon: 'public', color: '#00C7B7', steps: [
      '1. Build web version: npx expo export --platform web',
      '2. Go to netlify.com → Add new site → Deploy manually',
      '3. Drag & drop the "dist" folder',
      '4. Get instant URL: your-app.netlify.app',
      '5. Connect GitHub for auto-deploy on every push',
    ],
    url: 'https://netlify.com',
    account: 'Free at netlify.com → Sign up with GitHub',
  },
  {
    name: 'Supabase', icon: 'storage', color: '#3ECF8E', steps: [
      '1. Go to supabase.com → New Project',
      '2. Note your Project URL and anon key',
      '3. In OnSpace: Cloud Mode → Settings → Add Supabase keys',
      '4. Create tables: users, campaigns, calendar_events, leaderboard',
      '5. Enable Row Level Security for data privacy',
    ],
    url: 'https://supabase.com',
    account: 'Free tier: 500MB DB, 1GB storage at supabase.com',
  },
  {
    name: 'Cloudflare', icon: 'cloud', color: '#F48120', steps: [
      '1. Sign up at cloudflare.com (free)',
      '2. Add your domain → point DNS to Netlify/Vercel',
      '3. Enable "Proxied" for CDN + DDoS protection',
      '4. Use Cloudflare Workers for edge functions',
      '5. Enable SSL/TLS → Full (strict) mode',
    ],
    url: 'https://cloudflare.com',
    account: 'Free CDN, DNS, SSL at cloudflare.com',
  },
  {
    name: 'Figma', icon: 'design-services', color: '#A259FF', steps: [
      '1. Go to figma.com → Create free account',
      '2. New file → Import from phone screenshots',
      '3. Use "React Native to Figma" plugin to sync designs',
      '4. Share design link with developers/clients',
      '5. Export assets as PNG/SVG for use in the app',
    ],
    url: 'https://figma.com',
    account: 'Free starter plan at figma.com',
  },
  {
    name: 'Vercel', icon: 'flash-on', color: '#ffffff', steps: [
      '1. Go to vercel.com → Sign up with GitHub',
      '2. Import your GitHub repository',
      '3. Set build command: npx expo export --platform web',
      '4. Set output dir: dist',
      '5. Deploy — get URL: your-app.vercel.app',
    ],
    url: 'https://vercel.com',
    account: 'Free hobby plan at vercel.com → Continue with GitHub',
  },
];

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const {
    isAdminUnlocked, features, settings, customContent,
    unlockAdmin, lockAdmin, toggleFeature, updateSettings,
    addCustomTool, removeCustomTool, addAnnouncement, removeAnnouncement, resetAllSettings,
  } = useAdmin();

  const [password, setPassword] = useState('');
  const [wrongPass, setWrongPass] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newToolName, setNewToolName] = useState('');
  const [newToolDesc, setNewToolDesc] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [editingKey, setEditingKey] = useState<keyof typeof settings | null>(null);
  const [editingVal, setEditingVal] = useState('');
  const [deployIdx, setDeployIdx] = useState<number | null>(null);
  const [urlModalVisible, setUrlModalVisible] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  const handleLogin = () => {
    const success = unlockAdmin(password);
    if (!success) { setWrongPass(true); setTimeout(() => setWrongPass(false), 2000); }
    setPassword('');
  };

  const handleEditSetting = (key: keyof typeof settings, val: any) => {
    setEditingKey(key);
    setEditingVal(String(val));
  };

  const saveSettingEdit = () => {
    if (!editingKey) return;
    const cur = settings[editingKey];
    if (typeof cur === 'number') updateSettings({ [editingKey]: parseInt(editingVal) || 0 });
    else if (typeof cur === 'boolean') updateSettings({ [editingKey]: editingVal === 'true' });
    else updateSettings({ [editingKey]: editingVal });
    setEditingKey(null);
  };

  const handleAddTool = () => {
    if (!newToolName || !newToolDesc) { showAlert('Missing Fields', 'Enter tool name and description.'); return; }
    addCustomTool({
      id: `ct_${Date.now()}`,
      name: newToolName,
      description: newToolDesc,
      category: newToolCategory || 'Custom',
      icon: 'build',
      color: Colors.primary,
    });
    setNewToolName(''); setNewToolDesc(''); setNewToolCategory('');
    showAlert('Added!', `"${newToolName}" added to your tools library.`);
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement) return;
    addAnnouncement(newAnnouncement, Colors.primary);
    setNewAnnouncement('');
    showAlert('Announcement Added', 'It will appear on the home screen.');
  };

  const handleImportFromUrl = () => {
    if (!importUrl) { showAlert('Enter URL', 'Paste a copyright-free asset URL.'); return; }
    showAlert(
      'Import Started',
      `Downloading from:\n${importUrl}\n\nAsset will be available in your content library. In production, this connects to your backend storage.`,
      [{ text: 'OK' }]
    );
    setImportUrl('');
    setUrlModalVisible(false);
  };

  const handleReset = () => {
    showAlert('Reset All Settings', 'This will restore all default settings and clear customizations. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => { resetAllSettings(); showAlert('Reset Complete', 'All settings restored to defaults.'); } },
    ]);
  };

  if (!isAdminUnlocked) {
    return (
      <View style={[styles.root, styles.loginRoot, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.loginBack}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textMuted} />
        </Pressable>
        <View style={styles.loginCard}>
          <View style={styles.loginIconWrap}>
            <MaterialIcons name="admin-panel-settings" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.loginTitle}>Admin Panel</Text>
          <Text style={styles.loginSub}>E-S Marketing Hub — Restricted Access</Text>
          <View style={styles.loginFieldWrap}>
            <MaterialIcons name="lock" size={18} color={Colors.textMuted} style={styles.loginFieldIcon} />
            <TextInput
              style={[styles.loginField, wrongPass && { borderColor: Colors.error }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter admin password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              onSubmitEditing={handleLogin}
              autoCapitalize="none"
            />
          </View>
          {wrongPass && <Text style={styles.wrongPass}>Incorrect password. Try again.</Text>}
          <Pressable style={styles.loginBtn} onPress={handleLogin}>
            <MaterialIcons name="lock-open" size={20} color={Colors.background} />
            <Text style={styles.loginBtnText}>Unlock Admin Panel</Text>
          </Pressable>
          <Text style={styles.loginHint}>Default: Admin5577</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* URL Import Modal */}
      <Modal visible={urlModalVisible} transparent animationType="slide" onRequestClose={() => setUrlModalVisible(false)}>
        <Pressable style={styles.modalBg} onPress={() => setUrlModalVisible(false)} />
        <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Import from URL</Text>
          <Text style={styles.sheetSub}>Paste a copyright-free asset URL (image, video, audio)</Text>
          <TextInput
            style={styles.sheetField}
            value={importUrl}
            onChangeText={setImportUrl}
            placeholder="https://unsplash.com/... or any free asset URL"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.sheetHint}>💡 Free sources: Unsplash, Pexels, Pixabay, Freepik, OpenGameArt</Text>
          <Pressable style={styles.sheetBtn} onPress={handleImportFromUrl}>
            <MaterialIcons name="download" size={20} color={Colors.background} />
            <Text style={styles.sheetBtnText}>Import & Embed in App</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Deploy Detail Modal */}
      <Modal visible={deployIdx !== null} transparent animationType="slide" onRequestClose={() => setDeployIdx(null)}>
        <Pressable style={styles.modalBg} onPress={() => setDeployIdx(null)} />
        {deployIdx !== null && (
          <View style={[styles.deploySheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.deployPlatHeader}>
              <MaterialIcons name={DEPLOY_PLATFORMS[deployIdx].icon as any} size={28} color={DEPLOY_PLATFORMS[deployIdx].color} />
              <Text style={[styles.deployPlatName, { color: DEPLOY_PLATFORMS[deployIdx].color }]}>{DEPLOY_PLATFORMS[deployIdx].name}</Text>
            </View>
            <View style={styles.accountBox}>
              <MaterialIcons name="person-add" size={16} color={Colors.primary} />
              <Text style={styles.accountText}>{DEPLOY_PLATFORMS[deployIdx].account}</Text>
            </View>
            <Text style={styles.stepsTitle}>Step-by-Step Setup:</Text>
            {DEPLOY_PLATFORMS[deployIdx].steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepNum, { backgroundColor: DEPLOY_PLATFORMS[deployIdx].color + '22' }]}>
                  <Text style={[styles.stepNumText, { color: DEPLOY_PLATFORMS[deployIdx].color }]}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step.replace(/^\d+\. /, '')}</Text>
              </View>
            ))}
            <View style={styles.deployUrlRow}>
              <MaterialIcons name="link" size={16} color={Colors.primary} />
              <Text style={styles.deployUrl}>{DEPLOY_PLATFORMS[deployIdx].url}</Text>
            </View>
          </View>
        )}
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSub}>Full Control · {settings.appName}</Text>
        </View>
        <Pressable onPress={() => showAlert('Lock Admin', 'Lock the admin panel?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Lock', style: 'destructive', onPress: () => { lockAdmin(); router.back(); } },
        ])} style={styles.lockBtn}>
          <MaterialIcons name="lock" size={18} color={Colors.primary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Admin Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Admin Access Active · Build {settings.buildNumber}</Text>
          <Text style={styles.versionBadge}>v{settings.version}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.qStat}>
            <Text style={styles.qStatVal}>{features.filter(f => f.enabled).length}</Text>
            <Text style={styles.qStatLabel}>Active Features</Text>
          </View>
          <View style={styles.qStat}>
            <Text style={[styles.qStatVal, { color: '#FF6B35' }]}>{features.filter(f => !f.enabled).length}</Text>
            <Text style={styles.qStatLabel}>Disabled</Text>
          </View>
          <View style={styles.qStat}>
            <Text style={[styles.qStatVal, { color: '#00D4FF' }]}>{customContent.customTools.length}</Text>
            <Text style={styles.qStatLabel}>Custom Tools</Text>
          </View>
          <View style={styles.qStat}>
            <Text style={[styles.qStatVal, { color: '#00C853' }]}>{customContent.importedFiles.length}</Text>
            <Text style={styles.qStatLabel}>Imported Files</Text>
          </View>
        </View>

        {/* Section Navigation */}
        <View style={styles.sectionGrid}>
          {ADMIN_SECTIONS.map(sec => (
            <Pressable key={sec.id}
              style={[styles.sectionCard, activeSection === sec.id && { borderColor: sec.color, backgroundColor: sec.color + '11' }]}
              onPress={() => setActiveSection(activeSection === sec.id ? null : sec.id)}>
              <View style={[styles.sectionIconWrap, { backgroundColor: sec.color + '22' }]}>
                <MaterialIcons name={sec.icon as any} size={22} color={sec.color} />
              </View>
              <Text style={[styles.sectionLabel, activeSection === sec.id && { color: sec.color }]}>{sec.label}</Text>
              <MaterialIcons name={activeSection === sec.id ? 'expand-less' : 'expand-more'} size={16} color={activeSection === sec.id ? sec.color : Colors.textMuted} />
            </Pressable>
          ))}
        </View>

        {/* ---- FEATURE CONTROLS ---- */}
        {activeSection === 'features' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Feature Enable / Disable</Text>
            <Text style={styles.panelSub}>Toggle any feature hub on or off. Disabled features are hidden from users.</Text>
            {features.map(feature => (
              <View key={feature.id} style={styles.featureRow}>
                <View style={[styles.featureIconWrap, { backgroundColor: feature.color + '22' }]}>
                  <MaterialIcons name={feature.icon as any} size={20} color={feature.color} />
                </View>
                <Text style={styles.featureName}>{feature.label}</Text>
                <Switch
                  value={feature.enabled}
                  onValueChange={() => toggleFeature(feature.id)}
                  thumbColor={feature.enabled ? Colors.primary : Colors.textMuted}
                  trackColor={{ false: Colors.surfaceElevated, true: Colors.primary + '44' }}
                />
              </View>
            ))}
          </View>
        )}

        {/* ---- APP SETTINGS ---- */}
        {activeSection === 'settings' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>App Configuration</Text>
            {(Object.entries(settings) as [keyof typeof settings, any][]).map(([key, value]) => (
              <View key={key} style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingKey}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</Text>
                  {editingKey === key ? (
                    <View style={styles.editRow}>
                      <TextInput
                        style={styles.editField}
                        value={editingVal}
                        onChangeText={setEditingVal}
                        autoFocus
                        onSubmitEditing={saveSettingEdit}
                      />
                      <Pressable style={styles.saveEditBtn} onPress={saveSettingEdit}>
                        <MaterialIcons name="check" size={18} color={Colors.background} />
                      </Pressable>
                    </View>
                  ) : (
                    <Text style={styles.settingValue} numberOfLines={1}>{String(value)}</Text>
                  )}
                </View>
                {typeof value === 'boolean' ? (
                  <Switch
                    value={value}
                    onValueChange={() => updateSettings({ [key]: !value })}
                    thumbColor={value ? Colors.primary : Colors.textMuted}
                    trackColor={{ false: Colors.surfaceElevated, true: Colors.primary + '44' }}
                  />
                ) : (
                  <Pressable onPress={() => handleEditSetting(key, value)} style={styles.editBtn}>
                    <MaterialIcons name="edit" size={16} color={Colors.primary} />
                  </Pressable>
                )}
              </View>
            ))}
            <Pressable style={styles.dangerBtn} onPress={handleReset}>
              <MaterialIcons name="restore" size={18} color={Colors.error} />
              <Text style={styles.dangerBtnText}>Reset All to Defaults</Text>
            </Pressable>
          </View>
        )}

        {/* ---- CONTENT MANAGER ---- */}
        {activeSection === 'content' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Content Manager</Text>
            <View style={styles.contentStats}>
              <Text style={styles.contentStatRow}>• Custom Tools Added: {customContent.customTools.length}</Text>
              <Text style={styles.contentStatRow}>• Imported Files: {customContent.importedFiles.length}</Text>
              <Text style={styles.contentStatRow}>• Active Announcements: {customContent.announcements.filter(a => a.active).length}</Text>
            </View>
            {customContent.customTools.length > 0 && (
              <>
                <Text style={styles.miniHeader}>Your Custom Tools:</Text>
                {customContent.customTools.map(tool => (
                  <View key={tool.id} style={styles.contentItemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contentItemName}>{tool.name}</Text>
                      <Text style={styles.contentItemSub}>{tool.category} · {tool.description.slice(0, 40)}...</Text>
                    </View>
                    <Pressable onPress={() => showAlert('Remove Tool', `Remove "${tool.name}"?`, [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Remove', style: 'destructive', onPress: () => removeCustomTool(tool.id) },
                    ])}>
                      <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                    </Pressable>
                  </View>
                ))}
              </>
            )}
            {customContent.importedFiles.length > 0 && (
              <>
                <Text style={styles.miniHeader}>Imported Files:</Text>
                {customContent.importedFiles.map((file, i) => (
                  <View key={i} style={styles.contentItemRow}>
                    <MaterialIcons name="insert-drive-file" size={20} color={Colors.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contentItemName}>{file.name}</Text>
                      <Text style={styles.contentItemSub}>{file.type} · {file.addedAt}</Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* ---- ADD MORE ---- */}
        {activeSection === 'addmore' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Add More Content</Text>
            <Text style={styles.panelSub}>Import files from your device or download from copyright-free web sources.</Text>

            <View style={styles.importGrid}>
              <Pressable style={styles.importCard} onPress={() => showAlert('Device Files', 'Document picker opens here. In production build: picks files from device storage (images, videos, audio, PDFs).\n\nSupported: JPG, PNG, MP4, MOV, MP3, WAV, PDF')}>
                <MaterialIcons name="photo-library" size={32} color="#FFD700" />
                <Text style={styles.importCardTitle}>Device Gallery</Text>
                <Text style={styles.importCardSub}>Photos & Videos</Text>
              </Pressable>
              <Pressable style={styles.importCard} onPress={() => showAlert('Device Files', 'File picker for audio files. Supported: MP3, WAV, AAC, M4A')}>
                <MaterialIcons name="audio-file" size={32} color="#00D4FF" />
                <Text style={styles.importCardTitle}>Audio Files</Text>
                <Text style={styles.importCardSub}>MP3, WAV, AAC</Text>
              </Pressable>
              <Pressable style={styles.importCard} onPress={() => setUrlModalVisible(true)}>
                <MaterialIcons name="link" size={32} color="#00C853" />
                <Text style={styles.importCardTitle}>From URL</Text>
                <Text style={styles.importCardSub}>Copyright-free web</Text>
              </Pressable>
              <Pressable style={styles.importCard} onPress={() => showAlert('PDF Import', 'PDF picker opens here. Files are stored locally and accessible from all tool screens.')}>
                <MaterialIcons name="picture-as-pdf" size={32} color="#FF1744" />
                <Text style={styles.importCardTitle}>PDF Documents</Text>
                <Text style={styles.importCardSub}>Import & Embed</Text>
              </Pressable>
            </View>

            <Text style={styles.miniHeader}>Copyright-Free Sources:</Text>
            {[
              { name: 'Unsplash', desc: 'Free high-res photos', url: 'unsplash.com', color: '#000000' },
              { name: 'Pexels', desc: 'Free photos & videos', url: 'pexels.com', color: '#05A081' },
              { name: 'Pixabay', desc: 'Free images, videos, music', url: 'pixabay.com', color: '#2EC66D' },
              { name: 'Freepik', desc: 'Free vectors & templates', url: 'freepik.com', color: '#FF3D00' },
              { name: 'Mixkit', desc: 'Free stock video & audio', url: 'mixkit.co', color: '#7B2FBE' },
              { name: 'OpenGameArt', desc: 'Free game assets', url: 'opengameart.org', color: '#FF6B35' },
            ].map((src, i) => (
              <View key={i} style={styles.sourceRow}>
                <View style={[styles.sourceIconWrap, { backgroundColor: src.color + '22' }]}>
                  <MaterialIcons name="public" size={18} color={src.color || Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sourceName}>{src.name}</Text>
                  <Text style={styles.sourceDesc}>{src.desc} · {src.url}</Text>
                </View>
                <Pressable style={styles.sourceBtn} onPress={() => { setImportUrl(`https://${src.url}`); setUrlModalVisible(true); }}>
                  <Text style={styles.sourceBtnText}>Import</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* ---- ANNOUNCEMENTS ---- */}
        {activeSection === 'announcement' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Announcements</Text>
            <Text style={styles.panelSub}>Announcements appear on the Home screen banner.</Text>
            <TextInput
              style={styles.panelField}
              value={newAnnouncement}
              onChangeText={setNewAnnouncement}
              placeholder="Write announcement text..."
              placeholderTextColor={Colors.textMuted}
              multiline
            />
            <Pressable style={styles.panelAddBtn} onPress={handleAddAnnouncement}>
              <MaterialIcons name="add" size={18} color={Colors.background} />
              <Text style={styles.panelAddBtnText}>Add Announcement</Text>
            </Pressable>
            {customContent.announcements.map(ann => (
              <View key={ann.id} style={[styles.annRow, { borderLeftColor: ann.color }]}>
                <Text style={styles.annText} numberOfLines={2}>{ann.text}</Text>
                <Pressable onPress={() => removeAnnouncement(ann.id)}>
                  <MaterialIcons name="close" size={18} color={Colors.error} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* ---- CUSTOM TOOLS ---- */}
        {activeSection === 'tools' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Add Custom Tool</Text>
            <Text style={styles.panelSub}>Custom tools appear in the Tools tab with your content.</Text>
            <TextInput style={styles.panelField} value={newToolName} onChangeText={setNewToolName}
              placeholder="Tool Name *" placeholderTextColor={Colors.textMuted} />
            <TextInput style={[styles.panelField, { height: 80 }]} value={newToolDesc} onChangeText={setNewToolDesc}
              placeholder="Tool Description *" placeholderTextColor={Colors.textMuted} multiline />
            <TextInput style={styles.panelField} value={newToolCategory} onChangeText={setNewToolCategory}
              placeholder="Category (e.g. SEO, Social, Email)" placeholderTextColor={Colors.textMuted} />
            <Pressable style={styles.panelAddBtn} onPress={handleAddTool}>
              <MaterialIcons name="add" size={18} color={Colors.background} />
              <Text style={styles.panelAddBtnText}>Add to Tools Library</Text>
            </Pressable>
            {customContent.customTools.length > 0 && (
              <>
                <Text style={styles.miniHeader}>Custom Tools ({customContent.customTools.length}):</Text>
                {customContent.customTools.map(tool => (
                  <View key={tool.id} style={styles.contentItemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contentItemName}>{tool.name}</Text>
                      <Text style={styles.contentItemSub}>{tool.category} — {tool.description}</Text>
                    </View>
                    <Pressable onPress={() => removeCustomTool(tool.id)}>
                      <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                    </Pressable>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* ---- DEPLOY & EXPORT ---- */}
        {activeSection === 'deploy' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Deploy & Export</Text>
            <Text style={styles.panelSub}>Connect to global platforms for publishing, hosting, and CI/CD.</Text>
            <View style={styles.deployBtns}>
              <Pressable style={styles.exportPrimaryBtn} onPress={() => showAlert('Export Source Code', 'In OnSpace:\n1. Click Download button (toolbar)\n2. Select "Download Source Code"\n3. Get complete .zip with all files\n4. Use for backup or manual deployment')}>
                <MaterialIcons name="download" size={20} color={Colors.background} />
                <Text style={styles.exportPrimaryBtnText}>Download Source Code</Text>
              </Pressable>
              <Pressable style={styles.exportSecondaryBtn} onPress={() => showAlert('Build APK', 'In OnSpace:\n1. Click Download button\n2. Select "Download APK"\n3. Get Android APK file\n4. Share for testing or direct install')}>
                <MaterialIcons name="android" size={20} color={Colors.primary} />
                <Text style={styles.exportSecondaryBtnText}>Build Android APK</Text>
              </Pressable>
            </View>
            <Text style={styles.miniHeader}>Platform Deployment Wizards:</Text>
            {DEPLOY_PLATFORMS.map((platform, i) => (
              <Pressable key={i} style={styles.deployPlatRow} onPress={() => setDeployIdx(i)}>
                <View style={[styles.deployPlatIcon, { backgroundColor: platform.color + '22' }]}>
                  <MaterialIcons name={platform.icon as any} size={22} color={platform.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.deployPlatLabel, { color: platform.color }]}>{platform.name}</Text>
                  <Text style={styles.deployPlatSub}>{platform.steps.length} setup steps · Tap for wizard</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={14} color={Colors.textMuted} />
              </Pressable>
            ))}
          </View>
        )}

        {/* ---- DOCUMENTATION ---- */}
        {activeSection === 'docs' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Complete Documentation</Text>
            {[
              {
                title: 'Google Play Store Upload Guide',
                icon: 'android', color: '#3DDC84',
                content: `STEP 1 — BUILD APK/AAB\n• Install EAS: npm install -g eas-cli\n• Login: eas login\n• Configure: eas build:configure\n• Build: eas build --platform android --profile production\n\nSTEP 2 — PLAY CONSOLE\n• Go to play.google.com/console\n• Create Developer Account ($25 one-time)\n• Click "Create app"\n• Fill app details\n\nSTEP 3 — STORE LISTING\n• Short Desc: All-in-one marketing hub: 53+ tools, AI copy, video ads\n• Category: Business / Productivity\n• Rating: Everyone\n\nSTEP 4 — REQUIRED ASSETS\n• App Icon: 512×512 PNG\n• Feature Graphic: 1024×500 PNG\n• Screenshots: Min 2, max 8\n\nSTEP 5 — SUBMIT\n• Upload .aab file in Production track\n• Complete all green checkmarks\n• Submit (3-7 business days review)`,
              },
              {
                title: 'Apple App Store Upload Guide',
                icon: 'apple', color: '#555555',
                content: `STEP 1 — APPLE DEVELOPER ACCOUNT\n• Join at developer.apple.com ($99/year)\n• Create App ID: com.esmarketing.hub\n• Create Distribution Certificate\n\nSTEP 2 — BUILD IOS\n• Run: eas build --platform ios --profile production\n• Wait for build (15-30 minutes)\n\nSTEP 3 — APP STORE CONNECT\n• Go to appstoreconnect.apple.com\n• Click "+" New App\n• Select Bundle ID\n• Fill metadata\n\nSTEP 4 — UPLOAD BUILD\n• Use Transporter app\n• Or: eas submit --platform ios\n\nSTEP 5 — REVIEW\n• Submit for App Review\n• Wait 1-3 business days`,
              },
              {
                title: 'Expo Go Testing',
                icon: 'phone-android', color: '#00D4FF',
                content: `METHOD 1 — ONSPACE VIEW ON PHONE\n• Click "View on Phone" in OnSpace toolbar\n• Download OnSpace mobile app\n• Scan QR code shown\n\nMETHOD 2 — EXPO GO\n• Install Expo Go from App/Play Store\n• Run: npx expo start\n• Scan QR code in terminal\n\nMETHOD 3 — DEVELOPMENT BUILD\n• Run: eas build --profile development\n• Install on device\n• Supports all native features`,
              },
            ].map((doc, i) => (
              <View key={i} style={[styles.docCard, { borderLeftColor: doc.color }]}>
                <Pressable style={styles.docHeader} onPress={() => showAlert(doc.title, doc.content)}>
                  <MaterialIcons name={doc.icon as any} size={22} color={doc.color} />
                  <Text style={[styles.docTitle, { color: doc.color }]}>{doc.title}</Text>
                  <MaterialIcons name="open-in-new" size={16} color={doc.color} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* ---- OWNERSHIP & LEGAL ---- */}
        {activeSection === 'ownership' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Ownership & Legal Documentation</Text>
            {[
              {
                title: 'Intellectual Property',
                color: '#FFD700',
                icon: 'workspace-premium',
                text: `App Name: E-S Marketing Tools Hub\nFramework: React Native / Expo (MIT License)\nIcons: @expo/vector-icons (MIT License)\nAll custom code, tools, templates, and marketing content in this repository is original work.\n\nTo assert full legal ownership:\n1. Trademark: Apply at USPTO (usa.gov/trademark) ~$350\n2. Copyright: Automatic on creation (register at copyright.gov)\n3. Privacy Policy: Required for app stores\n4. Terms of Service: Create at termly.io (free)`,
              },
              {
                title: 'Privacy Policy (Ready-to-Use)',
                color: '#00C853',
                icon: 'privacy-tip',
                text: `Privacy Policy — E-S Marketing Tools Hub\nLast Updated: ${new Date().getFullYear()}\n\n1. DATA COLLECTED\nThis app stores all data locally on your device only. No personal data is sent to external servers without your consent.\n\n2. NOTIFICATIONS\nUsed only for your scheduled content reminders. You can disable in device settings.\n\n3. ANALYTICS\nNo third-party analytics or tracking SDKs are used.\n\n4. THIRD-PARTY SERVICES\nThe app uses Expo services for build/deployment only.\n\n5. CONTACT\nadmin@esmarketing.hub`,
              },
              {
                title: 'Terms of Service',
                color: '#00D4FF',
                icon: 'gavel',
                text: `Terms of Service — E-S Marketing Tools Hub\n\n1. ACCEPTANCE: By using this app you agree to these terms.\n\n2. LICENSE: Free for personal and commercial marketing use.\n\n3. PROHIBITED USES: No spam, no illegal advertising, no misleading content.\n\n4. MEDICAL CONTENT: All medical presentations are for educational purposes only. Always verify with licensed professionals.\n\n5. AI-GENERATED CONTENT: AI copy is AI-assisted. You are responsible for reviewing before publishing.\n\n6. LIMITATION OF LIABILITY: The developer is not liable for marketing outcomes.\n\n7. CHANGES: Terms may be updated with notice.`,
              },
            ].map((doc, i) => (
              <Pressable key={i} style={[styles.docCard, { borderLeftColor: doc.color }]}
                onPress={() => showAlert(doc.title, doc.text)}>
                <View style={styles.docHeader}>
                  <MaterialIcons name={doc.icon as any} size={22} color={doc.color} />
                  <Text style={[styles.docTitle, { color: doc.color }]}>{doc.title}</Text>
                  <MaterialIcons name="open-in-new" size={16} color={doc.color} />
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* ---- BACKUP & RECOVERY ---- */}
        {activeSection === 'backup' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Backup & Recovery Setup</Text>
            {[
              { title: 'Method 1: GitHub (Recommended)', color: '#ffffff', icon: 'code', steps: ['Connect GitHub via OnSpace toolbar', 'Push to GitHub: git add . && git commit -m "backup" && git push', 'Auto-backup on every change', 'Recover: git clone github.com/user/repo && npm install'] },
              { title: 'Method 2: Source Code Download', color: '#FFD700', icon: 'download', steps: ['Click Download in OnSpace toolbar', 'Select "Download Source Code"', 'Save .zip to local drive + cloud', 'Also save to Google Drive / Dropbox'] },
              { title: 'Method 3: EAS Cloud Builds', color: '#00D4FF', icon: 'cloud-upload', steps: ['Run: eas build --platform all', 'Builds stored on Expo servers 30 days', 'Download APK/IPA anytime', 'Use as emergency recovery'] },
              { title: 'Emergency Recovery Steps', color: '#00C853', icon: 'restore', steps: ['Clone from GitHub: git clone ...', 'Run: npm install', 'Start: npx expo start', 'All data is restored from repo'] },
            ].map((method, i) => (
              <View key={i} style={[styles.backupMethod, { borderLeftColor: method.color }]}>
                <View style={styles.backupMethodHeader}>
                  <MaterialIcons name={method.icon as any} size={20} color={method.color} />
                  <Text style={[styles.backupMethodTitle, { color: method.color }]}>{method.title}</Text>
                </View>
                {method.steps.map((step, j) => (
                  <Text key={j} style={styles.backupStep}>• {step}</Text>
                ))}
              </View>
            ))}
            <Pressable style={styles.backupNowBtn} onPress={() => showAlert('Backup Info', 'To backup: Use OnSpace GitHub integration (toolbar) or Download Source Code. All app data and settings are in the source code.')}>
              <MaterialIcons name="backup" size={20} color={Colors.background} />
              <Text style={styles.backupNowBtnText}>View Backup Instructions</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  loginRoot: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg },
  loginBack: { position: 'absolute', top: 60, left: 20, padding: 10 },
  loginCard: {
    width: '100%', backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  loginIconWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary + '22',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  loginTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text, marginBottom: 4 },
  loginSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 24, textAlign: 'center' },
  loginFieldWrap: {
    flexDirection: 'row', alignItems: 'center', width: '100%',
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 12,
  },
  loginFieldIcon: { paddingHorizontal: 14 },
  loginField: {
    flex: 1, height: 52, fontSize: FontSize.md, color: Colors.text,
    paddingRight: Spacing.md,
  },
  wrongPass: { fontSize: FontSize.sm, color: Colors.error, marginBottom: 8 },
  loginBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center',
    backgroundColor: Colors.primary, width: '100%', height: 52,
    borderRadius: BorderRadius.lg, marginTop: 8,
  },
  loginBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  loginHint: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 12 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text },
  headerSub: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  lockBtn: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '22', justifyContent: 'center', alignItems: 'center',
  },
  scroll: { paddingHorizontal: Spacing.md },
  statusBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#00C853' + '11', borderRadius: BorderRadius.lg,
    padding: 10, marginBottom: Spacing.md, borderWidth: 1, borderColor: '#00C85333',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C853' },
  statusText: { flex: 1, fontSize: FontSize.sm, color: '#00C853', fontWeight: FontWeight.semibold },
  versionBadge: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.bold },
  quickStats: {
    flexDirection: 'row', backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  qStat: { flex: 1, alignItems: 'center' },
  qStatVal: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  qStatLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
  sectionGrid: { gap: 8, marginBottom: Spacing.md },
  sectionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  sectionIconWrap: { width: 40, height: 40, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  sectionLabel: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  panel: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  panelTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.text, marginBottom: 4 },
  panelSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.md, lineHeight: 18 },
  panelField: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.md, fontSize: FontSize.md, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 10,
  },
  panelAddBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 48, borderRadius: BorderRadius.lg, marginBottom: Spacing.md,
  },
  panelAddBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  featureIconWrap: { width: 36, height: 36, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  featureName: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  settingKey: { fontSize: 9, color: Colors.textMuted, fontWeight: FontWeight.extrabold, letterSpacing: 0.5, marginBottom: 2 },
  settingValue: { fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.medium },
  editRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  editField: {
    flex: 1, backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    paddingHorizontal: 10, height: 36, fontSize: FontSize.sm, color: Colors.text, borderWidth: 1, borderColor: Colors.primary,
  },
  saveEditBtn: { width: 36, height: 36, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  editBtn: { padding: 6 },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: Spacing.md, paddingVertical: 12, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.error,
  },
  dangerBtnText: { fontSize: FontSize.md, color: Colors.error, fontWeight: FontWeight.semibold },
  contentStats: { backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md },
  contentStatRow: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4 },
  miniHeader: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, marginTop: Spacing.sm, marginBottom: 8 },
  contentItemRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    padding: Spacing.sm, marginBottom: 6, borderWidth: 1, borderColor: Colors.border,
  },
  contentItemName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  contentItemSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  importGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: Spacing.md },
  importCard: {
    width: '47%', backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.xl,
    padding: Spacing.md, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border,
  },
  importCardTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  importCardSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  sourceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    padding: 10, marginBottom: 6, borderWidth: 1, borderColor: Colors.border,
  },
  sourceIconWrap: { width: 36, height: 36, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  sourceName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  sourceDesc: { fontSize: FontSize.xs, color: Colors.textMuted },
  sourceBtn: { backgroundColor: Colors.primary + '22', paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.full },
  sourceBtnText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold },
  annRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    padding: Spacing.sm, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: Colors.primary, borderWidth: 1, borderColor: Colors.border,
  },
  annText: { flex: 1, fontSize: FontSize.sm, color: Colors.text },
  deployBtns: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  exportPrimaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 48, borderRadius: BorderRadius.lg,
  },
  exportPrimaryBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.background },
  exportSecondaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.primary, height: 48, borderRadius: BorderRadius.lg,
  },
  exportSecondaryBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  deployPlatRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  deployPlatIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  deployPlatLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  deployPlatSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  docCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: 8, borderLeftWidth: 3, borderWidth: 1, borderColor: Colors.border,
  },
  docHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  docTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  backupMethod: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: 10, borderLeftWidth: 3, borderWidth: 1, borderColor: Colors.border,
  },
  backupMethodHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  backupMethodTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  backupStep: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4, lineHeight: 18 },
  backupNowBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg, marginTop: 8,
  },
  backupNowBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  bottomSheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.md,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text, marginBottom: 4 },
  sheetSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 16 },
  sheetField: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.md, fontSize: FontSize.md, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 8,
  },
  sheetHint: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 16 },
  sheetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg,
  },
  sheetBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  deploySheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.md, maxHeight: '80%',
  },
  deployPlatHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  deployPlatName: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  accountBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary + '11', borderRadius: BorderRadius.md,
    padding: 10, marginBottom: 16, borderWidth: 1, borderColor: Colors.primary + '33',
  },
  accountText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium, flex: 1 },
  stepsTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 10 },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  stepNum: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  stepNumText: { fontSize: FontSize.xs, fontWeight: FontWeight.extrabold },
  stepText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  deployUrlRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  deployUrl: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
});
