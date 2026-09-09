import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Animated, Easing, Modal, Share,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useAlert } from '@/template';

const VIDEO_STYLES = [
  { id: 'vs1', name: 'Product Showcase', icon: 'star', color: '#FFD700', desc: 'Clean product hero with features' },
  { id: 'vs2', name: 'Story Mode', icon: 'auto-stories', color: '#FF6B35', desc: 'Before/after narrative arc' },
  { id: 'vs3', name: 'Testimonial', icon: 'record-voice-over', color: '#00C853', desc: 'Customer success story format' },
  { id: 'vs4', name: 'Countdown Sale', icon: 'timer', color: '#FF1744', desc: 'Urgency-driven sale format' },
  { id: 'vs5', name: 'Tutorial Demo', icon: 'play-lesson', color: '#00D4FF', desc: 'Step-by-step how-to format' },
  { id: 'vs6', name: 'Brand Intro', icon: 'business', color: '#7B2FBE', desc: 'Company brand story reveal' },
];

const TRANSITIONS = [
  { id: 'tr1', name: 'Fade', icon: 'blur-on' },
  { id: 'tr2', name: '3D Flip', icon: 'flip' },
  { id: 'tr3', name: 'Zoom Burst', icon: 'zoom-in' },
  { id: 'tr4', name: 'Slide Push', icon: 'arrow-forward' },
  { id: 'tr5', name: 'Glitch Cut', icon: 'broken-image' },
  { id: 'tr6', name: 'Particle', icon: 'grain' },
];

const MUSIC_OPTIONS = [
  { id: 'm1', name: 'Energetic Upbeat', icon: 'music-note', bpm: '128 BPM' },
  { id: 'm2', name: 'Cinematic Epic', icon: 'movie', bpm: '80 BPM' },
  { id: 'm3', name: 'Chill Lofi', icon: 'headphones', bpm: '90 BPM' },
  { id: 'm4', name: 'Corporate Clean', icon: 'work', bpm: '110 BPM' },
  { id: 'm5', name: 'Hip Hop Beats', icon: 'queue-music', bpm: '120 BPM' },
  { id: 'm6', name: 'No Music', icon: 'volume-off', bpm: 'Silent' },
];

const SCENE_TEMPLATES = [
  { id: 'sc1', name: 'Hook Scene', desc: 'Stop-scroll opening with bold text', duration: '0-3s', color: '#FF1744' },
  { id: 'sc2', name: 'Problem Scene', desc: 'Pain point relatable situation', duration: '3-8s', color: '#FF6B35' },
  { id: 'sc3', name: 'Solution Reveal', desc: 'Product/service introduction', duration: '8-15s', color: '#FFD700' },
  { id: 'sc4', name: 'Feature Showcase', desc: 'Key benefits visual display', duration: '15-22s', color: '#00D4FF' },
  { id: 'sc5', name: 'Social Proof', desc: 'Reviews, stats, testimonials', duration: '22-26s', color: '#00C853' },
  { id: 'sc6', name: 'CTA Close', desc: 'Call to action with offer', duration: '26-30s', color: '#7B2FBE' },
];

