import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  Animated, Easing, Share,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { buildPromoText } from '@/services/shareService';

const PROMO_HIGHLIGHTS = [
  { icon: 'auto-awesome', label: '53+ Marketing Tools', sub: 'SEO, Social, Email, Video & more', color: '#FFD700' },
  { icon: 'smart-toy', label: 'AI Copy Generator', sub: '8 formats · 6 formulas · AI scoring', color: '#00D4FF' },
  { icon: 'videocam', label: 'Video Ad Maker', sub: '6 styles · 15s/30s/60s · 4 ratios', color: '#7B2FBE' },
  { icon: 'layers', label: '100+ Templates', sub: 'Fully editable · Live preview · Export', color: '#FF6B35' },
  { icon: 'insert-chart', label: 'Analytics Dashboards', sub: 'Charts · ROAS · AI insights', color: '#00C853' },
  { icon: 'local-hospital', label: 'Medical Presentations', sub: '8 specialties · PDF export', color: '#FF1744' },
  { icon: 'sports-esports', label: 'Game Generator', sub: '5 games · Leaderboard · Publish-ready', color: '#00D4FF' },
  { icon: 'trending-up', label: '25 Trending Ad Formats', sub: 'Hooks · CTAs · Why It Works', color: '#FFD700' },
];

const PLATFORMS = [
  { icon: 'photo-camera', label: 'Instagram', color: '#E1306C' },
  { icon: 'people', label: 'Facebook', color: '#1877F2' },
  { icon: 'music-video', label: 'TikTok', color: '#FF0050' },
  { icon: 'work', label: 'LinkedIn', color: '#0A66C2' },
  { icon: 'play-circle-filled', label: 'YouTube', color: '#FF0000' },
  { icon: 'search', label: 'Google', color: '#4285F4' },
  { icon: 'email', label: 'Email', color: '#FF6B35' },
  { icon: 'phone-android', label: 'Mobile Apps', color: '#00C853' },
];

