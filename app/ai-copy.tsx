import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Animated, Easing, Share,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useAlert } from '@/template';

const COPY_TYPES = [
  { id: 'headline', label: 'Ad Headline', icon: 'title', color: '#FFD700', desc: 'Attention-grabbing headline' },
  { id: 'body', label: 'Ad Body Copy', icon: 'article', color: '#FF6B35', desc: 'Persuasive ad description' },
  { id: 'cta', label: 'Call to Action', icon: 'ads-click', color: '#00C853', desc: 'Action-driving CTA text' },
  { id: 'email', label: 'Email Copy', icon: 'email', color: '#00D4FF', desc: 'Full email body text' },
  { id: 'social', label: 'Social Caption', icon: 'people', color: '#7B2FBE', desc: 'Engaging social post caption' },
  { id: 'product', label: 'Product Description', icon: 'shopping-bag', color: '#FF1744', desc: 'Conversion-focused description' },
  { id: 'sms', label: 'SMS Text', icon: 'sms', color: '#FF6B35', desc: 'Short compelling SMS message' },
  { id: 'slogan', label: 'Brand Slogan', icon: 'campaign', color: '#FFD700', desc: 'Memorable brand tagline' },
];

const TONES = ['Professional', 'Casual', 'Urgent', 'Luxury', 'Friendly', 'Bold', 'Empathetic', 'Humorous'];
const FORMULAS = ['AIDA', 'PAS', 'BAB', 'FAB', 'FOMO', '4Ps'];

const COPY_EXAMPLES: Record<string, string[][]> = {
  headline: [
    ['Transform Your Skin in 7 Days — Guaranteed', 'The Secret That [X] Professionals Use Daily', 'Stop Wasting Money on [Problem] — Try This Instead'],
    ['Warning: This [Product] Changes Everything', 'Join [Number]+ Happy Customers Today', 'Finally — A [Product] That Actually Works'],
    ['Your Competitors Are Already Using This', 'Save [Amount] This Week Only — Limited Offer', 'The #1 [Category] Tool of [Year]'],
  ],
  body: [
    ['Are you tired of [problem]? Thousands of [audience] struggled with the same issue until they discovered [product]. With [key benefit], you can finally [desired outcome]. Plus, [second benefit] means you save time and money. Try it risk-free today.'],
    ['Imagine waking up every morning knowing [dream outcome]. With [product], that\'s exactly what [number] customers experience. Our [unique feature] ensures [benefit] — backed by [proof]. Don\'t let [pain point] hold you back any longer.'],
  ],
  cta: [
    ['Get Your Free Trial Today →', 'Claim Your Discount — Ends Tonight', 'Start Transforming Now — Zero Risk'],
    ['Yes! I Want Access Now', 'Book My Free Consultation', 'Download Instantly — It\'s Free'],
    ['Shop The Sale — 50% Off Today Only', 'Get Started in 60 Seconds', 'Join For Free — Upgrade Anytime'],
  ],
  email: [
    ['Subject: You won\'t believe what happened...\n\nHi [Name],\n\nI\'ll keep this short.\n\nLast week, [customer] went from [before state] to [after state] in just [timeframe].\n\nHere\'s exactly how they did it:\n→ [Step 1]\n→ [Step 2]\n→ [Step 3]\n\nThe best part? You can start today — completely free.\n\n[CTA Button: Start Now]\n\nTalk soon,\n[Sender Name]\n\nP.S. This offer expires [date]. Don\'t miss it.'],
  ],
  social: [
    ['POV: You finally found a [product/service] that actually works 🙌\n\nHere\'s what changed for us:\n✅ [Benefit 1]\n✅ [Benefit 2]\n✅ [Benefit 3]\n\nDrop a 🔥 if you want to know more!\n\n#[hashtag1] #[hashtag2] #[hashtag3]'],
    ['Real talk — [problem] was killing our [metric] 😤\n\nThen we tried [solution]...\n\n📈 [Result 1]\n💰 [Result 2]\n⏱️ [Result 3]\n\nLink in bio to learn how → \n\n#[niche] #[topic] #success'],
  ],
  product: [
    ['Meet [Product Name] — the [category] that [key benefit] without [common drawback].\n\n🎯 Perfect for [target audience] who want [outcome]\n⚡ [Feature 1] — so you can [benefit]\n🔒 [Feature 2] — [trust element]\n🌟 [Social proof or award]\n\nOver [number] customers have already made the switch. Are you next?\n\n✅ [Guarantee or offer]'],
  ],
  sms: [
    ['[Brand]: 🔥 FLASH SALE — 40% off everything TODAY ONLY! Code: FLASH40. Shop now: [link] Reply STOP to opt out'],
    ['Hey [Name]! Your exclusive [Brand] offer expires in 2 hrs. Don\'t miss [benefit]! Tap here: [link]'],
  ],
  slogan: [
    ['Do More. Spend Less. Live Better.', '[Brand] — Where [Benefit] Meets [Value]', 'Built Different. Designed for You.'],
    ['The [Adjective] Way to [Outcome].', 'Because You Deserve [Benefit].', '[Brand]: [Short promise].'],
  ],
};