export default function VideoAdMakerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [productName, setProductName] = useState('');
  const [tagline, setTagline] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [selectedStyle, setSelectedStyle] = useState('vs1');
  const [selectedTransition, setSelectedTransition] = useState('tr1');
  const [selectedMusic, setSelectedMusic] = useState('m1');
  const [selectedScenes, setSelectedScenes] = useState<string[]>(['sc1', 'sc2', 'sc3', 'sc4', 'sc5', 'sc6']);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<15 | 30 | 60>(30);
  const [selectedRatio, setSelectedRatio] = useState(0);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [shareLink, setShareLink] = useState('');
  const [shareVisible, setShareVisible] = useState(false);

  const sceneAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<any>(null);

  const AD_THEMES = [
    { bg: '#0a0a1a', accent: '#FFD700', name: 'Gold Dark' },
    { bg: '#0d1f2d', accent: '#00D4FF', name: 'Cyber Blue' },
    { bg: '#1a0d2e', accent: '#7B2FBE', name: 'Neon Purple' },
    { bg: '#1a0d0d', accent: '#FF1744', name: 'Fire Red' },
    { bg: '#0d1a0d', accent: '#00C853', name: 'Matrix Green' },
  ];

  const currentTheme = AD_THEMES[selectedTheme];
  const activeScenes = SCENE_TEMPLATES.filter(s => selectedScenes.includes(s.id));

  const toggleScene = (id: string) => {
    setSelectedScenes(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const startPreview = () => {
    if (!productName) { showAlert('Missing Info', 'Please enter a product/brand name first.'); return; }
    setCurrentScene(0);
    setPreviewVisible(true);
    setIsPlaying(true);
    playSceneAnim();
  };

  const playSceneAnim = () => {
    sceneAnim.setValue(0);
    Animated.parallel([
      Animated.timing(sceneAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.loop(Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])),
    ]).start();
  };

  const nextScene = () => {
    if (currentScene < activeScenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      playSceneAnim();
    } else {
      setIsPlaying(false);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
      playSceneAnim();
    }
  };

  const DURATION_OPTIONS = [{ val: 15, label: '15s', desc: 'Instagram Reels, TikTok' }, { val: 30, label: '30s', desc: 'Facebook, YouTube' }, { val: 60, label: '60s', desc: 'YouTube, LinkedIn' }] as const;
  const PLATFORM_RATIOS = [
    { name: '9:16 Story', desc: 'TikTok, Reels, Stories', width: 1080, height: 1920 },
    { name: '1:1 Square', desc: 'Instagram, Facebook Feed', width: 1080, height: 1080 },
    { name: '16:9 Wide', desc: 'YouTube, Google Ads', width: 1920, height: 1080 },
    { name: '4:5 Portrait', desc: 'Instagram Feed', width: 1080, height: 1350 },
  ];

  const generateShareLink = () => {
    const id = Math.random().toString(36).slice(2, 10).toUpperCase();
    const link = `https://es-marketing.hub/preview/${id}`;
    setShareLink(link);
    setShareVisible(true);
  };

  const currentSceneData = activeScenes[currentScene];
  const currentStyle = VIDEO_STYLES.find(v => v.id === selectedStyle);
  const currentMusic = MUSIC_OPTIONS.find(m => m.id === selectedMusic);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Share Link Modal */}
      <Modal visible={shareVisible} animationType="fade" transparent onRequestClose={() => setShareVisible(false)}>
        <View style={styles.shareBg}>
          <View style={[styles.shareModal, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.shareHandle} />
            <MaterialIcons name="share" size={32} color={Colors.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={styles.shareTitle}>Shareable Preview Link</Text>
            <View style={styles.linkBox}>
              <Text style={styles.linkText} selectable>{shareLink}</Text>
              <Pressable style={styles.copyLinkBtn} onPress={() => Share.share({ message: shareLink })}>
                <MaterialIcons name="content-copy" size={18} color={Colors.primary} />
              </Pressable>
            </View>
            <View style={styles.shareDetails}>
              <Text style={styles.shareDetailTitle}>Ad Summary</Text>
              <Text style={styles.shareDetailRow}>🎥 Style: {currentStyle?.name}</Text>
              <Text style={styles.shareDetailRow}>⏱ Duration: {duration}s</Text>
              <Text style={styles.shareDetailRow}>📱 Format: {['9:16 Story', '1:1 Square', '16:9 Wide', '4:5 Portrait'][selectedRatio]}</Text>
              <Text style={styles.shareDetailRow}>🎵 Music: {currentMusic?.name}</Text>
              <Text style={styles.shareDetailRow}>🎬 Scenes: {selectedScenes.length} scenes</Text>
              <Text style={styles.shareDetailRow}>📌 Watermark: {watermarkEnabled ? 'Enabled' : 'Disabled'}</Text>
            </View>
            <View style={styles.shareBtns}>
              <Pressable style={styles.sharePrimary}
                onPress={() => Share.share({ message: `Check out my video ad!\n${shareLink}\n\nMade with E-S Marketing Hub` })}>
                <MaterialIcons name="ios-share" size={18} color={Colors.background} />
                <Text style={styles.sharePrimaryText}>Share Link</Text>
              </Pressable>
              <Pressable style={styles.shareClose} onPress={() => setShareVisible(false)}>
                <Text style={styles.shareCloseText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Video Ad Maker</Text>
          <Text style={styles.headerSub}>Animated video ads with scenes & transitions</Text>
        </View>
        <Pressable style={styles.previewHeaderBtn} onPress={startPreview}>
          <MaterialIcons name="play-arrow" size={20} color={Colors.background} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Ad Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ad Content</Text>
          <Text style={styles.fieldLabel}>Brand / Product Name *</Text>
          <TextInput style={styles.field} value={productName} onChangeText={setProductName}
            placeholder="e.g. NovaSkin Serum" placeholderTextColor={Colors.textMuted} />
          <Text style={styles.fieldLabel}>Tagline / Key Message</Text>
          <TextInput style={styles.field} value={tagline} onChangeText={setTagline}
            placeholder="e.g. Glow in just 7 days" placeholderTextColor={Colors.textMuted} />
          <Text style={styles.fieldLabel}>Call to Action Text</Text>
          <TextInput style={styles.field} value={ctaText} onChangeText={setCtaText}
            placeholder="e.g. Shop Now, Get 50% Off" placeholderTextColor={Colors.textMuted} />
        </View>

        {/* Video Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Style</Text>
          <View style={styles.styleGrid}>
            {VIDEO_STYLES.map(style => (
              <Pressable key={style.id}
                style={[styles.styleCard, selectedStyle === style.id && { borderColor: style.color, backgroundColor: style.color + '11' }]}
                onPress={() => setSelectedStyle(style.id)}>
                <MaterialIcons name={style.icon as any} size={24} color={selectedStyle === style.id ? style.color : Colors.textSecondary} />
                <Text style={[styles.styleName, selectedStyle === style.id && { color: style.color }]}>{style.name}</Text>
                <Text style={styles.styleDesc}>{style.desc}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Color Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Theme</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themeRow}>
            {AD_THEMES.map((theme, i) => (
              <Pressable key={i} style={[styles.themeChip, selectedTheme === i && { borderColor: theme.accent }]}
                onPress={() => setSelectedTheme(i)}>
                <View style={[styles.themePreview, { backgroundColor: theme.bg, borderColor: theme.accent }]}>
                  <View style={[styles.themeDot, { backgroundColor: theme.accent }]} />
                </View>
                <Text style={[styles.themeName, selectedTheme === i && { color: theme.accent }]}>{theme.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Scene Builder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scene Builder ({selectedScenes.length} scenes)</Text>
          {SCENE_TEMPLATES.map(scene => (
            <Pressable key={scene.id}
              style={[styles.sceneRow, selectedScenes.includes(scene.id) && { borderColor: scene.color, backgroundColor: scene.color + '0A' }]}
              onPress={() => toggleScene(scene.id)}>
              <View style={[styles.sceneColorBar, { backgroundColor: scene.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sceneName}>{scene.name}</Text>
                <Text style={styles.sceneDesc}>{scene.desc}</Text>
              </View>
              <Text style={[styles.sceneDuration, { color: scene.color }]}>{scene.duration}</Text>
              <View style={[styles.sceneCheck, selectedScenes.includes(scene.id) && { backgroundColor: scene.color, borderColor: scene.color }]}>
                {selectedScenes.includes(scene.id) && <MaterialIcons name="check" size={12} color={Colors.background} />}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Transitions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transition Effect</Text>
          <View style={styles.transGrid}>
            {TRANSITIONS.map(tr => (
              <Pressable key={tr.id}
                style={[styles.transCard, selectedTransition === tr.id && { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' }]}
                onPress={() => setSelectedTransition(tr.id)}>
                <MaterialIcons name={tr.icon as any} size={22} color={selectedTransition === tr.id ? Colors.primary : Colors.textMuted} />
                <Text style={[styles.transName, selectedTransition === tr.id && { color: Colors.primary }]}>{tr.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Music */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Background Music</Text>
          {MUSIC_OPTIONS.map(music => (
            <Pressable key={music.id}
              style={[styles.musicRow, selectedMusic === music.id && { borderColor: Colors.primary, backgroundColor: Colors.primary + '0D' }]}
              onPress={() => setSelectedMusic(music.id)}>
              <MaterialIcons name={music.icon as any} size={22} color={selectedMusic === music.id ? Colors.primary : Colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.musicName, selectedMusic === music.id && { color: Colors.primary }]}>{music.name}</Text>
                <Text style={styles.musicBpm}>{music.bpm}</Text>
              </View>
              {selectedMusic === music.id && <MaterialIcons name="check-circle" size={20} color={Colors.primary} />}
            </Pressable>
          ))}
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Duration</Text>
          <View style={styles.durationRow}>
            {([15, 30, 60] as const).map(d => (
              <Pressable key={d}
                style={[styles.durationBtn, duration === d && { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' }]}
                onPress={() => setDuration(d)}>
                <Text style={[styles.durationVal, duration === d && { color: Colors.primary }]}>{d}s</Text>
                <Text style={styles.durationDesc}>{d === 15 ? 'TikTok/Reels' : d === 30 ? 'Facebook/YT' : 'YouTube/LI'}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Platform Ratio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Output Format / Ratio</Text>
          <View style={styles.ratioGrid}>
            {(['9:16 Story', '1:1 Square', '16:9 Wide', '4:5 Portrait'] as const).map((ratio, i) => (
              <Pressable key={i}
                style={[styles.ratioCard, selectedRatio === i && { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' }]}
                onPress={() => setSelectedRatio(i)}>
                <View style={[styles.ratioPreview,
                  i === 0 && { width: 20, height: 36 },
                  i === 1 && { width: 30, height: 30 },
                  i === 2 && { width: 40, height: 23 },
                  i === 3 && { width: 24, height: 30 },
                  { borderColor: selectedRatio === i ? Colors.primary : Colors.border }
                ]} />
                <Text style={[styles.ratioName, selectedRatio === i && { color: Colors.primary }]}>{ratio}</Text>
                <Text style={styles.ratioDesc}>{['TikTok, Reels', 'IG, FB Feed', 'YouTube, Google', 'Instagram Feed'][i]}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Watermark */}
        <View style={styles.section}>
          <View style={styles.watermarkRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Brand Watermark</Text>
              <Text style={styles.watermarkDesc}>Add "E-S Marketing Hub" branding overlay</Text>
            </View>
            <Pressable
              style={[styles.toggleWm, watermarkEnabled && { backgroundColor: Colors.primary }]}
              onPress={() => setWatermarkEnabled(p => !p)}>
              <View style={[styles.toggleKnob, watermarkEnabled && { left: 22 }]} />
            </Pressable>
          </View>
        </View>

        {/* Preview & Export */}
        <Pressable style={({ pressed }) => [styles.previewBtn, pressed && { opacity: 0.9 }]} onPress={startPreview}>
          <MaterialIcons name="play-circle-filled" size={24} color={Colors.background} />
          <Text style={styles.previewBtnText}>Preview Full Ad</Text>
        </Pressable>

        <Pressable style={styles.exportBtn2} onPress={generateShareLink}>
          <MaterialIcons name="share" size={22} color={Colors.primary} />
          <Text style={styles.exportBtnText}>Generate Shareable Preview Link</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Preview Modal */}
      <Modal visible={previewVisible} animationType="fade" onRequestClose={() => setPreviewVisible(false)}>
        <View style={[styles.previewModal, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.previewModalHeader}>
            <Pressable onPress={() => { setPreviewVisible(false); setIsPlaying(false); }} style={styles.closeBtn}>
              <MaterialIcons name="close" size={22} color={Colors.text} />
            </Pressable>
            <Text style={styles.previewModalTitle}>{productName || 'Video Ad'} Preview</Text>
            <Text style={styles.sceneCount}>{currentScene + 1}/{activeScenes.length}</Text>
          </View>

          {/* Scene Canvas */}
          {currentSceneData && (
            <Animated.View style={[styles.sceneCanvas, { backgroundColor: currentTheme.bg },
              { opacity: sceneAnim, transform: [{ scale: sceneAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }
            ]}>
              {/* Glow Effect */}
              <Animated.View style={[styles.glowCircle, { borderColor: currentTheme.accent },
                { opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.3] }) }]} />

              <View style={[styles.sceneBadge, { backgroundColor: currentSceneData.color }]}>
                <Text style={styles.sceneBadgeText}>{currentSceneData.duration}</Text>
              </View>

              <Animated.View style={[styles.sceneIconLarge, { backgroundColor: currentSceneData.color + '22' },
                { transform: [{ scale: pulseAnim }] }]}>
                <MaterialIcons name="videocam" size={56} color={currentSceneData.color} />
              </Animated.View>

              <Text style={[styles.sceneTitle, { color: currentTheme.accent }]}>{currentSceneData.name}</Text>
              <Text style={styles.sceneProdName}>{productName}</Text>
              {tagline !== '' && <Text style={[styles.sceneTagline, { color: currentTheme.accent + 'CC' }]}>{tagline}</Text>}
              <Text style={styles.sceneDescModal}>{currentSceneData.desc}</Text>

              {currentScene === activeScenes.length - 1 && (
                <Animated.View style={[styles.ctaButton, { backgroundColor: currentTheme.accent },
                  { transform: [{ scale: pulseAnim }] }]}>
                  <Text style={[styles.ctaButtonText, { color: currentTheme.bg }]}>{ctaText}</Text>
                </Animated.View>
              )}

              {/* Duration + Ratio badge */}
              {watermarkEnabled && (
                <View style={[styles.styleBadge, { bottom: 36 }]}>
                  <MaterialIcons name="verified" size={10} color={currentTheme.accent} />
                  <Text style={[styles.styleBadgeText, { color: currentTheme.accent }]}>E-S Marketing Hub</Text>
                </View>
              )}
              <View style={[styles.durationBadge, { backgroundColor: currentTheme.accent + '33' }]}>
                <Text style={[styles.durationBadgeText, { color: currentTheme.accent }]}>{duration}s · {['9:16', '1:1', '16:9', '4:5'][selectedRatio]}</Text>
              </View>
              {/* Style badge */}
              <View style={styles.styleBadge}>
                <MaterialIcons name={currentStyle?.icon as any || 'star'} size={12} color={currentTheme.accent} />
                <Text style={[styles.styleBadgeText, { color: currentTheme.accent }]}>{currentStyle?.name}</Text>
              </View>
            </Animated.View>
          )}

          {/* Timeline */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeline} contentContainerStyle={styles.timelineContent}>
            {activeScenes.map((scene, i) => (
              <Pressable key={scene.id} onPress={() => { setCurrentScene(i); playSceneAnim(); }}
                style={[styles.timelineItem, i === currentScene && { borderColor: scene.color }]}>
                <View style={[styles.timelineDot, { backgroundColor: i <= currentScene ? scene.color : Colors.surfaceElevated }]} />
                <Text style={[styles.timelineLabel, i === currentScene && { color: scene.color }]} numberOfLines={1}>
                  {scene.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Nav */}
          <View style={styles.previewNav}>
            <Pressable style={[styles.navBtn, currentScene === 0 && { opacity: 0.4 }]}
              onPress={prevScene} disabled={currentScene === 0}>
              <MaterialIcons name="skip-previous" size={28} color={Colors.text} />
            </Pressable>
            <Pressable style={styles.playPauseBtn} onPress={() => { setIsPlaying(!isPlaying); playSceneAnim(); }}>
              <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={32} color={Colors.background} />
            </Pressable>
            <Pressable style={[styles.navBtn, currentScene === activeScenes.length - 1 && { opacity: 0.4 }]}
              onPress={nextScene} disabled={currentScene === activeScenes.length - 1}>
              <MaterialIcons name="skip-next" size={28} color={Colors.text} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
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
  previewHeaderBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  scroll: { paddingHorizontal: Spacing.md },
  section: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: 6, marginTop: 10 },
  field: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, height: 48, fontSize: FontSize.md,
    color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  styleCard: {
    width: '48%', backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: 4,
  },
  styleName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textAlign: 'center' },
  styleDesc: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  themeRow: { gap: 10, paddingVertical: 4 },
  themeChip: { alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, padding: 8 },
  themePreview: {
    width: 48, height: 32, borderRadius: BorderRadius.sm, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  themeDot: { width: 16, height: 16, borderRadius: 8 },
  themeName: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium },
  sceneRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    padding: 12, marginBottom: 6, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  sceneColorBar: { width: 3, height: '100%', borderRadius: 2, position: 'absolute', left: 0 },
  sceneName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text, marginLeft: 6 },
  sceneDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 6 },
  sceneDuration: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  sceneCheck: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  transGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  transCard: {
    width: '30%', alignItems: 'center', padding: 10, gap: 4,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  transName: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', fontWeight: FontWeight.medium },
  musicRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    padding: 12, marginBottom: 6, borderWidth: 1, borderColor: Colors.border,
  },
  musicName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  musicBpm: { fontSize: FontSize.xs, color: Colors.textMuted },
  previewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, height: 56, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm,
  },
  previewBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.background },
  exportBtn2: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.surfaceElevated, height: 52, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.primary,
  },
  exportBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
  previewModal: { flex: 1, backgroundColor: '#050510' },
  previewModalHeader: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#ffffff11',
  },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#ffffff11', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  previewModalTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  sceneCount: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.bold },
  sceneCanvas: {
    flex: 1, margin: Spacing.md, borderRadius: BorderRadius.xl,
    justifyContent: 'center', alignItems: 'center', padding: Spacing.lg,
    borderWidth: 1, borderColor: '#ffffff11', overflow: 'hidden',
  },
  glowCircle: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    borderWidth: 1, top: -50, right: -50,
  },
  sceneBadge: {
    position: 'absolute', top: 12, right: 12,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  sceneBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.extrabold, color: Colors.background },
  sceneIconLarge: {
    width: 110, height: 110, borderRadius: 55,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  sceneTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, textAlign: 'center', marginBottom: 6 },
  sceneProdName: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text, textAlign: 'center' },
  sceneTagline: { fontSize: FontSize.md, textAlign: 'center', marginTop: 4, fontStyle: 'italic' },
  sceneDescModal: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  ctaButton: {
    paddingHorizontal: 32, paddingVertical: 14,
    borderRadius: BorderRadius.full, marginTop: 20,
  },
  ctaButtonText: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, letterSpacing: 1 },
  styleBadge: {
    position: 'absolute', bottom: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  styleBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  timeline: { maxHeight: 72, borderTopWidth: 1, borderTopColor: '#ffffff11' },
  timelineContent: { paddingHorizontal: Spacing.md, paddingVertical: 8, gap: 8, alignItems: 'center' },
  timelineItem: {
    alignItems: 'center', padding: 8, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceCard, minWidth: 70,
  },
  timelineDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  timelineLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center', fontWeight: '600' },
  previewNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24,
    paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: '#ffffff11',
  },
  navBtn: { padding: 8 },
  playPauseBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  durationRow: { flexDirection: 'row', gap: 10 },
  durationBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  durationVal: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.textSecondary },
  durationDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  ratioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  ratioCard: {
    width: '47%', alignItems: 'center', paddingVertical: 14, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  ratioPreview: { borderWidth: 2, borderRadius: 4 },
  ratioName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  ratioDesc: { fontSize: FontSize.xs, color: Colors.textMuted },
  watermarkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  watermarkDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  toggleWm: {
    width: 50, height: 28, borderRadius: 14, backgroundColor: Colors.border,
    position: 'relative', justifyContent: 'center',
  },
  toggleKnob: {
    position: 'absolute', left: 3, width: 22, height: 22,
    borderRadius: 11, backgroundColor: Colors.text,
  },
  durationBadge: {
    position: 'absolute', top: 12, left: 12,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  durationBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  shareBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  shareModal: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.md,
  },
  shareHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  shareTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text, textAlign: 'center', marginBottom: Spacing.md },
  linkBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg, padding: Spacing.md, gap: 10, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary + '44',
  },
  linkText: { flex: 1, fontSize: FontSize.sm, color: Colors.primary },
  copyLinkBtn: { padding: 4 },
  shareDetails: { backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  shareDetailTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 8 },
  shareDetailRow: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4 },
  shareBtns: { flexDirection: 'row', gap: 12 },
  sharePrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 48, borderRadius: BorderRadius.lg,
  },
  sharePrimaryText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  shareClose: {
    flex: 1, alignItems: 'center', justifyContent: 'center', height: 48,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border,
  },
  shareCloseText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
