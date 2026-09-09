import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { TRENDING_ADS, TRENDING_AD_CATEGORIES, TrendingAd } from '@/constants/trendingAds';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { useAlert } from '@/template';

const PLATFORM_COLORS: Record<string, string> = {
  'Instagram / TikTok': '#E1306C',
  'TikTok / YouTube': '#FF0050',
  'Facebook / Instagram': '#1877F2',
  'Facebook / Google': '#4285F4',
  'All Platforms': '#FFD700',
  'Google Search': '#4285F4',
  'LinkedIn / Facebook': '#0A66C2',
  'LinkedIn / YouTube': '#0A66C2',
  'YouTube / Facebook': '#FF0000',
  'Instagram / Email': '#E1306C',
  'TikTok / Instagram': '#FF0050',
  'Meta / Google / TikTok': '#FF6B35',
  'Facebook / YouTube': '#1877F2',
  'Google / Facebook': '#4285F4',
  'TikTok': '#FF0050',
  'Email': '#FF6B35',
};

function TrendBar({ score }: { score: number }) {
  const color = score >= 95 ? '#00C853' : score >= 90 ? Colors.primary : '#FF6B35';
  return (
    <View style={styles.trendBarWrap}>
      <View style={styles.trendBarBg}>
        <View style={[styles.trendBarFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.trendScore, { color }]}>{score}</Text>
    </View>
  );
}

function AdCard({ ad, onPress }: { ad: TrendingAd; onPress: () => void }) {
  const platformColor = PLATFORM_COLORS[ad.platform] || Colors.primary;
  return (
    <Pressable style={({ pressed }) => [styles.adCard, { borderLeftColor: ad.color }, pressed && { opacity: 0.9 }]}
      onPress={onPress}>
      <View style={styles.adCardHeader}>
        <View style={[styles.adIcon, { backgroundColor: ad.color + '22' }]}>
          <MaterialIcons name={ad.icon as any} size={24} color={ad.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.adTitle}>{ad.title}</Text>
          <Text style={[styles.adCategory, { color: ad.color }]}>{ad.category}</Text>
        </View>
        <View style={styles.trendBadge}>
          <MaterialIcons name="trending-up" size={12} color={ad.trendScore >= 93 ? Colors.success : Colors.primary} />
          <Text style={[styles.trendBadgeText, { color: ad.trendScore >= 93 ? Colors.success : Colors.primary }]}>
            {ad.trendScore >= 95 ? 'HOT' : ad.trendScore >= 90 ? 'RISING' : 'TRENDING'}
          </Text>
        </View>
      </View>

      <Text style={styles.adDesc} numberOfLines={2}>{ad.description}</Text>

      <TrendBar score={ad.trendScore} />

      <View style={styles.adMeta}>
        <View style={[styles.platformPill, { backgroundColor: platformColor + '22' }]}>
          <MaterialIcons name="devices" size={11} color={platformColor} />
          <Text style={[styles.platformText, { color: platformColor }]}>{ad.platform}</Text>
        </View>
        <View style={styles.formatPill}>
          <MaterialIcons name="video-library" size={11} color={Colors.textMuted} />
          <Text style={styles.formatText}>{ad.format}</Text>
        </View>
      </View>

      <View style={styles.industriesList}>
        {ad.industries.slice(0, 3).map((ind, i) => (
          <View key={i} style={styles.industryTag}>
            <Text style={styles.industryText}>{ind}</Text>
          </View>
        ))}
        {ad.industries.length > 3 && (
          <Text style={styles.moreIndustries}>+{ad.industries.length - 3}</Text>
        )}
      </View>
    </Pressable>
  );
}