export default function PromoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.loop(Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])),
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleSharePromo = async () => {
    const msg = buildPromoText('E-S Marketing Tools Hub');
    await Share.share({ message: msg, title: 'E-S Marketing Hub' });
  };

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>App Promo</Text>
          <Text style={styles.headerSub}>Ready-to-run advertisement</Text>
        </View>
        <Pressable style={styles.shareHeaderBtn} onPress={handleSharePromo}>
          <MaterialIcons name="share" size={18} color={Colors.background} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero Banner */}
        <Animated.View style={[styles.heroBanner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Image
            source={require('@/assets/images/promo-banner.png')}
            style={styles.heroImg}
            contentFit="cover"
            transition={200}
          />
          <Animated.View style={[styles.heroGlow, { opacity: glowOpacity }]} />
          <View style={styles.heroContent}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>ALL-IN-ONE</Text></View>
              <View style={[styles.heroBadge, { backgroundColor: '#00C853' }]}><Text style={styles.heroBadgeText}>FREE TO TRY</Text></View>
            </View>
            <Text style={styles.heroTitle}>E-S Marketing{'\n'}Tools Hub</Text>
            <Text style={styles.heroSub}>The #1 Marketing App for Professionals</Text>
            <Animated.View style={[styles.heroCta, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.heroCtaText}>🚀 Download Now — It's Free</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Story Format Banner */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Story Ad (9:16)</Text>
          <Text style={styles.sectionSub}>Instagram · TikTok · Reels</Text>
        </View>
        <View style={styles.storyPreview}>
          <Image
            source={require('@/assets/images/promo-story.png')}
            style={styles.storyImg}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.storyOverlay}>
            <View style={styles.storyBadge}><Text style={styles.storyBadgeText}>SWIPE UP</Text></View>
            <Text style={styles.storyTitle}>Market Smarter{'\n'}Not Harder</Text>
            <Text style={styles.storySub}>53+ Tools in 1 App</Text>
          </View>
        </View>

        {/* Key Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Why Marketers Love This App</Text>
          <View style={styles.statsGrid}>
            {[
              { val: '53+', label: 'Marketing Tools', color: Colors.primary },
              { val: '100+', label: 'Templates', color: '#00D4FF' },
              { val: '25', label: 'Trending Ads', color: '#00C853' },
              { val: '10', label: 'Feature Hubs', color: '#FF6B35' },
              { val: '6', label: 'Game Types', color: '#7B2FBE' },
              { val: '8', label: 'AI Copy Formats', color: '#FF1744' },
            ].map((stat, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={[styles.statVal, { color: stat.color }]}>{stat.val}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Feature Highlights */}
        <Text style={styles.sectionTitle}>Feature Highlights</Text>
        {PROMO_HIGHLIGHTS.map((item, i) => (
          <View key={i} style={[styles.featureRow, { borderLeftColor: item.color }]}>
            <View style={[styles.featureIcon, { backgroundColor: item.color + '22' }]}>
              <MaterialIcons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.featureLabel, { color: item.color }]}>{item.label}</Text>
              <Text style={styles.featureSub}>{item.sub}</Text>
            </View>
            <MaterialIcons name="check-circle" size={18} color={item.color + '99'} />
          </View>
        ))}

        {/* Platform Coverage */}
        <View style={styles.platformCard}>
          <Text style={styles.platformTitle}>Works Across All Platforms</Text>
          <View style={styles.platformGrid}>
            {PLATFORMS.map((p, i) => (
              <View key={i} style={styles.platformItem}>
                <View style={[styles.platformIcon, { backgroundColor: p.color + '22' }]}>
                  <MaterialIcons name={p.icon as any} size={20} color={p.color} />
                </View>
                <Text style={styles.platformLabel}>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Ad Copy Ready to Use */}
        <View style={styles.copyCard}>
          <View style={styles.copyHeader}>
            <MaterialIcons name="format-quote" size={22} color={Colors.primary} />
            <Text style={styles.copyTitle}>Ready-to-Use Ad Copy</Text>
          </View>
          {[
            {
              format: 'Facebook/Instagram Caption',
              color: '#1877F2',
              text: `Stop wasting time on marketing tools that don't work together.\n\nE-S Marketing Hub gives you 53+ professional tools, AI copy generation, video ad maker, and full analytics — all in ONE free app.\n\n✅ AI Copy Generator\n✅ Video Ad Maker\n✅ 100+ Templates\n✅ Campaign Analytics\n✅ Content Calendar + Reminders\n\nDownload Free 👇\n#MarketingTools #DigitalMarketing #BusinessGrowth`,
            },
            {
              format: 'TikTok / Reels Hook Script',
              color: '#FF0050',
              text: `POV: You found the ONE app that replaces 53 marketing tools 🤯\n\nI'm talking AI copy, video ad maker, medical presentations, game generator... ALL IN ONE.\n\nComment "MARKETING" and I'll send you the link! 🔥\n\n#MarketingHack #MarketingTools #SmallBusinessTips`,
            },
            {
              format: 'LinkedIn Professional Post',
              color: '#0A66C2',
              text: `I've been testing the E-S Marketing Tools Hub and here's my honest take:\n\n→ 53+ marketing tools in one place\n→ AI copy generator with quality scoring\n→ Medical presentation builder with PDF export\n→ Full campaign analytics dashboard\n→ Content calendar with push reminders\n\nFor digital marketers and business owners — this is the tool you've been waiting for.\n\n#Marketing #DigitalMarketing #MarketingStrategy #BusinessTools`,
            },
          ].map((copy, i) => (
            <View key={i} style={[styles.copyBlock, { borderColor: copy.color + '44' }]}>
              <View style={[styles.copyFormatBadge, { backgroundColor: copy.color + '22' }]}>
                <Text style={[styles.copyFormatText, { color: copy.color }]}>{copy.format}</Text>
              </View>
              <Text style={styles.copyText}>{copy.text}</Text>
              <Pressable style={[styles.copyShareBtn, { backgroundColor: copy.color }]}
                onPress={() => Share.share({ message: copy.text, title: 'E-S Marketing Hub Ad Copy' })}>
                <MaterialIcons name="share" size={14} color="#fff" />
                <Text style={styles.copyShareText}>Share This Copy</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Hashtag Sets */}
        <View style={styles.hashtagCard}>
          <Text style={styles.hashtagTitle}>Recommended Hashtag Sets</Text>
          {[
            { platform: 'Instagram', tags: '#MarketingTools #DigitalMarketing #ContentCreator #MarketingStrategy #SocialMediaMarketing #BusinessGrowth #Entrepreneur #MarketingTips #SmallBusiness #OnlineMarketing', color: '#E1306C' },
            { platform: 'TikTok', tags: '#MarketingHack #MarketingTips #BusinessTok #SmallBusinessTips #MarketingTools #DigitalMarketing #Entrepreneur #GrowthHacking', color: '#FF0050' },
            { platform: 'LinkedIn', tags: '#Marketing #DigitalMarketing #MarketingStrategy #BusinessTools #ContentMarketing #GrowthMarketing #B2BMarketing #MarketingAutomation', color: '#0A66C2' },
          ].map((set, i) => (
            <View key={i} style={styles.hashtagSet}>
              <View style={[styles.hashtagPlatform, { backgroundColor: set.color + '22' }]}>
                <Text style={[styles.hashtagPlatformText, { color: set.color }]}>{set.platform}</Text>
              </View>
              <Text style={styles.hashtagText}>{set.tags}</Text>
              <Pressable onPress={() => Share.share({ message: set.tags })} style={styles.hashtagCopy}>
                <MaterialIcons name="content-copy" size={14} color={set.color} />
                <Text style={[styles.hashtagCopyText, { color: set.color }]}>Copy Tags</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Share All Button */}
        <Pressable style={styles.shareAllBtn} onPress={handleSharePromo}>
          <MaterialIcons name="campaign" size={24} color={Colors.background} />
          <Text style={styles.shareAllBtnText}>Share Full App Promo Package</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  shareHeaderBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  scroll: { paddingHorizontal: Spacing.md },
  heroBanner: {
    height: 220, borderRadius: BorderRadius.xl, overflow: 'hidden',
    marginBottom: Spacing.md, position: 'relative',
  },
  heroImg: { width: '100%', height: '100%' },
  heroGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary + '22',
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)', padding: Spacing.md, justifyContent: 'flex-end',
  },
  heroBadgeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  heroBadge: {
    backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  heroBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.extrabold, color: Colors.background, letterSpacing: 1 },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#fff', lineHeight: 30, marginBottom: 4 },
  heroSub: { fontSize: FontSize.sm, color: '#ffffff99', marginBottom: 10 },
  heroCta: {
    alignSelf: 'flex-start', backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: BorderRadius.full,
  },
  heroCtaText: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold, color: Colors.background },
  sectionRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: Spacing.sm, marginTop: 4 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  sectionSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  storyPreview: {
    height: 300, borderRadius: BorderRadius.xl, overflow: 'hidden',
    marginBottom: Spacing.md, alignSelf: 'center', width: 170, position: 'relative',
  },
  storyImg: { width: '100%', height: '100%' },
  storyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', padding: 14,
  },
  storyBadge: {
    alignSelf: 'flex-start', backgroundColor: Colors.primary,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: BorderRadius.full, marginBottom: 8,
  },
  storyBadgeText: { fontSize: 9, fontWeight: '800', color: '#000', letterSpacing: 1 },
  storyTitle: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: '#fff', lineHeight: 22, marginBottom: 4 },
  storySub: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold },
  statsCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '44',
  },
  statsTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statItem: { width: '30%', alignItems: 'center', paddingVertical: 12, backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md },
  statVal: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold },
  statLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1,
    borderColor: Colors.border, borderLeftWidth: 3,
  },
  featureIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  featureLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, marginBottom: 2 },
  featureSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  platformCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  platformTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  platformGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  platformItem: { width: '22%', alignItems: 'center', gap: 6 },
  platformIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  platformLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center' },
  copyCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  copyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  copyTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  copyBlock: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  copyFormatBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full, marginBottom: 10 },
  copyFormatText: { fontSize: FontSize.xs, fontWeight: FontWeight.extrabold },
  copyText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.md },
  copyShareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full,
  },
  copyShareText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: '#fff' },
  hashtagCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  hashtagTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  hashtagSet: { marginBottom: Spacing.md, backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg, padding: Spacing.md },
  hashtagPlatform: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: BorderRadius.full, marginBottom: 8 },
  hashtagPlatformText: { fontSize: FontSize.xs, fontWeight: FontWeight.extrabold },
  hashtagText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  hashtagCopy: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  hashtagCopyText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  shareAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, height: 56, borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  shareAllBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.background },
});
