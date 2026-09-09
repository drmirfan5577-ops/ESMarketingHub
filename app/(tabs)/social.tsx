import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Pressable, TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { LOCAL_TRICKS } from '@/constants/marketingData';
import { useAlert } from '@/template';

const PLATFORMS = [
  { id: 'ig', name: 'Instagram', icon: 'photo-camera', color: '#E1306C', followerTip: '3-5 posts/week', bestTime: '6-9 PM' },
  { id: 'fb', name: 'Facebook', icon: 'people', color: '#1877F2', followerTip: '1-2 posts/day', bestTime: '1-3 PM' },
  { id: 'tt', name: 'TikTok', icon: 'music-video', color: '#FF0050', followerTip: '3-5 videos/day', bestTime: '7-9 PM' },
  { id: 'li', name: 'LinkedIn', icon: 'work', color: '#0A66C2', followerTip: '1-2 posts/week', bestTime: '8-10 AM' },
  { id: 'yt', name: 'YouTube', icon: 'play-circle-filled', color: '#FF0000', followerTip: '1-3 videos/week', bestTime: '2-4 PM' },
  { id: 'tw', name: 'Twitter/X', icon: 'chat', color: '#1DA1F2', followerTip: '3-5 tweets/day', bestTime: '9-11 AM' },
  { id: 'pi', name: 'Pinterest', icon: 'collections', color: '#E60023', followerTip: '10-25 pins/day', bestTime: '8-11 PM' },
  { id: 'sn', name: 'Snapchat', icon: 'camera', color: '#FFFC00', followerTip: '1-2 snaps/day', bestTime: '10 PM-1 AM' },
];

const HASHTAG_SETS = {
  Business: ['#business', '#entrepreneur', '#startup', '#success', '#marketing', '#digitalmarketing', '#growyourbusiness', '#branding', '#smallbusiness', '#businessowner', '#motivation', '#leadership', '#hustle', '#innovation', '#strategy'],
  Fitness: ['#fitness', '#workout', '#gym', '#fitnessmotivation', '#health', '#lifestyle', '#training', '#bodybuilding', '#exercise', '#fit', '#weightloss', '#wellness', '#nutrition', '#gains', '#personaltrainer'],
  Fashion: ['#fashion', '#style', '#ootd', '#fashionblogger', '#outfit', '#clothing', '#streetstyle', '#fashionista', '#aesthetic', '#trendy', '#luxury', '#brand', '#shopping', '#model', '#designer'],
  Food: ['#food', '#foodie', '#instafood', '#foodphotography', '#delicious', '#yummy', '#restaurant', '#cooking', '#homemade', '#recipe', '#eat', '#foodblogger', '#healthy', '#vegetarian', '#chef'],
  Tech: ['#tech', '#technology', '#ai', '#programming', '#coding', '#developer', '#software', '#startup', '#innovation', '#digital', '#gadgets', '#apple', '#android', '#cybersecurity', '#machinelearning'],
};

const POST_TEMPLATES = [
  {
    platform: 'Instagram', type: 'Product Launch',
    template: '🚀 Introducing [PRODUCT NAME]!\n\n✨ [Key Benefit 1]\n✨ [Key Benefit 2]\n✨ [Key Benefit 3]\n\n👇 Drop your questions in comments!\n\n🔗 Link in bio to shop now\n\n#[YourBrand] #NewProduct #[Industry]',
    icon: 'photo-camera', color: '#E1306C',
  },
  {
    platform: 'LinkedIn', type: 'Thought Leadership',
    template: 'I\'ve been thinking about [TOPIC] lately...\n\nHere\'s what most people get wrong:\n\n1/ [Insight 1]\n\n2/ [Insight 2]\n\n3/ [Insight 3]\n\nThe bottom line: [KEY TAKEAWAY]\n\nHave you experienced this? Let\'s discuss 👇',
    icon: 'work', color: '#0A66C2',
  },
  {
    platform: 'Facebook', type: 'Engagement Post',
    template: '❓ Quick question for my community...\n\n[ENGAGING QUESTION related to your niche?]\n\nA) [Option 1]\nB) [Option 2]\nC) [Option 3]\n\nComment your answer below! 👇\n\nI\'ll share the results tomorrow!',
    icon: 'people', color: '#1877F2',
  },
  {
    platform: 'TikTok', type: 'Hook Script',
    template: '[0-2s]: POV: [RELATABLE SITUATION]\n[2-5s]: The problem: [PAIN POINT]\n[5-10s]: The secret most people don\'t know...\n[10-20s]: [YOUR SOLUTION - show don\'t tell]\n[20-25s]: Results: [DRAMATIC TRANSFORMATION]\n[25-30s]: Try this and thank me later! Follow for more 💯',
    icon: 'music-video', color: '#FF0050',
  },
  {
    platform: 'Twitter/X', type: 'Thread Opener',
    template: 'I spent [TIME] learning [TOPIC].\n\nHere\'s everything you need to know (in 10 tweets):\n\n🧵 Thread 👇',
    icon: 'chat', color: '#1DA1F2',
  },
  {
    platform: 'YouTube', type: 'Video Description',
    template: '[VIDEO TITLE]\n\n📌 In this video:\n00:00 - Introduction\n[TIMESTAMPS...]\n\n✅ What you\'ll learn:\n• [Point 1]\n• [Point 2]\n\n🔔 Subscribe for more: [CHANNEL LINK]\n\n#[keyword1] #[keyword2] #[keyword3]',
    icon: 'play-circle-filled', color: '#FF0000',
  },
];

