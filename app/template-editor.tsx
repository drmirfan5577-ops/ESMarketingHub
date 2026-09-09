import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Animated, Modal, Share,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useAlert } from '@/template';

const EDITOR_TEMPLATES = [
  {
    id: 'et1', name: 'Product Launch Ad', category: 'Social Ads', icon: 'rocket-launch',
    color: '#FFD700', bgColor: '#0a0a1a',
    fields: { headline: 'Introducing [Product]', subline: '[Key Benefit] in just [Timeframe]', cta: 'Shop Now', badge: 'NEW LAUNCH', body: 'The future of [category] is here.' },
  },
  {
    id: 'et2', name: 'Flash Sale Banner', category: 'E-Commerce', icon: 'local-offer',
    color: '#FF1744', bgColor: '#1a0000',
    fields: { headline: '⚡ FLASH SALE', subline: '[Discount]% OFF — Today Only!', cta: 'Claim Deal', badge: 'LIMITED TIME', body: 'Hurry! Offer expires at midnight.' },
  },
  {
    id: 'et3', name: 'Testimonial Card', category: 'Social Proof', icon: 'format-quote',
    color: '#00C853', bgColor: '#001a0d',
    fields: { headline: '"[Customer Quote]"', subline: '— [Customer Name], [Role]', cta: 'Read More Reviews', badge: '★★★★★', body: '[Product] changed everything for me.' },
  },
  {
    id: 'et4', name: 'Email Header', category: 'Email', icon: 'email',
    color: '#00D4FF', bgColor: '#00101a',
    fields: { headline: '[Brand Name]', subline: '[Newsletter Title — Month Year]', cta: 'View Online', badge: 'WEEKLY UPDATE', body: 'Your marketing insights for the week.' },
  },
  {
    id: 'et5', name: 'App Download Promo', category: 'App Store', icon: 'phone-android',
    color: '#7B2FBE', bgColor: '#0d001a',
    fields: { headline: 'Download [App Name]', subline: 'Available on iOS & Android', cta: 'Get Free App', badge: '#1 APP', body: 'Join [Number]+ users who love [App].' },
  },
  {
    id: 'et6', name: 'Medical Health Ad', category: 'Medical', icon: 'local-hospital',
    color: '#00C853', bgColor: '#001a0a',
    fields: { headline: '[Clinic / Brand Name]', subline: 'Expert [Specialty] Care Near You', cta: 'Book Appointment', badge: 'TRUSTED CARE', body: 'Your health is our priority.' },
  },
  {
    id: 'et7', name: 'Event Invitation', category: 'Events', icon: 'event',
    color: '#FF6B35', bgColor: '#1a0800',
    fields: { headline: 'You\'re Invited!', subline: '[Event Name] — [Date & Time]', cta: 'Register Now', badge: 'LIVE EVENT', body: 'Join us at [Location / Platform].' },
  },
  {
    id: 'et8', name: 'Real Estate Listing', category: 'Local', icon: 'home',
    color: '#FFD700', bgColor: '#0d0d00',
    fields: { headline: '[Property Type] For Sale', subline: '[Location] · [Price]', cta: 'Book Viewing', badge: 'HOT LISTING', body: '[Bedrooms] Bed · [Bathrooms] Bath · [Size]' },
  },
  {
    id: 'et9', name: 'YouTube Thumbnail', category: 'Video', icon: 'play-circle-filled',
    color: '#FF0000', bgColor: '#1a0000',
    fields: { headline: '[SHOCKING] [Topic]', subline: 'You Won\'t Believe This...', cta: 'Watch Now', badge: 'NEW VIDEO', body: '[Number] Things Nobody Tells You' },
  },
  {
    id: 'et10', name: 'LinkedIn Post Card', category: 'B2B', icon: 'work',
    color: '#0A66C2', bgColor: '#00061a',
    fields: { headline: '[Industry Insight]', subline: 'Here\'s what I learned after [years] in [field]', cta: 'Connect With Me', badge: 'THOUGHT LEADER', body: 'The #1 mistake [professionals] make...' },
  },
  {
    id: 'et11', name: 'Countdown Offer', category: 'E-Commerce', icon: 'timer',
    color: '#FF1744', bgColor: '#1a0000',
    fields: { headline: 'Offer Ends In:', subline: '48:00:00 Hours Remaining', cta: 'Buy Before It\'s Gone', badge: 'EXPIRES SOON', body: 'Only [Number] spots left at this price.' },
  },
  {
    id: 'et12', name: 'Before & After', category: 'Social Ads', icon: 'compare',
    color: '#00C853', bgColor: '#001a08',
    fields: { headline: 'Before vs After [Product]', subline: '[Timeframe] Transformation', cta: 'Start Your Journey', badge: 'REAL RESULTS', body: '[Customer] achieved [result] in [days] days.' },
  },
];

