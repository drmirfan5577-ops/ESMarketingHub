import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  Image, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { MARKETING_TOOLS, TEMPLATES, LOCAL_TRICKS } from '@/constants/marketingData';
import { StatCard } from '@/components/ui/StatCard';
import { ToolCard } from '@/components/ui/ToolCard';
import { TemplateCard } from '@/components/ui/TemplateCard';
import { ToolDetailModal } from '@/components/feature/ToolDetailModal';
import { MarketingTool } from '@/constants/marketingData';
import { PROMPT_TEMPLATES } from '@/constants/promptsData';
import { useAdmin } from '@/hooks/useAdmin';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { features, customContent } = useAdmin();
  const [selectedTool, setSelectedTool] = useState<MarketingTool | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const featuredTools = MARKETING_TOOLS.slice(0, 4);
  const featuredTemplates = TEMPLATES.slice(0, 8);
  const activeAnnouncement = customContent.announcements.find(a => a.active);

  const ALL_FEATURE_HUBS = [
    { id: 'prompts', label: 'AI Prompts', icon: 'auto-fix-high', color: Colors.primary, route: '/prompts', count: `${PROMPT_TEMPLATES.length}+ prompts` },
    { id: 'medical', label: 'Medical Builder', icon: 'local-hospital', color: Colors.accent4, route: '/medical', count: 'Presentation builder' },
    { id: 'videoad', label: 'Video Ad Maker', icon: 'videocam', color: Colors.accent5, route: '/videoad', count: '6 styles + export' },
    { id: 'calendar', label: 'Content Calendar', icon: 'event', color: Colors.accent2, route: '/calendar', count: 'Plan & schedule' },
    { id: 'roi', label: 'ROI Analytics', icon: 'bar-chart', color: Colors.accent1, route: '/roi', count: 'Track campaigns' },
    { id: 'game', label: 'Game Generator', icon: 'sports-esports', color: Colors.accent3, route: '/game', count: '6 games + leaderboard' },
    { id: 'ai-copy', label: 'AI Copy Writer', icon: 'auto-awesome', color: Colors.primary, route: '/ai-copy', count: '8 copy formats' },
    { id: 'template-editor', label: 'Template Editor', icon: 'edit', color: Colors.accent2, route: '/template-editor', count: '12 editable templates' },
    { id: 'trending-ads', label: 'Trending Ads', icon: 'trending-up', color: Colors.accent1, route: '/trending-ads', count: '25 top ad formats' },
    { id: 'analytics-charts', label: 'Analytics Charts', icon: 'insert-chart', color: Colors.accent3, route: '/analytics-charts', count: 'Visual dashboards' },
    { id: 'promo', label: 'App Promo Kit', icon: 'campaign', color: '#FF6B35', route: '/promo', count: 'Ready-to-run ads' },
  ];

  const FEATURE_HUBS = ALL_FEATURE_HUBS.filter(h => {
    const feat = features.find(f => f.id === h.id);
    return !feat || feat.enabled;
  });

  const openTool = (tool: MarketingTool) => {
    setSelectedTool(tool);
    setModalVisible(true);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>E-S Marketing</Text>
            <Text style={styles.title}>Tools Hub</Text>
          </View>
          <Pressable style={styles.notifBtn} onPress={() => router.push('/settings' as any)}>
            <MaterialIcons name="settings" size={22} color={Colors.primary} />
          </Pressable>
          <Pressable style={[styles.notifBtn, { marginLeft: 6 }]} onPress={() => router.push('/admin' as any)}>
            <MaterialIcons name="admin-panel-settings" size={22} color={Colors.textMuted} />
          </Pressable>
        </View>

        {/* Announcement Banner */}
        {activeAnnouncement ? (
          <View style={[styles.announcementBanner, { borderColor: activeAnnouncement.color + '44', backgroundColor: activeAnnouncement.color + '11' }]}>
            <MaterialIcons name="campaign" size={16} color={activeAnnouncement.color} />
            <Text style={[styles.announcementText, { color: activeAnnouncement.color }]} numberOfLines={2}>
              {activeAnnouncement.text}
            </Text>
          </View>
        ) : null}

        {/* Hero Banner */}
        <Pressable style={styles.heroBanner}>
          <Image
            source={require('@/assets/images/hero-banner.png')}
            style={styles.heroImg}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>ALL-IN-ONE</Text>
            </View>
            <Text style={styles.heroTitle}>Complete Marketing{'\n'}Powerhouse</Text>
            <Text style={styles.heroSub}>53 Tools · 30 Templates · 25 Trending Ads</Text>
          </View>
        </Pressable>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard value="53+" label="Marketing Tools" icon="build" color={Colors.primary} />
          <StatCard value="25+" label="Trending Ads" icon="trending-up" color={Colors.accent2} />
          <StatCard value="10" label="Feature Hubs" icon="hub" color={Colors.accent3} />
        </View>

        {/* Feature Hubs */}
        <Text style={styles.sectionTitle}>Feature Hubs</Text>
        <View style={styles.hubGrid}>
          {FEATURE_HUBS.map((hub, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.hubCard, { borderColor: hub.color + '44' }, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
              onPress={() => router.push(hub.route as any)}
            >
              <View style={[styles.hubIcon, { backgroundColor: hub.color + '22' }]}>
                <MaterialIcons name={hub.icon as any} size={28} color={hub.color} />
              </View>
              <Text style={[styles.hubLabel, { color: hub.color }]}>{hub.label}</Text>
              <Text style={styles.hubCount}>{hub.count}</Text>
              <MaterialIcons name="arrow-forward" size={14} color={hub.color} style={{ alignSelf: 'flex-end', marginTop: 4 }} />
            </Pressable>
          ))}
        </View>

        {/* Quick Launch Grid */}
        <Text style={styles.sectionTitle}>Quick Launch</Text>
        <View style={styles.quickGrid}>
          {[
            { label: 'SEO Tools', icon: 'search', color: Colors.accent2 },
            { label: 'Ad Creator', icon: 'movie', color: Colors.accent1 },
            { label: 'Templates', icon: 'layers', color: Colors.primary },
            { label: 'Social', icon: 'people', color: Colors.accent3 },
            { label: 'Analytics', icon: 'bar-chart', color: Colors.accent4 },
            { label: 'Medical', icon: 'local-hospital', color: Colors.accent4 },
            { label: 'Local', icon: 'location-on', color: Colors.accent3 },
            { label: 'Email', icon: 'email', color: Colors.accent1 },
          ].map((item, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.quickItem, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]}
            >
              <View style={[styles.quickIcon, { backgroundColor: item.color + '22' }]}>
                <MaterialIcons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Featured Tools */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Featured Tools</Text>
          <Pressable style={styles.seeAll}>
            <Text style={styles.seeAllText}>See all 53</Text>
            <MaterialIcons name="chevron-right" size={16} color={Colors.primary} />
          </Pressable>
        </View>
        {featuredTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} onPress={() => openTool(tool)} />
        ))}

        {/* Featured Templates */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Hot Templates</Text>
          <Pressable style={styles.seeAll}>
            <Text style={styles.seeAllText}>See all 30</Text>
            <MaterialIcons name="chevron-right" size={16} color={Colors.primary} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll} contentContainerStyle={{ paddingLeft: Spacing.md }}>
          {featuredTemplates.map(t => (
            <TemplateCard key={t.id} template={t} onPress={() => {}} />
          ))}
        </ScrollView>

        {/* Local Tricks */}
        <Text style={styles.sectionTitle}>Local Marketing Tricks</Text>
        {LOCAL_TRICKS.slice(0, 4).map((trick, i) => (
          <View key={i} style={styles.trickCard}>
            <View style={styles.trickIconWrap}>
              <MaterialIcons name={trick.icon as any} size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.trickTitle}>{trick.title}</Text>
              <Text style={styles.trickTip}>{trick.tip}</Text>
            </View>
          </View>
        ))}

        {/* Bottom Spacer */}
        <View style={{ height: 32 }} />
      </ScrollView>

      <ToolDetailModal
        tool={selectedTool}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  greeting: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
  },
  notifBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  announcementBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: BorderRadius.lg, padding: 10,
    marginBottom: Spacing.sm, borderWidth: 1,
  },
  announcementText: {
    flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, lineHeight: 18,
  },
  heroBanner: {
    height: 180,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: Spacing.md,
    justifyContent: 'flex-end',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: 8,
  },
  heroBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    color: Colors.background,
    letterSpacing: 1,
  },
  hubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  hubCard: {
    width: '47%',
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
  },
  hubIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  hubLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: 2,
  },
  hubCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
    lineHeight: 28,
  },
  heroSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    marginHorizontal: -4,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: 4,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: 4,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: Spacing.lg,
  },
  quickItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: 6,
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
  templatesScroll: {
    marginHorizontal: -Spacing.md,
    marginBottom: Spacing.lg,
  },
  trickCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  trickIconWrap: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary + '22',
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trickTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  trickTip: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