export default function SocialScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [activeSection, setActiveSection] = useState<'platforms' | 'hashtags' | 'posts' | 'local'>('platforms');
  const [selectedHashtagSet, setSelectedHashtagSet] = useState('Business');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const sections = [
    { id: 'platforms', label: 'Platforms', icon: 'devices' },
    { id: 'hashtags', label: 'Hashtags', icon: 'tag' },
    { id: 'posts', label: 'Post Templates', icon: 'post-add' },
    { id: 'local', label: 'Local Tips', icon: 'location-on' },
  ] as const;

  const handleCopyTemplate = (templateId: string, text: string) => {
    setCopiedTemplate(templateId);
    showAlert('Template Copied!', 'Post template copied to clipboard. Customize it for your brand!');
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Media</Text>
        <Text style={styles.headerSub}>Tools, templates & local tips</Text>
      </View>

      {/* Section Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsWrap} contentContainerStyle={styles.tabsContent}>
        {sections.map(sec => (
          <Pressable
            key={sec.id}
            style={[styles.tabBtn, activeSection === sec.id && styles.tabBtnActive]}
            onPress={() => setActiveSection(sec.id)}
          >
            <MaterialIcons
              name={sec.icon as any}
              size={16}
              color={activeSection === sec.id ? Colors.background : Colors.textSecondary}
            />
            <Text style={[styles.tabLabel, activeSection === sec.id && styles.tabLabelActive]}>
              {sec.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* PLATFORMS */}
        {activeSection === 'platforms' && (
          <View>
            <Text style={styles.sectionDesc}>Platform-specific strategies and best practices</Text>
            {PLATFORMS.map(p => (
              <View key={p.id} style={styles.platformCard}>
                <View style={[styles.platformIcon, { backgroundColor: p.color + '22' }]}>
                  <MaterialIcons name={p.icon as any} size={26} color={p.color} />
                </View>
                <View style={styles.platformInfo}>
                  <Text style={styles.platformName}>{p.name}</Text>
                  <View style={styles.platformMeta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="schedule" size={12} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{p.followerTip}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="access-time" size={12} color={Colors.textMuted} />
                      <Text style={styles.metaText}>Best: {p.bestTime}</Text>
                    </View>
                  </View>
                </View>
                <Pressable
                  style={[styles.platformBtn, { borderColor: p.color }]}
                  onPress={() => showAlert(`${p.name} Strategy`, `Post frequency: ${p.followerTip}\nBest posting time: ${p.bestTime}\n\nFocus on native content format for maximum reach.`)}
                >
                  <Text style={[styles.platformBtnText, { color: p.color }]}>Tips</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* HASHTAGS */}
        {activeSection === 'hashtags' && (
          <View>
            <Text style={styles.sectionDesc}>Ready-to-use hashtag sets for different niches</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hashCatsWrap} contentContainerStyle={{ paddingLeft: 0, gap: 8 }}>
              {Object.keys(HASHTAG_SETS).map(cat => (
                <Pressable
                  key={cat}
                  style={[styles.hashCat, selectedHashtagSet === cat && styles.hashCatActive]}
                  onPress={() => setSelectedHashtagSet(cat)}
                >
                  <Text style={[styles.hashCatText, selectedHashtagSet === cat && styles.hashCatTextActive]}>{cat}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.hashSetCard}>
              <View style={styles.hashSetHeader}>
                <Text style={styles.hashSetTitle}>{selectedHashtagSet} Hashtags</Text>
                <Pressable
                  style={styles.copyAllBtn}
                  onPress={() => showAlert('Hashtags Copied', `All ${selectedHashtagSet} hashtags copied! Ready to paste.`)}
                >
                  <MaterialIcons name="content-copy" size={14} color={Colors.primary} />
                  <Text style={styles.copyAllText}>Copy All</Text>
                </Pressable>
              </View>
              <View style={styles.hashGrid}>
                {(HASHTAG_SETS as any)[selectedHashtagSet].map((tag: string, i: number) => (
                  <Pressable
                    key={i}
                    style={styles.hashTag}
                    onPress={() => showAlert('Tag Copied', `${tag} copied!`)}
                  >
                    <Text style={styles.hashTagText}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.hashTip}>
              <MaterialIcons name="lightbulb" size={16} color={Colors.primary} />
              <Text style={styles.hashTipText}>Mix 5 popular + 5 niche + 5 branded tags for best reach. Avoid banned hashtags.</Text>
            </View>
          </View>
        )}

        {/* POST TEMPLATES */}
        {activeSection === 'posts' && (
          <View>
            <Text style={styles.sectionDesc}>Proven post templates for maximum engagement</Text>
            {POST_TEMPLATES.map((tmpl, i) => (
              <View key={i} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={[styles.postPlatformIcon, { backgroundColor: tmpl.color + '22' }]}>
                    <MaterialIcons name={tmpl.icon as any} size={18} color={tmpl.color} />
                  </View>
                  <View>
                    <Text style={[styles.postPlatform, { color: tmpl.color }]}>{tmpl.platform}</Text>
                    <Text style={styles.postType}>{tmpl.type}</Text>
                  </View>
                  <Pressable
                    style={[styles.copyBtn, copiedTemplate === String(i) && styles.copyBtnActive]}
                    onPress={() => handleCopyTemplate(String(i), tmpl.template)}
                  >
                    <MaterialIcons
                      name={copiedTemplate === String(i) ? 'check' : 'content-copy'}
                      size={16}
                      color={copiedTemplate === String(i) ? Colors.success : Colors.primary}
                    />
                    <Text style={[styles.copyBtnText, copiedTemplate === String(i) && { color: Colors.success }]}>
                      {copiedTemplate === String(i) ? 'Copied' : 'Copy'}
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.postBody}>
                  <Text style={styles.postTemplate}>{tmpl.template}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* LOCAL TIPS */}
        {activeSection === 'local' && (
          <View>
            <Text style={styles.sectionDesc}>Proven local marketing strategies that actually work</Text>
            {LOCAL_TRICKS.map((trick, i) => (
              <View key={i} style={styles.localCard}>
                <View style={styles.localIconWrap}>
                  <MaterialIcons name={trick.icon as any} size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.localTitle}>{trick.title}</Text>
                  <Text style={styles.localTip}>{trick.tip}</Text>
                </View>
                <Pressable
                  style={styles.localActionBtn}
                  onPress={() => showAlert(trick.title, trick.tip + '\n\nTap "Launch Tool" in the Tools section to get started.')}
                >
                  <MaterialIcons name="arrow-forward" size={18} color={Colors.primary} />
                </Pressable>
              </View>
            ))}

            {/* Bonus tips */}
            <Text style={styles.bonusTitle}>Bonus Local Ad Channels</Text>
            {[
              { ch: 'Nextdoor App Ads', desc: 'Hyper-local neighborhood targeting, low competition, high trust', icon: 'home' },
              { ch: 'Local Facebook Groups', desc: 'Join 5+ local groups, provide value, no hard selling', icon: 'group' },
              { ch: 'Waze Local Ads', desc: 'Pin ads visible to drivers near your location', icon: 'directions-car' },
              { ch: 'Yelp Advertising', desc: 'High commercial intent, great for service businesses', icon: 'star' },
              { ch: 'Local Radio Digital Ads', desc: 'Geo-targeted audio ads on Spotify and Pandora', icon: 'radio' },
              { ch: 'Community Bulletin Boards', desc: 'Physical + digital bulletin boards in cafes & libraries', icon: 'campaign' },
            ].map((item, i) => (
              <View key={i} style={styles.bonusCard}>
                <MaterialIcons name={item.icon as any} size={20} color={Colors.accent2} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bonusCh}>{item.ch}</Text>
                  <Text style={styles.bonusDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
  },
  headerSub: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  tabsWrap: {
    height: 48,
    marginBottom: 4,
  },
  tabsContent: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  tabLabelActive: {
    color: Colors.background,
    fontWeight: FontWeight.bold,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  sectionDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  platformMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  platformBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  platformBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  hashCatsWrap: {
    marginBottom: Spacing.md,
  },
  hashCat: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hashCatActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hashCatText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  hashCatTextActive: {
    color: Colors.background,
    fontWeight: FontWeight.bold,
  },
  hashSetCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  hashSetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  hashSetTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  copyAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '22',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  copyAllText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  hashGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashTag: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hashTagText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  hashTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primary + '11',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: 8,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  hashTipText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  postCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  postPlatformIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postPlatform: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  postType: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  copyBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  copyBtnActive: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '11',
  },
  copyBtnText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  postBody: {
    padding: Spacing.md,
  },
  postTemplate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  localCard: {
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
  localIconWrap: {
    width: 44,
    height: 44,
    backgroundColor: Colors.primary + '22',
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  localTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  localTip: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  localActionBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  bonusTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginVertical: Spacing.md,
  },
  bonusCard: {
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
  bonusCh: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  bonusDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
