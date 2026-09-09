import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  Dimensions, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;

// --- Custom Bar Chart ---
function BarChart({ data, labels, color, maxVal }: {
  data: number[]; labels: string[]; color: string; maxVal?: number;
}) {
  const max = maxVal || Math.max(...data, 1);
  const chartH = 120;
  const animVals = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(60, animVals.map((v, i) =>
      Animated.timing(v, { toValue: data[i], duration: 600, useNativeDriver: false })
    )).start();
  }, [JSON.stringify(data)]);

  return (
    <View style={{ width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: chartH, gap: 4 }}>
        {data.map((val, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: chartH }}>
            <Animated.View style={{
              width: '70%',
              height: animVals[i].interpolate({ inputRange: [0, max], outputRange: [2, chartH - 16] }),
              backgroundColor: color,
              borderRadius: 3,
              opacity: 0.85,
            }} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
        {labels.map((label, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: Colors.textMuted }} numberOfLines={1}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

// --- Custom Line Chart ---
function LineChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const max = Math.max(...data, 1);
  const chartH = 100;
  const barW = (CHART_WIDTH - 40) / data.length;
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, { toValue: 1, duration: 800, useNativeDriver: false }).start();
  }, [JSON.stringify(data)]);

  const points = data.map((val, i) => ({
    x: i * barW + barW / 2,
    y: chartH - (val / max) * (chartH - 10) - 5,
  }));

  return (
    <View style={{ paddingHorizontal: Spacing.sm }}>
      <View style={{ height: chartH, position: 'relative' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <View key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: chartH - pct * (chartH - 10) - 5,
            height: 1, backgroundColor: Colors.border,
          }} />
        ))}
        {/* Data points & line */}
        {points.map((pt, i) => (
          <View key={i}>
            <View style={{
              position: 'absolute', left: pt.x - 4, top: pt.y - 4,
              width: 8, height: 8, borderRadius: 4, backgroundColor: color,
              borderWidth: 2, borderColor: Colors.background,
            }} />
          </View>
        ))}
        {/* Line segments */}
        {points.slice(1).map((pt, i) => {
          const prev = points[i];
          const dx = pt.x - prev.x;
          const dy = pt.y - prev.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          return (
            <View key={i} style={{
              position: 'absolute',
              left: prev.x, top: prev.y,
              width: length, height: 2,
              backgroundColor: color, opacity: 0.7,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: '0 50%',
            }} />
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {labels.map((label, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: Colors.textMuted }} numberOfLines={1}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

// --- Donut / Ring Chart ---
function RingChart({ percentage, color, label }: { percentage: number; color: string; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.ringWrap}>
        <View style={[styles.ringOuter, { borderColor: color + '33' }]}>
          <View style={[styles.ringInner, { borderColor: color }]} />
        </View>
        <View style={styles.ringCenter}>
          <Text style={[styles.ringValue, { color }]}>{percentage}%</Text>
        </View>
      </View>
      <Text style={styles.ringLabel}>{label}</Text>
    </View>
  );
}

const PLATFORM_DATA = {
  labels: ['Instagram', 'Facebook', 'Google', 'TikTok', 'LinkedIn', 'Email', 'YouTube'],
  spend: [480, 320, 750, 210, 180, 90, 120],
  revenue: [2400, 980, 4200, 890, 720, 320, 510],
  ctr: [3.2, 1.8, 4.1, 5.6, 1.2, 22.4, 2.9],
  colors: ['#E1306C', '#1877F2', '#4285F4', '#FF0050', '#0A66C2', '#FF6B35', '#FF0000'],
};

const MONTHLY_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  revenue: [3200, 4100, 3800, 5200, 6100, 5800, 7400],
  spend: [800, 950, 900, 1100, 1300, 1200, 1500],
  conversions: [64, 82, 76, 104, 122, 116, 148],
};

const CHANNEL_SPLIT = [
  { label: 'Paid Social', pct: 38, color: '#E1306C' },
  { label: 'Search', pct: 29, color: '#4285F4' },
  { label: 'Email', pct: 18, color: '#FF6B35' },
  { label: 'Organic', pct: 15, color: '#00C853' },
];

export default function AnalyticsChartsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeMonth, setActiveMonth] = useState(6);
  const [activePlatform, setActivePlatform] = useState(0);
  const [metricTab, setMetricTab] = useState<'revenue' | 'spend' | 'ctr'>('revenue');

  const totalRevenue = MONTHLY_DATA.revenue.reduce((a, b) => a + b, 0);
  const totalSpend = MONTHLY_DATA.spend.reduce((a, b) => a + b, 0);
  const overallROI = ((totalRevenue - totalSpend) / totalSpend * 100).toFixed(1);
  const overallROAS = (totalRevenue / totalSpend).toFixed(2);

  const metricData = metricTab === 'revenue' ? PLATFORM_DATA.revenue
    : metricTab === 'spend' ? PLATFORM_DATA.spend
      : PLATFORM_DATA.ctr;

  const metricColor = metricTab === 'revenue' ? Colors.success
    : metricTab === 'spend' ? Colors.accent1
      : Colors.accent2;

  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Campaign Analytics</Text>
          <Text style={styles.headerSub}>Visual performance charts & insights</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* KPI Strip */}
        <View style={styles.kpiStrip}>
          {[
            { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}K`, color: Colors.success, icon: 'trending-up' },
            { label: 'Total Spend', value: `$${(totalSpend / 1000).toFixed(1)}K`, color: Colors.accent1, icon: 'payments' },
            { label: 'Overall ROI', value: `+${overallROI}%`, color: Colors.primary, icon: 'show-chart' },
            { label: 'ROAS', value: `${overallROAS}x`, color: Colors.accent2, icon: 'speed' },
          ].map((kpi, i) => (
            <View key={i} style={styles.kpiItem}>
              <View style={[styles.kpiIcon, { backgroundColor: kpi.color + '22' }]}>
                <MaterialIcons name={kpi.icon as any} size={16} color={kpi.color} />
              </View>
              <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue vs Spend Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenue vs Spend</Text>
            <Text style={styles.chartSub}>7-Month Trend</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>Revenue</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.accent1 }]} />
              <Text style={styles.legendText}>Spend</Text>
            </View>
          </View>

          {/* Grouped Bar Chart */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 3, marginBottom: 4 }}>
            {MONTHLY_DATA.revenue.map((rev, i) => {
              const maxVal = Math.max(...MONTHLY_DATA.revenue);
              const revH = (rev / maxVal) * 100;
              const spendH = (MONTHLY_DATA.spend[i] / maxVal) * 100;
              const isActive = i === activeMonth;
              return (
                <Pressable key={i} style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 1, height: 120 }}
                  onPress={() => setActiveMonth(i)}>
                  <View style={{ flex: 1, backgroundColor: Colors.success + (isActive ? 'CC' : '55'), height: revH, borderRadius: 2 }} />
                  <View style={{ flex: 1, backgroundColor: Colors.accent1 + (isActive ? 'CC' : '55'), height: spendH, borderRadius: 2 }} />
                </Pressable>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {MONTHS_SHORT.map((m, i) => (
              <Text key={i} style={[styles.chartAxisLabel, i === activeMonth && { color: Colors.primary }]}>{m}</Text>
            ))}
          </View>

          {/* Selected month data */}
          <View style={styles.monthDetail}>
            <Text style={styles.monthDetailTitle}>{MONTHS_SHORT[activeMonth]} Performance</Text>
            <View style={styles.monthDetailRow}>
              <View style={styles.monthStat}>
                <Text style={[styles.monthStatVal, { color: Colors.success }]}>${MONTHLY_DATA.revenue[activeMonth].toLocaleString()}</Text>
                <Text style={styles.monthStatLabel}>Revenue</Text>
              </View>
              <View style={styles.monthStat}>
                <Text style={[styles.monthStatVal, { color: Colors.accent1 }]}>${MONTHLY_DATA.spend[activeMonth].toLocaleString()}</Text>
                <Text style={styles.monthStatLabel}>Spend</Text>
              </View>
              <View style={styles.monthStat}>
                <Text style={[styles.monthStatVal, { color: Colors.primary }]}>
                  {((MONTHLY_DATA.revenue[activeMonth] / MONTHLY_DATA.spend[activeMonth])).toFixed(1)}x
                </Text>
                <Text style={styles.monthStatLabel}>ROAS</Text>
              </View>
              <View style={styles.monthStat}>
                <Text style={[styles.monthStatVal, { color: Colors.accent2 }]}>{MONTHLY_DATA.conversions[activeMonth]}</Text>
                <Text style={styles.monthStatLabel}>Conversions</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Conversion Trend Line */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Conversions Trend</Text>
            <Text style={styles.chartSub}>Monthly conversions</Text>
          </View>
          <LineChart
            data={MONTHLY_DATA.conversions}
            labels={MONTHS_SHORT}
            color={Colors.primary}
          />
          <View style={styles.trendSummary}>
            <MaterialIcons name="trending-up" size={14} color={Colors.success} />
            <Text style={styles.trendSummaryText}>
              +{(((MONTHLY_DATA.conversions[6] - MONTHLY_DATA.conversions[0]) / MONTHLY_DATA.conversions[0]) * 100).toFixed(0)}% growth over 7 months
            </Text>
          </View>
        </View>

        {/* Platform Breakdown */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Platform Breakdown</Text>
            <View style={styles.metricTabs}>
              {(['revenue', 'spend', 'ctr'] as const).map(m => (
                <Pressable key={m}
                  style={[styles.metricTab, metricTab === m && { backgroundColor: metricColor }]}
                  onPress={() => setMetricTab(m)}>
                  <Text style={[styles.metricTabText, metricTab === m && { color: Colors.background }]}>
                    {m.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <BarChart
            data={metricData}
            labels={['IG', 'FB', 'Google', 'TT', 'LI', 'Email', 'YT']}
            color={metricColor}
          />

          {/* Platform Detail */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformCards} contentContainerStyle={{ gap: 8 }}>
            {PLATFORM_DATA.labels.map((platform, i) => (
              <Pressable key={i}
                style={[styles.platformCard, activePlatform === i && { borderColor: PLATFORM_DATA.colors[i] }]}
                onPress={() => setActivePlatform(i)}>
                <View style={[styles.platformDot, { backgroundColor: PLATFORM_DATA.colors[i] }]} />
                <Text style={styles.platformName} numberOfLines={1}>{platform}</Text>
                <Text style={[styles.platformValue, { color: PLATFORM_DATA.colors[i] }]}>
                  {metricTab === 'ctr' ? `${metricData[i]}%` : `$${metricData[i]}`}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Channel Split */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Channel Mix</Text>
            <Text style={styles.chartSub}>Budget allocation</Text>
          </View>
          <View style={styles.channelSplitRow}>
            {CHANNEL_SPLIT.map((ch, i) => (
              <View key={i} style={{ flex: ch.pct, height: 20, backgroundColor: ch.color, borderRadius: i === 0 ? 4 : i === CHANNEL_SPLIT.length - 1 ? 4 : 0 }} />
            ))}
          </View>
          <View style={styles.channelLegend}>
            {CHANNEL_SPLIT.map((ch, i) => (
              <View key={i} style={styles.channelLegendItem}>
                <View style={[styles.channelDot, { backgroundColor: ch.color }]} />
                <Text style={styles.channelLabel}>{ch.label}</Text>
                <Text style={[styles.channelPct, { color: ch.color }]}>{ch.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Performance Rings */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Goal Achievement</Text>
          <View style={styles.ringsRow}>
            <RingChart percentage={87} color={Colors.success} label="Revenue Goal" />
            <RingChart percentage={72} color={Colors.primary} label="Lead Goal" />
            <RingChart percentage={94} color={Colors.accent2} label="CTR Goal" />
            <RingChart percentage={68} color={Colors.accent1} label="CPA Target" />
          </View>
        </View>

        {/* Top Insights */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>AI Insights</Text>
          {[
            { text: 'Google Search delivers 5.6x ROAS — highest of all channels. Scale budget by 20%.', icon: 'trending-up', color: Colors.success },
            { text: 'TikTok shows highest CTR (5.6%) but lowest conversion — optimize landing page for mobile.', icon: 'warning', color: Colors.primary },
            { text: 'Email has 22.4% CTR — build automation sequence for 3× more revenue from same list.', icon: 'lightbulb', color: Colors.accent2 },
            { text: 'July conversions up 31% — replicate June/July strategy for Q3 planning.', icon: 'star', color: Colors.accent1 },
          ].map((insight, i) => (
            <View key={i} style={[styles.insightRow, { borderLeftColor: insight.color }]}>
              <MaterialIcons name={insight.icon as any} size={18} color={insight.color} />
              <Text style={styles.insightText}>{insight.text}</Text>
            </View>
          ))}
        </View>

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
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.success + '22', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.success + '44',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  liveText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: FontWeight.extrabold, letterSpacing: 1 },
  scroll: { paddingHorizontal: Spacing.md },
  kpiStrip: {
    flexDirection: 'row', backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.xl, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  kpiItem: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 4 },
  kpiIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  kpiValue: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold },
  kpiLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  chartCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  chartTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  chartSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  legendRow: { flexDirection: 'row', gap: 16, marginBottom: Spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  chartAxisLabel: { flex: 1, textAlign: 'center', fontSize: 9, color: Colors.textMuted },
  monthDetail: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.sm, marginTop: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  monthDetailTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 8 },
  monthDetailRow: { flexDirection: 'row' },
  monthStat: { flex: 1, alignItems: 'center' },
  monthStatVal: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold },
  monthStatLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  trendSummary: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.success + '11', borderRadius: BorderRadius.md,
    paddingHorizontal: 10, paddingVertical: 6, marginTop: Spacing.sm,
  },
  trendSummaryText: { fontSize: FontSize.sm, color: Colors.success, fontWeight: FontWeight.medium },
  metricTabs: { flexDirection: 'row', backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md, overflow: 'hidden' },
  metricTab: { paddingHorizontal: 8, paddingVertical: 5 },
  metricTabText: { fontSize: 10, fontWeight: FontWeight.bold, color: Colors.textMuted },
  platformCards: { marginTop: Spacing.sm },
  platformCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, minWidth: 72,
  },
  platformDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  platformName: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
  platformValue: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold },
  channelSplitRow: { flexDirection: 'row', height: 20, borderRadius: 4, overflow: 'hidden', marginBottom: Spacing.md, gap: 2 },
  channelLegend: { gap: 8 },
  channelLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  channelDot: { width: 10, height: 10, borderRadius: 5 },
  channelLabel: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  channelPct: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: Spacing.sm },
  ringWrap: { width: 70, height: 70, position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  ringOuter: { position: 'absolute', width: 70, height: 70, borderRadius: 35, borderWidth: 8 },
  ringInner: { position: 'absolute', width: 54, height: 54, borderRadius: 27, borderWidth: 0 },
  ringCenter: { justifyContent: 'center', alignItems: 'center' },
  ringValue: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold },
  ringLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  insightRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    padding: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 3,
  },
  insightText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 19 },
});