function AdDetailSheet({ ad, onClose }: { ad: TrendingAd; onClose: () => void }) {
  const platformColor = PLATFORM_COLORS[ad.platform] || Colors.primary;
  return (
    <View style={styles.detailSheet}>
      <View style={styles.detailHandle} />

      <View style={styles.detailHeader}>
        <View style={[styles.detailIcon, { backgroundColor: ad.color + '22' }]}>
          <MaterialIcons name={ad.icon as any} size={32} color={ad.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.detailTitle}>{ad.title}</Text>
          <Text style={[styles.detailCat, { color: ad.color }]}>{ad.category} · {ad.format}</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={16}>
          <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.detailScroll}>
        {/* Trend Score */}
        <View style={styles.detailScoreRow}>
          <Text style={styles.detailLabel}>Trend Score</Text>
          <TrendBar score={ad.trendScore} />
        </View>

        {/* Platform */}
        <View style={[styles.infoBlock, { borderColor: platformColor + '44' }]}>
          <View style={styles.infoBlockHeader}>
            <MaterialIcons name="devices" size={16} color={platformColor} />
            <Text style={[styles.infoBlockTitle, { color: platformColor }]}>Platform</Text>
          </View>
          <Text style={styles.infoBlockText}>{ad.platform}</Text>
        </View>

        {/* Hook */}
        <View style={[styles.infoBlock, { borderColor: Colors.primary + '44' }]}>
          <View style={styles.infoBlockHeader}>
            <MaterialIcons name="record-voice-over" size={16} color={Colors.primary} />
            <Text style={[styles.infoBlockTitle, { color: Colors.primary }]}>Opening Hook</Text>
          </View>
          <Text style={[styles.infoBlockText, { fontStyle: 'italic', color: Colors.text }]}>"{ad.hook}"</Text>
        </View>

        {/* CTA */}
        <View style={[styles.infoBlock, { borderColor: Colors.accent2 + '44' }]}>
          <View style={styles.infoBlockHeader}>
            <MaterialIcons name="ads-click" size={16} color={Colors.accent2} />
            <Text style={[styles.infoBlockTitle, { color: Colors.accent2 }]}>Call to Action</Text>
          </View>
          <Text style={[styles.infoBlockText, { color: Colors.text }]}>{ad.cta}</Text>
        </View>

        {/* Description */}
        <View style={styles.descSection}>
          <Text style={styles.descLabel}>What It Is</Text>
          <Text style={styles.descText}>{ad.description}</Text>
        </View>

        {/* Why It Works */}
        <View style={[styles.whyBox, { borderColor: Colors.success + '44', backgroundColor: Colors.success + '0A' }]}>
          <View style={styles.whyHeader}>
            <MaterialIcons name="lightbulb" size={16} color={Colors.success} />
            <Text style={[styles.whyTitle, { color: Colors.success }]}>Why It Works</Text>
          </View>
          <Text style={styles.whyText}>{ad.whyItWorks}</Text>
        </View>

        {/* Industries */}
        <Text style={styles.descLabel}>Best Industries</Text>
        <View style={styles.industriesGrid}>
          {ad.industries.map((ind, i) => (
            <View key={i} style={[styles.industryBig, { borderColor: ad.color + '44' }]}>
              <Text style={[styles.industryBigText, { color: ad.color }]}>{ind}</Text>
            </View>
          ))}
        </View>

        {/* Pro Tips */}
        <Text style={styles.descLabel}>Pro Tips</Text>
        {ad.tips.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <View style={[styles.tipDot, { backgroundColor: ad.color }]} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

export default function TrendingAdsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedAd, setSelectedAd] = useState<TrendingAd | null>(null);
  const [sortBy, setSortBy] = useState<'trend' | 'category'>('trend');

  const filtered = TRENDING_ADS
    .filter(ad => selectedCat === 'All' || ad.category === selectedCat)
    .sort((a, b) => sortBy === 'trend' ? b.trendScore - a.trendScore : a.category.localeCompare(b.category));

  const CAT_COLORS: Record<string, string> = {
    'Social Proof': '#00C853', 'E-Commerce': '#FF1744', 'Direct Response': '#7B2FBE',
    'Brand Awareness': '#FFD700', 'B2B / Trust': '#0A66C2', 'Retargeting': '#FF6B35',
    'Lead Generation': '#00D4FF', 'Mobile Apps': '#FF0050', 'Local Business': '#00C853',
    'Email Marketing': '#FF6B35', 'Viral Content': '#FF0050', 'Medical': '#00C853',
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Trending Ad Templates</Text>
          <Text style={styles.headerSub}>{TRENDING_ADS.length} top-performing ad formats</Text>
        </View>
        <Pressable
          style={[styles.sortBtn, { backgroundColor: sortBy === 'trend' ? Colors.primary : Colors.surfaceElevated }]}
          onPress={() => setSortBy(s => s === 'trend' ? 'category' : 'trend')}>
          <MaterialIcons name={sortBy === 'trend' ? 'trending-up' : 'sort'} size={16}
            color={sortBy === 'trend' ? Colors.background : Colors.textSecondary} />
        </Pressable>
      </View>

      {/* Category Filter */}
      <View style={styles.catWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
          {TRENDING_AD_CATEGORIES.map(cat => (
            <CategoryChip key={cat} label={cat} isSelected={selectedCat === cat}
              onPress={() => setSelectedCat(cat)} color={CAT_COLORS[cat] || Colors.primary} />
          ))}
        </ScrollView>
      </View>

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <MaterialIcons name="trending-up" size={16} color={Colors.success} />
          <Text style={styles.statValue}>{filtered.filter(a => a.trendScore >= 95).length}</Text>
          <Text style={styles.statLabel}>Hot</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialIcons name="star" size={16} color={Colors.primary} />
          <Text style={styles.statValue}>{filtered.filter(a => a.trendScore >= 90 && a.trendScore < 95).length}</Text>
          <Text style={styles.statLabel}>Rising</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialIcons name="show-chart" size={16} color={Colors.accent1} />
          <Text style={styles.statValue}>{filtered.filter(a => a.trendScore < 90).length}</Text>
          <Text style={styles.statLabel}>Trending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{filtered.length}</Text>
          <Text style={styles.statLabel}>Showing</Text>
        </View>
      </View>

      {/* Ad List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.map(ad => (
          <AdCard key={ad.id} ad={ad} onPress={() => setSelectedAd(ad)} />
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Detail Sheet */}
      {selectedAd && (
        <View style={styles.overlay}>
          <Pressable style={styles.overlayBg} onPress={() => setSelectedAd(null)} />
          <AdDetailSheet ad={selectedAd} onClose={() => setSelectedAd(null)} />
        </View>
      )}
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
  sortBtn: {
    width: 40, height: 40, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  catWrap: { height: 52 },
  catContent: { paddingHorizontal: Spacing.md, alignItems: 'center' },
  statsBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.md, marginVertical: Spacing.sm,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    paddingVertical: 12, borderWidth: 1, borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  scroll: { paddingHorizontal: Spacing.md },
  adCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1,
    borderColor: Colors.border, borderLeftWidth: 3,
  },
  adCardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  adIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  adTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 2 },
  adCategory: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  trendBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.surfaceElevated, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
  },
  trendBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.extrabold },
  adDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  trendBarWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  trendBarBg: { flex: 1, height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3, overflow: 'hidden' },
  trendBarFill: { height: 6, borderRadius: 3 },
  trendScore: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold, width: 28, textAlign: 'right' },
  adMeta: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  platformPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  platformText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  formatPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceElevated, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
  },
  formatText: { fontSize: FontSize.xs, color: Colors.textMuted },
  industriesList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  industryTag: {
    backgroundColor: Colors.surfaceElevated, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border,
  },
  industryText: { fontSize: FontSize.xs, color: Colors.textMuted },
  moreIndustries: { fontSize: FontSize.xs, color: Colors.textMuted, alignSelf: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  overlayBg: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  detailSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '85%', padding: Spacing.md,
  },
  detailHandle: {
    width: 40, height: 4, backgroundColor: Colors.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: 16,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: Spacing.md },
  detailIcon: { width: 56, height: 56, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  detailTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 4 },
  detailCat: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  detailScroll: { flex: 1 },
  detailScoreRow: { marginBottom: Spacing.md },
  detailLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: 6 },
  infoBlock: {
    borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm,
  },
  infoBlockHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoBlockTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  infoBlockText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  descSection: { marginBottom: Spacing.md },
  descLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 8, marginTop: 4 },
  descText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  whyBox: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  whyHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  whyTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  whyText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  industriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
  industryBig: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full,
    borderWidth: 1, backgroundColor: Colors.surfaceElevated,
  },
  industryBigText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  tipDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  tipText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});