const COLOR_PALETTES = [
  { name: 'Gold Dark', accent: '#FFD700', bg: '#0a0a1a' },
  { name: 'Cyber Blue', accent: '#00D4FF', bg: '#00101a' },
  { name: 'Neon Purple', accent: '#7B2FBE', bg: '#0d001a' },
  { name: 'Fire Red', accent: '#FF1744', bg: '#1a0000' },
  { name: 'Matrix Green', accent: '#00C853', bg: '#001a08' },
  { name: 'Sunset Orange', accent: '#FF6B35', bg: '#1a0800' },
];

type TemplateFields = { headline: string; subline: string; cta: string; badge: string; body: string };

export default function TemplateEditorScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [selectedTemplate, setSelectedTemplate] = useState<typeof EDITOR_TEMPLATES[0] | null>(null);
  const [editedFields, setEditedFields] = useState<TemplateFields>({ headline: '', subline: '', cta: '', badge: '', body: '' });
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const categories = ['All', ...Array.from(new Set(EDITOR_TEMPLATES.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'All'
    ? EDITOR_TEMPLATES
    : EDITOR_TEMPLATES.filter(t => t.category === selectedCategory);

  const selectTemplate = (tmpl: typeof EDITOR_TEMPLATES[0]) => {
    setSelectedTemplate(tmpl);
    setEditedFields({ ...tmpl.fields });
    setSelectedPalette(0);
  };

  const currentAccent = selectedTemplate
    ? (COLOR_PALETTES[selectedPalette]?.accent || selectedTemplate.color)
    : Colors.primary;
  const currentBg = selectedTemplate
    ? (COLOR_PALETTES[selectedPalette]?.bg || selectedTemplate.bgColor)
    : Colors.background;

  const openPreview = () => {
    setPreviewVisible(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const exportTemplate = async () => {
    if (!selectedTemplate) return;
    const exportText = `=== ${selectedTemplate.name} ===\n\n${editedFields.badge}\n${editedFields.headline}\n${editedFields.subline}\n\n${editedFields.body}\n\n[${editedFields.cta}]\n\n--- Exported from E-S Marketing Hub ---`;
    try {
      await Share.share({ message: exportText });
    } catch {
      showAlert('Exported!', 'Template content ready to share.');
    }
  };

  const updateField = (key: keyof TemplateFields, value: string) => {
    setEditedFields(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => { if (selectedTemplate) { setSelectedTemplate(null); } else { router.back(); } }} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {selectedTemplate ? 'Template Editor' : 'Choose Template'}
          </Text>
          <Text style={styles.headerSub}>
            {selectedTemplate ? selectedTemplate.name : `${EDITOR_TEMPLATES.length} editable templates`}
          </Text>
        </View>
        {selectedTemplate && (
          <Pressable style={styles.previewHeaderBtn} onPress={openPreview}>
            <MaterialIcons name="preview" size={18} color={Colors.background} />
          </Pressable>
        )}
      </View>

      {!selectedTemplate ? (
        /* Template Gallery */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {categories.map(cat => (
              <Pressable key={cat}
                style={[styles.catChip, selectedCategory === cat && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
                onPress={() => setSelectedCategory(cat)}>
                <Text style={[styles.catChipText, selectedCategory === cat && { color: Colors.background }]}>{cat}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.galleryCount}>{filteredTemplates.length} templates</Text>

          <View style={styles.templateGrid}>
            {filteredTemplates.map(tmpl => (
              <Pressable key={tmpl.id}
                style={({ pressed }) => [styles.galleryCard, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
                onPress={() => selectTemplate(tmpl)}>
                <View style={[styles.galleryPreview, { backgroundColor: tmpl.bgColor }]}>
                  <View style={[styles.galleryBadge, { backgroundColor: tmpl.color }]}>
                    <Text style={styles.galleryBadgeText}>{tmpl.fields.badge}</Text>
                  </View>
                  <MaterialIcons name={tmpl.icon as any} size={36} color={tmpl.color} />
                  <Text style={[styles.galleryHeadline, { color: '#fff' }]} numberOfLines={1}>{tmpl.fields.headline}</Text>
                </View>
                <View style={styles.galleryInfo}>
                  <Text style={styles.galleryName}>{tmpl.name}</Text>
                  <Text style={[styles.galleryCat, { color: tmpl.color }]}>{tmpl.category}</Text>
                </View>
                <Pressable style={[styles.editBtn, { backgroundColor: tmpl.color }]} onPress={() => selectTemplate(tmpl)}>
                  <MaterialIcons name="edit" size={14} color={Colors.background} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </Pressable>
              </Pressable>
            ))}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        /* Editor Mode */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Live Preview Card */}
          <Pressable onPress={openPreview}>
            <Animated.View style={[styles.livePreview, { backgroundColor: currentBg, transform: [{ scale: scaleAnim }] }]}>
              <View style={[styles.previewBadge, { backgroundColor: currentAccent }]}>
                <Text style={[styles.previewBadgeText, { color: currentBg }]}>{editedFields.badge}</Text>
              </View>
              <MaterialIcons name={selectedTemplate.icon as any} size={48} color={currentAccent} />
              <Text style={[styles.previewHeadline, { color: '#fff' }]} numberOfLines={2}>{editedFields.headline}</Text>
              <Text style={[styles.previewSubline, { color: currentAccent + 'CC' }]} numberOfLines={1}>{editedFields.subline}</Text>
              <Text style={styles.previewBody} numberOfLines={2}>{editedFields.body}</Text>
              <View style={[styles.previewCta, { backgroundColor: currentAccent }]}>
                <Text style={[styles.previewCtaText, { color: currentBg }]}>{editedFields.cta}</Text>
              </View>
              <View style={styles.tapPreview}>
                <MaterialIcons name="touch-app" size={12} color={currentAccent + '88'} />
                <Text style={[styles.tapPreviewText, { color: currentAccent + '88' }]}>Tap to preview full</Text>
              </View>
            </Animated.View>
          </Pressable>

          {/* Color Palette */}
          <View style={styles.paletteSection}>
            <Text style={styles.paletteTitle}>Color Theme</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 4 }}>
              {COLOR_PALETTES.map((palette, i) => (
                <Pressable key={i}
                  style={[styles.paletteCard, selectedPalette === i && { borderColor: palette.accent }]}
                  onPress={() => setSelectedPalette(i)}>
                  <View style={[styles.paletteSwatch, { backgroundColor: palette.bg, borderColor: palette.accent + '66' }]}>
                    <View style={[styles.paletteAccentDot, { backgroundColor: palette.accent }]} />
                  </View>
                  <Text style={[styles.paletteName, selectedPalette === i && { color: palette.accent }]}>{palette.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Field Editors */}
          <View style={styles.fieldsCard}>
            <Text style={styles.fieldsTitle}>Edit Content</Text>

            {([
              { key: 'badge', label: 'Badge Label', icon: 'label' },
              { key: 'headline', label: 'Main Headline', icon: 'title' },
              { key: 'subline', label: 'Subheadline', icon: 'subtitles' },
              { key: 'body', label: 'Body Text', icon: 'article' },
              { key: 'cta', label: 'CTA Button Text', icon: 'ads-click' },
            ] as { key: keyof TemplateFields; label: string; icon: string }[]).map(field => (
              <View key={field.key}>
                <View style={styles.fieldLabelRow}>
                  <MaterialIcons name={field.icon as any} size={14} color={currentAccent} />
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                </View>
                <TextInput
                  style={[styles.fieldInput, field.key === 'body' && { height: 72 }]}
                  value={editedFields[field.key]}
                  onChangeText={val => updateField(field.key, val)}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                  placeholderTextColor={Colors.textMuted}
                  multiline={field.key === 'body'}
                />
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <Pressable style={[styles.exportBtn, { backgroundColor: currentAccent }]} onPress={exportTemplate}>
            <MaterialIcons name="share" size={20} color={currentBg} />
            <Text style={[styles.exportBtnText, { color: currentBg }]}>Export & Share Template</Text>
          </Pressable>

          <Pressable style={styles.previewBtn2} onPress={openPreview}>
            <MaterialIcons name="fullscreen" size={20} color={currentAccent} />
            <Text style={[styles.previewBtn2Text, { color: currentAccent }]}>Full Preview</Text>
          </Pressable>

          <Pressable style={styles.resetBtn}
            onPress={() => {
              showAlert('Reset Template', 'Reset all fields to original?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => setEditedFields({ ...selectedTemplate.fields }) },
              ]);
            }}>
            <MaterialIcons name="refresh" size={16} color={Colors.error} />
            <Text style={styles.resetBtnText}>Reset to Original</Text>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Full Preview Modal */}
      {selectedTemplate && (
        <Modal visible={previewVisible} animationType="fade" onRequestClose={() => setPreviewVisible(false)}>
          <View style={[styles.fullPreview, { backgroundColor: currentBg, paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.fullPreviewHeader}>
              <Pressable onPress={() => setPreviewVisible(false)} style={styles.closePreviewBtn}>
                <MaterialIcons name="close" size={22} color={Colors.text} />
              </Pressable>
              <Text style={styles.fullPreviewTitle}>Template Preview</Text>
              <Pressable onPress={exportTemplate} style={[styles.exportHeaderBtn, { backgroundColor: currentAccent }]}>
                <MaterialIcons name="share" size={16} color={currentBg} />
              </Pressable>
            </View>

            <View style={styles.fullPreviewContent}>
              <View style={[styles.fullBadge, { backgroundColor: currentAccent }]}>
                <Text style={[styles.fullBadgeText, { color: currentBg }]}>{editedFields.badge}</Text>
              </View>
              <MaterialIcons name={selectedTemplate.icon as any} size={80} color={currentAccent} />
              <Text style={[styles.fullHeadline, { color: '#FFFFFF' }]}>{editedFields.headline}</Text>
              <Text style={[styles.fullSubline, { color: currentAccent }]}>{editedFields.subline}</Text>
              <View style={styles.fullDivider} />
              <Text style={[styles.fullBody, { color: '#FFFFFF99' }]}>{editedFields.body}</Text>
              <Pressable style={[styles.fullCta, { backgroundColor: currentAccent }]} onPress={exportTemplate}>
                <Text style={[styles.fullCtaText, { color: currentBg }]}>{editedFields.cta}</Text>
              </Pressable>
              <Text style={[styles.fullBrand, { color: currentAccent + '66' }]}>
                Powered by E-S Marketing Hub
              </Text>
            </View>
          </View>
        </Modal>
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
  previewHeaderBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  scroll: { paddingHorizontal: Spacing.md },
  catRow: { gap: 8, paddingBottom: Spacing.sm },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  catChipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  galleryCount: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.sm },
  templateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  galleryCard: {
    width: '47%', backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.border,
  },
  galleryPreview: {
    height: 120, justifyContent: 'center', alignItems: 'center',
    padding: 10, position: 'relative', gap: 6,
  },
  galleryBadge: {
    position: 'absolute', top: 8, right: 8,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: BorderRadius.sm,
  },
  galleryBadgeText: { fontSize: 8, fontWeight: '800', color: '#000', letterSpacing: 0.5 },
  galleryHeadline: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  galleryInfo: { padding: 10 },
  galleryName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 2 },
  galleryCat: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    margin: 8, paddingVertical: 8, borderRadius: BorderRadius.md,
  },
  editBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.background },
  livePreview: {
    borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center',
    marginBottom: Spacing.md, borderWidth: 1, borderColor: '#ffffff11', minHeight: 220,
    justifyContent: 'center', gap: 10,
  },
  previewBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full, marginBottom: 4,
  },
  previewBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.extrabold, letterSpacing: 1 },
  previewHeadline: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, textAlign: 'center', lineHeight: 28 },
  previewSubline: { fontSize: FontSize.sm, textAlign: 'center', fontStyle: 'italic' },
  previewBody: { fontSize: FontSize.sm, color: '#ffffff66', textAlign: 'center', lineHeight: 18 },
  previewCta: {
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: BorderRadius.full, marginTop: 6,
  },
  previewCtaText: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold },
  tapPreview: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  tapPreviewText: { fontSize: FontSize.xs },
  paletteSection: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  paletteTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 10 },
  paletteCard: {
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, padding: 8,
  },
  paletteSwatch: {
    width: 48, height: 30, borderRadius: BorderRadius.sm, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  paletteAccentDot: { width: 16, height: 16, borderRadius: 8 },
  paletteName: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium },
  fieldsCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  fieldsTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, marginBottom: 6 },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  fieldInput: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, height: 48, fontSize: FontSize.md,
    color: Colors.text, borderWidth: 1, borderColor: Colors.border, paddingVertical: 10,
  },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 56, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm,
  },
  exportBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  previewBtn2: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 48, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.surfaceCard,
  },
  previewBtn2Text: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, marginBottom: Spacing.sm,
  },
  resetBtnText: { fontSize: FontSize.sm, color: Colors.error, fontWeight: FontWeight.semibold },
  fullPreview: { flex: 1 },
  fullPreviewHeader: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#ffffff11',
  },
  closePreviewBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#ffffff11', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  fullPreviewTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  exportHeaderBtn: {
    width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center',
  },
  fullPreviewContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  fullBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: BorderRadius.full, marginBottom: Spacing.md },
  fullBadgeText: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold, letterSpacing: 2 },
  fullHeadline: { fontSize: FontSize.hero, fontWeight: FontWeight.extrabold, textAlign: 'center', marginTop: Spacing.md, lineHeight: 44 },
  fullSubline: { fontSize: FontSize.lg, textAlign: 'center', marginTop: 8, fontStyle: 'italic' },
  fullDivider: { width: 60, height: 2, backgroundColor: '#ffffff22', marginVertical: Spacing.md },
  fullBody: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg },
  fullCta: { paddingHorizontal: 40, paddingVertical: 16, borderRadius: BorderRadius.full, marginBottom: Spacing.lg },
  fullCtaText: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, letterSpacing: 1 },
  fullBrand: { fontSize: FontSize.xs, letterSpacing: 1 },
});
