import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useAlert } from '@/template';

interface Campaign {
  id: string;
  name: string;
  spend: number;
  revenue: number;
  clicks: number;
  impressions: number;
  conversions: number;
  platform: string;
  color: string;
}

const DEFAULT_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Instagram Summer Sale', spend: 500, revenue: 2800, clicks: 1240, impressions: 45000, conversions: 56, platform: 'Instagram', color: '#E1306C' },
  { id: 'c2', name: 'Facebook Product Ad', spend: 350, revenue: 1200, clicks: 890, impressions: 32000, conversions: 24, platform: 'Facebook', color: '#1877F2' },
  { id: 'c3', name: 'Google Search Campaign', spend: 800, revenue: 4500, clicks: 2100, impressions: 18000, conversions: 90, platform: 'Google', color: '#4285F4' },
  { id: 'c4', name: 'TikTok Viral Push', spend: 250, revenue: 980, clicks: 3400, impressions: 120000, conversions: 19, platform: 'TikTok', color: '#FF0050' },
];

export default function ROIScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [campaigns, setCampaigns] = useState<Campaign[]>(DEFAULT_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'campaigns'>('dashboard');

  // Calculator state
  const [calcSpend, setCalcSpend] = useState('');
  const [calcRevenue, setCalcRevenue] = useState('');
  const [calcImpressions, setCalcImpressions] = useState('');
  const [calcClicks, setCalcClicks] = useState('');
  const [calcConversions, setCalcConversions] = useState('');

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  const overallROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend * 100) : 0;
  const overallROAS = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
  const avgCPA = totalConversions > 0 ? (totalSpend / totalConversions) : 0;
  const avgCPC = totalClicks > 0 ? (totalSpend / totalClicks) : 0;

  const calcROI = () => {
    const spend = parseFloat(calcSpend) || 0;
    const revenue = parseFloat(calcRevenue) || 0;
    const impr = parseFloat(calcImpressions) || 0;
    const clicks = parseFloat(calcClicks) || 0;
    const conv = parseFloat(calcConversions) || 0;
    if (spend === 0) { showAlert('Enter Spend', 'Please enter your ad spend amount.'); return; }
    const roi = ((revenue - spend) / spend * 100).toFixed(1);
    const roas = (revenue / spend).toFixed(2);
    const ctr = impr > 0 ? (clicks / impr * 100).toFixed(2) : 'N/A';
    const cpa = conv > 0 ? (spend / conv).toFixed(2) : 'N/A';
    const cpc = clicks > 0 ? (spend / clicks).toFixed(2) : 'N/A';
    showAlert('ROI Analysis Results', `ROI: ${roi}%\nROAS: ${roas}x\nCTR: ${ctr}%\nCPA: $${cpa}\nCPC: $${cpc}\n\n${parseFloat(roi) >= 100 ? 'Great ROI!' : parseFloat(roi) >= 0 ? 'Profitable campaign.' : 'Campaign is losing money - optimize urgently.'}`);
  };

  const getBadgeColor = (roi: number) => {
    if (roi >= 200) return Colors.success;
    if (roi >= 100) return Colors.primary;
    if (roi >= 0) return Colors.accent1;
    return Colors.error;
  };

  const getCampaignROI = (c: Campaign) => c.spend > 0 ? ((c.revenue - c.spend) / c.spend * 100) : 0;
  const getCampaignROAS = (c: Campaign) => c.spend > 0 ? (c.revenue / c.spend) : 0;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'campaigns', label: 'Campaigns', icon: 'campaign' },
    { id: 'calculator', label: 'Calculator', icon: 'calculate' },
  ] as const;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>ROI Analytics</Text>
          <Text style={styles.headerSub}>Campaign performance dashboard</Text>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <Pressable key={tab.id} style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}>
            <MaterialIcons name={tab.icon as any} size={16} color={activeTab === tab.id ? Colors.background : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <View>
            {/* Overall ROI Hero */}
            <View style={styles.roiHero}>
              <Text style={styles.roiLabel}>Overall ROI</Text>
              <Text style={[styles.roiValue, { color: getBadgeColor(overallROI) }]}>
                {overallROI >= 0 ? '+' : ''}{overallROI.toFixed(1)}%
              </Text>
              <Text style={styles.roiSub}>Across {campaigns.length} active campaigns</Text>
            </View>

            {/* KPI Grid */}
            <View style={styles.kpiGrid}>
              {[
                { label: 'Total Spend', value: `$${totalSpend.toLocaleString()}`, icon: 'payments', color: Colors.accent1 },
                { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: 'trending-up', color: Colors.success },
                { label: 'ROAS', value: `${overallROAS.toFixed(1)}x`, icon: 'show-chart', color: Colors.primary },
                { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: 'touch-app', color: Colors.accent2 },
                { label: 'Impressions', value: `${(totalImpressions / 1000).toFixed(0)}K`, icon: 'visibility', color: Colors.accent3 },
                { label: 'Conversions', value: totalConversions.toString(), icon: 'check-circle', color: Colors.success },
                { label: 'Avg CPA', value: `$${avgCPA.toFixed(2)}`, icon: 'person-add', color: Colors.accent1 },
                { label: 'Avg CTR', value: `${avgCTR.toFixed(2)}%`, icon: 'ads-click', color: Colors.accent2 },
              ].map((kpi, i) => (
                <View key={i} style={styles.kpiCard}>
                  <View style={[styles.kpiIcon, { backgroundColor: kpi.color + '22' }]}>
                    <MaterialIcons name={kpi.icon as any} size={20} color={kpi.color} />
                  </View>
                  <Text style={styles.kpiValue}>{kpi.value}</Text>
                  <Text style={styles.kpiLabel}>{kpi.label}</Text>
                </View>
              ))}
            </View>

            {/* Profit Bar */}
            <View style={styles.profitBar}>
              <View style={styles.profitBarHeader}>
                <Text style={styles.profitBarLabel}>Spend vs Revenue</Text>
                <Text style={styles.profitAmount}>Profit: ${(totalRevenue - totalSpend).toLocaleString()}</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.spendBar, { flex: totalSpend }]} />
                <View style={[styles.profitFill, { flex: Math.max(0, totalRevenue - totalSpend) }]} />
              </View>
              <View style={styles.barLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.accent1 }]} />
                  <Text style={styles.legendText}>Spend ${totalSpend.toLocaleString()}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
                  <Text style={styles.legendText}>Profit ${(totalRevenue - totalSpend).toLocaleString()}</Text>
                </View>
              </View>
            </View>

            {/* Top Performer */}
            <Text style={styles.sectionTitle}>Top Performing Campaign</Text>
            {(() => {
              const top = [...campaigns].sort((a, b) => getCampaignROI(b) - getCampaignROI(a))[0];
              return top ? (
                <View style={[styles.topCard, { borderColor: top.color }]}>
                  <View style={[styles.topIcon, { backgroundColor: top.color + '22' }]}>
                    <MaterialIcons name="emoji-events" size={28} color={top.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.topName}>{top.name}</Text>
                    <Text style={[styles.topPlatform, { color: top.color }]}>{top.platform}</Text>
                    <Text style={styles.topROI}>ROI: {getCampaignROI(top).toFixed(1)}% · ROAS: {getCampaignROAS(top).toFixed(2)}x</Text>
                  </View>
                </View>
              ) : null;
            })()}
          </View>
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <View>
            <Text style={styles.sectionTitle}>All Campaigns</Text>
            {campaigns.map(campaign => {
              const roi = getCampaignROI(campaign);
              const roas = getCampaignROAS(campaign);
              return (
                <View key={campaign.id} style={[styles.campaignCard, { borderLeftColor: campaign.color }]}>
                  <View style={styles.campaignHeader}>
                    <View style={[styles.campaignIcon, { backgroundColor: campaign.color + '22' }]}>
                      <MaterialIcons name="campaign" size={20} color={campaign.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.campaignName}>{campaign.name}</Text>
                      <Text style={[styles.campaignPlatform, { color: campaign.color }]}>{campaign.platform}</Text>
                    </View>
                    <View style={[styles.roiBadge, { backgroundColor: getBadgeColor(roi) + '22' }]}>
                      <Text style={[styles.roiBadgeText, { color: getBadgeColor(roi) }]}>
                        {roi >= 0 ? '+' : ''}{roi.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.campaignStats}>
                    {[
                      { label: 'Spend', value: `$${campaign.spend}` },
                      { label: 'Revenue', value: `$${campaign.revenue}` },
                      { label: 'ROAS', value: `${roas.toFixed(1)}x` },
                      { label: 'Conversions', value: campaign.conversions.toString() },
                    ].map((stat, i) => (
                      <View key={i} style={styles.campaignStat}>
                        <Text style={styles.campaignStatValue}>{stat.value}</Text>
                        <Text style={styles.campaignStatLabel}>{stat.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <View>
            <View style={styles.calcCard}>
              <Text style={styles.calcTitle}>ROI Calculator</Text>
              <Text style={styles.calcSub}>Enter your campaign data to calculate performance metrics</Text>

              {[
                { label: 'Ad Spend ($) *', key: 'spend', setter: setCalcSpend, val: calcSpend, placeholder: 'e.g. 500' },
                { label: 'Revenue Generated ($)', key: 'revenue', setter: setCalcRevenue, val: calcRevenue, placeholder: 'e.g. 2500' },
                { label: 'Total Impressions', key: 'impressions', setter: setCalcImpressions, val: calcImpressions, placeholder: 'e.g. 50000' },
                { label: 'Total Clicks', key: 'clicks', setter: setCalcClicks, val: calcClicks, placeholder: 'e.g. 1200' },
                { label: 'Conversions / Sales', key: 'conversions', setter: setCalcConversions, val: calcConversions, placeholder: 'e.g. 45' },
              ].map((field) => (
                <View key={field.key}>
                  <Text style={styles.calcLabel}>{field.label}</Text>
                  <TextInput style={styles.calcField} value={field.val} onChangeText={field.setter}
                    placeholder={field.placeholder} placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric" />
                </View>
              ))}

              <Pressable style={({ pressed }) => [styles.calcBtn, pressed && { opacity: 0.9 }]} onPress={calcROI}>
                <MaterialIcons name="calculate" size={22} color={Colors.background} />
                <Text style={styles.calcBtnText}>Calculate ROI</Text>
              </Pressable>

              {/* Quick Reference */}
              <View style={styles.refSection}>
                <Text style={styles.refTitle}>Quick Reference</Text>
                {[
                  { metric: 'ROI', formula: '(Revenue - Spend) / Spend × 100', benchmark: '> 100% is good' },
                  { metric: 'ROAS', formula: 'Revenue / Ad Spend', benchmark: '> 3x is profitable' },
                  { metric: 'CTR', formula: 'Clicks / Impressions × 100', benchmark: '2-5% is average' },
                  { metric: 'CPA', formula: 'Spend / Conversions', benchmark: 'Lower is better' },
                ].map((ref, i) => (
                  <View key={i} style={styles.refCard}>
                    <Text style={styles.refMetric}>{ref.metric}</Text>
                    <Text style={styles.refFormula}>{ref.formula}</Text>
                    <Text style={styles.refBenchmark}>{ref.benchmark}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

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
  tabBar: {
    flexDirection: 'row', marginHorizontal: Spacing.md, marginBottom: Spacing.md,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg, padding: 4,
  },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: BorderRadius.md },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  tabTextActive: { color: Colors.background, fontWeight: FontWeight.bold },
  scroll: { paddingHorizontal: Spacing.md },
  roiHero: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  roiLabel: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.semibold, letterSpacing: 1.5, textTransform: 'uppercase' },
  roiValue: { fontSize: 52, fontWeight: FontWeight.extrabold, marginVertical: 4 },
  roiSub: { fontSize: FontSize.sm, color: Colors.textSecondary },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.md },
  kpiCard: {
    width: '22%', flexGrow: 1, backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  kpiIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  kpiValue: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Colors.text },
  kpiLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
  profitBar: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  profitBarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  profitBarLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  profitAmount: { fontSize: FontSize.sm, color: Colors.success, fontWeight: FontWeight.bold },
  barContainer: { flexDirection: 'row', height: 20, borderRadius: 10, overflow: 'hidden', marginBottom: 8 },
  spendBar: { backgroundColor: Colors.accent1 },
  profitFill: { backgroundColor: Colors.success },
  barLegend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
  topCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, borderWidth: 2, marginBottom: Spacing.md,
  },
  topIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  topName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  topPlatform: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginTop: 2 },
  topROI: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  campaignCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1,
    borderColor: Colors.border, borderLeftWidth: 3,
  },
  campaignHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  campaignIcon: { width: 40, height: 40, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  campaignName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  campaignPlatform: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  roiBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  roiBadgeText: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold },
  campaignStats: { flexDirection: 'row', justifyContent: 'space-around' },
  campaignStat: { alignItems: 'center' },
  campaignStatValue: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Colors.text },
  campaignStatLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  calcCard: { backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  calcTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text, marginBottom: 4 },
  calcSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.md, lineHeight: 18 },
  calcLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: 6, marginTop: 12 },
  calcField: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, height: 48, fontSize: FontSize.md,
    color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  calcBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg, marginTop: Spacing.lg,
  },
  calcBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  refSection: { marginTop: Spacing.lg },
  refTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
  refCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    padding: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  refMetric: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
  refFormula: { fontSize: FontSize.sm, color: Colors.textSecondary, fontFamily: 'monospace', marginTop: 2 },
  refBenchmark: { fontSize: FontSize.xs, color: Colors.success, marginTop: 4, fontWeight: FontWeight.semibold },
});