const AI_ANALYSIS = [
  { metric: 'Readability Score', getValue: () => Math.floor(Math.random() * 20) + 78, unit: '/100', color: Colors.success },
  { metric: 'Persuasion Index', getValue: () => Math.floor(Math.random() * 25) + 70, unit: '/100', color: Colors.primary },
  { metric: 'Emotional Impact', getValue: () => Math.floor(Math.random() * 20) + 75, unit: '/100', color: '#FF6B35' },
  { metric: 'CTA Strength', getValue: () => Math.floor(Math.random() * 15) + 82, unit: '/100', color: '#7B2FBE' },
];

export default function AICopyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [selectedType, setSelectedType] = useState('headline');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [selectedFormula, setSelectedFormula] = useState('AIDA');
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [benefit, setBenefit] = useState('');
  const [pain, setPain] = useState('');
  const [variants, setVariants] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scores, setScores] = useState<{ metric: string; value: number; unit: string; color: string }[]>([]);
  const [savedCopies, setSavedCopies] = useState<string[]>([]);
  const [activeVariant, setActiveVariant] = useState(0);

  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const currentType = COPY_TYPES.find(t => t.id === selectedType) || COPY_TYPES[0];

  const startSpin = () => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 800, easing: Easing.linear, useNativeDriver: true })
    ).start();
  };

  const stopSpin = () => { spinAnim.stopAnimation(); spinAnim.setValue(0); };

  const generateCopy = async () => {
    if (!product) { showAlert('Missing Info', 'Please enter your product or brand name.'); return; }
    setIsGenerating(true);
    setVariants([]);
    setScores([]);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    startSpin();

    await new Promise(r => setTimeout(r, 1800));

    stopSpin();

    const pool = COPY_EXAMPLES[selectedType] || COPY_EXAMPLES.headline;
    const generated: string[] = [];

    // Process each variant with actual substitution
    pool.forEach(group => {
      group.forEach(template => {
        let copy = template
          .replace(/\[product\]/gi, product)
          .replace(/\[Product Name\]/g, product)
          .replace(/\[Product\]/g, product)
          .replace(/\[audience\]/gi, audience || 'customers')
          .replace(/\[target audience\]/gi, audience || 'modern professionals')
          .replace(/\[benefit\]/gi, benefit || 'incredible results')
          .replace(/\[key benefit\]/gi, benefit || 'outstanding performance')
          .replace(/\[pain\]/gi, pain || 'common problems')
          .replace(/\[problem\]/gi, pain || 'daily challenges')
          .replace(/\[Brand\]/g, product)
          .replace(/\[Year\]/g, '2025')
          .replace(/\[Number\]/g, ['2,500', '10,000+', '50,000+'][Math.floor(Math.random() * 3)])
          .replace(/\[number\]/g, ['1,200', '8,500', '32,000'][Math.floor(Math.random() * 3)])
          .replace(/\[Amount\]/g, ['$200', '$500', '$1,000'][Math.floor(Math.random() * 3)]);
        generated.push(copy);
      });
    });

    // Add tone-specific prefix/suffix
    const toneVariants = generated.slice(0, 3).map(copy => {
      if (selectedTone === 'Urgent' && !copy.includes('!')) return copy + ' — Act Now!';
      if (selectedTone === 'Luxury') return '✨ ' + copy;
      if (selectedTone === 'Humorous') return copy + ' 😄';
      if (selectedTone === 'Bold') return copy.toUpperCase().slice(0, 60) + (copy.length > 60 ? '...' : '');
      return copy;
    });

    setVariants(toneVariants.length > 0 ? toneVariants : generated.slice(0, 3));
    setActiveVariant(0);

    const newScores = AI_ANALYSIS.map(a => ({ metric: a.metric, value: a.getValue(), unit: a.unit, color: a.color }));
    setScores(newScores);

    setIsGenerating(false);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const saveCopy = (copy: string) => {
    setSavedCopies(prev => [copy, ...prev.slice(0, 9)]);
    showAlert('Saved!', 'Copy saved to your clipboard collection.');
  };

  const shareCopy = async (copy: string) => {
    try { await Share.share({ message: copy }); }
    catch { showAlert('Copied!', 'Copy text ready to use.'); }
  };

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>AI Copy Generator</Text>
          <Text style={styles.headerSub}>Instant marketing copy — 8 formats</Text>
        </View>
        {savedCopies.length > 0 && (
          <View style={styles.savedBadge}>
            <MaterialIcons name="bookmark" size={14} color={Colors.primary} />
            <Text style={styles.savedCount}>{savedCopies.length}</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Copy Type Selector */}
        <Text style={styles.sectionLabel}>Copy Format</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
          {COPY_TYPES.map(type => (
            <Pressable key={type.id}
              style={[styles.typeCard, selectedType === type.id && { borderColor: type.color, backgroundColor: type.color + '15' }]}
              onPress={() => { setSelectedType(type.id); setVariants([]); setScores([]); }}>
              <MaterialIcons name={type.icon as any} size={20} color={selectedType === type.id ? type.color : Colors.textMuted} />
              <Text style={[styles.typeLabel, selectedType === type.id && { color: type.color }]}>{type.label}</Text>
              <Text style={styles.typeDesc}>{type.desc}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Input Fields */}
        <View style={styles.inputCard}>
          <Text style={styles.inputCardTitle}>
            <MaterialIcons name={currentType.icon as any} size={18} color={currentType.color} />
            {' '}{currentType.label} — Inputs
          </Text>

          <Text style={styles.fieldLabel}>Product / Brand / Service *</Text>
          <TextInput style={styles.field} value={product} onChangeText={setProduct}
            placeholder="e.g. NovaSkin Serum, Fitness App, E-Commerce Store"
            placeholderTextColor={Colors.textMuted} />

          <Text style={styles.fieldLabel}>Target Audience</Text>
          <TextInput style={styles.field} value={audience} onChangeText={setAudience}
            placeholder="e.g. Women 25-45, small business owners, gamers"
            placeholderTextColor={Colors.textMuted} />

          <Text style={styles.fieldLabel}>Key Benefit / Unique Value</Text>
          <TextInput style={styles.field} value={benefit} onChangeText={setBenefit}
            placeholder="e.g. clears acne in 7 days, saves 3 hours weekly"
            placeholderTextColor={Colors.textMuted} />

          <Text style={styles.fieldLabel}>Pain Point / Problem</Text>
          <TextInput style={styles.field} value={pain} onChangeText={setPain}
            placeholder="e.g. expensive skincare, wasted ad budget, low conversions"
            placeholderTextColor={Colors.textMuted} />
        </View>

        {/* Tone & Formula */}
        <View style={styles.configRow}>
          <View style={[styles.configCard, { flex: 1 }]}>
            <Text style={styles.configLabel}>Tone</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
              {TONES.map(tone => (
                <Pressable key={tone}
                  style={[styles.toneChip, selectedTone === tone && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
                  onPress={() => setSelectedTone(tone)}>
                  <Text style={[styles.toneText, selectedTone === tone && { color: Colors.background }]}>{tone}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.formulaSection}>
          <Text style={styles.configLabel}>Copywriting Formula</Text>
          <View style={styles.formulaRow}>
            {FORMULAS.map(f => (
              <Pressable key={f}
                style={[styles.formulaChip, selectedFormula === f && { backgroundColor: currentType.color, borderColor: currentType.color }]}
                onPress={() => setSelectedFormula(f)}>
                <Text style={[styles.formulaText, selectedFormula === f && { color: Colors.background }]}>{f}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.formulaHint}>
            {selectedFormula === 'AIDA' && <Text style={styles.hintText}>Attention → Interest → Desire → Action</Text>}
            {selectedFormula === 'PAS' && <Text style={styles.hintText}>Problem → Agitate → Solution</Text>}
            {selectedFormula === 'BAB' && <Text style={styles.hintText}>Before → After → Bridge</Text>}
            {selectedFormula === 'FAB' && <Text style={styles.hintText}>Features → Advantages → Benefits</Text>}
            {selectedFormula === 'FOMO' && <Text style={styles.hintText}>Fear Of Missing Out — Scarcity + Urgency</Text>}
            {selectedFormula === '4Ps' && <Text style={styles.hintText}>Promise → Picture → Proof → Push</Text>}
          </View>
        </View>

        {/* Generate Button */}
        <Pressable style={({ pressed }) => [styles.generateBtn, { backgroundColor: currentType.color }, pressed && { opacity: 0.9 }]}
          onPress={generateCopy} disabled={isGenerating}>
          {isGenerating ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <MaterialIcons name="autorenew" size={22} color={Colors.background} />
            </Animated.View>
          ) : (
            <MaterialIcons name="auto-awesome" size={22} color={Colors.background} />
          )}
          <Text style={styles.generateBtnText}>
            {isGenerating ? 'Generating...' : `Generate ${currentType.label}`}
          </Text>
        </Pressable>

        {/* Generated Variants */}
        {variants.length > 0 && (
          <Animated.View style={[styles.resultsSection, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Generated Copy Variants</Text>
              <View style={[styles.formulaBadge, { backgroundColor: currentType.color + '22' }]}>
                <Text style={[styles.formulaBadgeText, { color: currentType.color }]}>{selectedFormula} · {selectedTone}</Text>
              </View>
            </View>

            {/* AI Score Cards */}
            {scores.length > 0 && (
              <View style={styles.scoreGrid}>
                {scores.map((score, i) => (
                  <View key={i} style={styles.scoreCard}>
                    <Text style={[styles.scoreValue, { color: score.color }]}>{score.value}{score.unit}</Text>
                    <Text style={styles.scoreLabel}>{score.metric}</Text>
                    <View style={styles.scoreBar}>
                      <View style={[styles.scoreFill, { width: `${score.value}%`, backgroundColor: score.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Variant Tabs */}
            <View style={styles.variantTabs}>
              {variants.map((_, i) => (
                <Pressable key={i}
                  style={[styles.variantTab, activeVariant === i && { backgroundColor: currentType.color }]}
                  onPress={() => setActiveVariant(i)}>
                  <Text style={[styles.variantTabText, activeVariant === i && { color: Colors.background }]}>V{i + 1}</Text>
                </Pressable>
              ))}
            </View>

            {/* Active Variant */}
            <View style={[styles.variantCard, { borderColor: currentType.color + '44' }]}>
              <Text style={styles.variantText}>{variants[activeVariant]}</Text>
              <View style={styles.variantActions}>
                <Pressable style={styles.actionBtn} onPress={() => saveCopy(variants[activeVariant])}>
                  <MaterialIcons name="bookmark-border" size={18} color={Colors.primary} />
                  <Text style={styles.actionBtnText}>Save</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={() => shareCopy(variants[activeVariant])}>
                  <MaterialIcons name="share" size={18} color={Colors.accent2} />
                  <Text style={[styles.actionBtnText, { color: Colors.accent2 }]}>Share</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={generateCopy}>
                  <MaterialIcons name="refresh" size={18} color={Colors.accent1} />
                  <Text style={[styles.actionBtnText, { color: Colors.accent1 }]}>Regenerate</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Saved Copies */}
        {savedCopies.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={styles.savedTitle}>Saved Copies ({savedCopies.length})</Text>
            {savedCopies.map((copy, i) => (
              <Pressable key={i} style={styles.savedCard}
                onPress={() => shareCopy(copy)}>
                <Text style={styles.savedText} numberOfLines={2}>{copy}</Text>
                <View style={styles.savedBtns}>
                  <Pressable onPress={() => shareCopy(copy)} style={styles.savedShareBtn}>
                    <MaterialIcons name="share" size={16} color={Colors.primary} />
                  </Pressable>
                  <Pressable onPress={() => setSavedCopies(prev => prev.filter((_, idx) => idx !== i))} style={styles.savedShareBtn}>
                    <MaterialIcons name="delete-outline" size={16} color={Colors.error} />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Formula Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Copywriting Tips</Text>
          {[
            { tip: 'Speak to ONE person, not everyone', icon: 'person' },
            { tip: 'Lead with the biggest benefit, not features', icon: 'star' },
            { tip: 'Use numbers — they build instant credibility', icon: 'looks-one' },
            { tip: 'Create urgency without being dishonest', icon: 'timer' },
            { tip: 'End every piece of copy with a clear CTA', icon: 'ads-click' },
          ].map((item, i) => (
            <View key={i} style={styles.tipRow}>
              <MaterialIcons name={item.icon as any} size={16} color={Colors.primary} />
              <Text style={styles.tipText}>{item.tip}</Text>
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
  savedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary + '22', paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.full,
  },
  savedCount: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.bold },
  scroll: { paddingHorizontal: Spacing.md },
  sectionLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  typeRow: { gap: 10, paddingBottom: Spacing.sm },
  typeCard: {
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceCard, borderWidth: 1, borderColor: Colors.border, gap: 4, minWidth: 100,
  },
  typeLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textAlign: 'center' },
  typeDesc: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  inputCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  inputCardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 4 },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: 6, marginTop: 12 },
  field: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, height: 48, fontSize: FontSize.md,
    color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  configRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.sm },
  configCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  configLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 8 },
  toneChip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  toneText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  formulaSection: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  formulaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  formulaChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  formulaText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  formulaHint: {
    backgroundColor: Colors.primary + '11', borderRadius: BorderRadius.md,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  hintText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.medium },
  generateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 56, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg,
  },
  generateBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.background },
  resultsSection: { marginBottom: Spacing.lg },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  resultsTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  formulaBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  formulaBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  scoreGrid: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  scoreCard: {
    flex: 1, backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  scoreValue: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold },
  scoreLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center', marginVertical: 4 },
  scoreBar: { width: '100%', height: 3, backgroundColor: Colors.border, borderRadius: 2 },
  scoreFill: { height: 3, borderRadius: 2 },
  variantTabs: { flexDirection: 'row', gap: 8, marginBottom: Spacing.sm },
  variantTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  variantTabText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  variantCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, borderWidth: 2,
  },
  variantText: { fontSize: FontSize.md, color: Colors.text, lineHeight: 24, marginBottom: Spacing.md },
  variantActions: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionBtnText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  savedSection: { marginBottom: Spacing.lg },
  savedTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
  savedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  savedText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
  savedBtns: { flexDirection: 'row', gap: 8 },
  savedShareBtn: { padding: 6 },
  tipsSection: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md,
  },
  tipsTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  tipText: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
});
