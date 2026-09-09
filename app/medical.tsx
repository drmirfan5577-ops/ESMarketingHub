import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Modal, Animated, Share,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useAlert } from '@/template';
import { exportMedicalPDF } from '@/services/pdfExport';

const MEDICAL_CATEGORIES = [
  { id: 'cardiology', name: 'Cardiology', icon: 'favorite', color: '#FF1744' },
  { id: 'oncology', name: 'Oncology', icon: 'science', color: '#7B2FBE' },
  { id: 'neurology', name: 'Neurology', icon: 'psychology', color: '#00D4FF' },
  { id: 'pediatrics', name: 'Pediatrics', icon: 'child-care', color: '#00C853' },
  { id: 'orthopedics', name: 'Orthopedics', icon: 'accessibility', color: '#FF6B35' },
  { id: 'dermatology', name: 'Dermatology', icon: 'spa', color: '#FFD700' },
  { id: 'pharma', name: 'Pharmaceutical', icon: 'medication', color: '#00D4FF' },
  { id: 'general', name: 'General Practice', icon: 'local-hospital', color: '#00C853' },
];

const SLIDE_TEMPLATES = {
  cardiology: [
    { title: 'Title Slide', type: 'title', desc: 'Presentation title, presenter name, institution, date', icon: 'title', color: '#FF1744' },
    { title: 'Executive Summary', type: 'summary', desc: 'Key findings and recommendations at a glance', icon: 'summarize', color: '#FF1744' },
    { title: 'Cardiovascular Anatomy', type: 'visual', desc: 'Heart anatomy diagram with labeled structures', icon: 'favorite', color: '#FF1744' },
    { title: 'Disease Pathophysiology', type: 'content', desc: 'Mechanism of disease with visual flow chart', icon: 'biotech', color: '#FF6B35' },
    { title: 'Clinical Data / Statistics', type: 'data', desc: 'Prevalence, incidence, mortality statistics with charts', icon: 'bar-chart', color: '#00D4FF' },
    { title: 'Diagnostic Criteria', type: 'list', desc: 'ACC/AHA diagnostic criteria with guidelines', icon: 'checklist', color: '#00C853' },
    { title: 'Treatment Algorithm', type: 'visual', desc: 'Step-by-step treatment decision tree', icon: 'account-tree', color: '#7B2FBE' },
    { title: 'Clinical Trial Results', type: 'data', desc: 'Key trial outcomes, hazard ratios, p-values', icon: 'science', color: '#00D4FF' },
    { title: 'Case Study', type: 'case', desc: 'Patient presentation, workup, management, outcome', icon: 'person', color: '#FF6B35' },
    { title: 'Pharmacotherapy Options', type: 'table', desc: 'Drug classes, mechanisms, dosing comparison table', icon: 'medication', color: '#7B2FBE' },
    { title: 'Patient Education Points', type: 'list', desc: 'Lifestyle modifications, adherence strategies', icon: 'school', color: '#00C853' },
    { title: 'Future Directions / Q&A', type: 'closing', desc: 'Research pipeline, emerging therapies, references', icon: 'explore', color: '#FFD700' },
  ],
  general: [
    { title: 'Title & Introduction', type: 'title', desc: 'Topic, presenter credentials, agenda overview', icon: 'title', color: '#00C853' },
    { title: 'Epidemiology Overview', type: 'data', desc: 'Prevalence data, demographics, trends', icon: 'public', color: '#00D4FF' },
    { title: 'Etiology & Risk Factors', type: 'list', desc: 'Causative factors and risk stratification', icon: 'warning', color: '#FF6B35' },
    { title: 'Clinical Presentation', type: 'content', desc: 'Signs, symptoms, physical examination findings', icon: 'person', color: '#7B2FBE' },
    { title: 'Diagnostic Workup', type: 'list', desc: 'Labs, imaging, special tests with rationale', icon: 'biotech', color: '#00D4FF' },
    { title: 'Differential Diagnosis', type: 'table', desc: 'DDx comparison table with distinguishing features', icon: 'compare', color: '#FF1744' },
    { title: 'Management Plan', type: 'content', desc: 'Pharmacological and non-pharmacological treatment', icon: 'healing', color: '#00C853' },
    { title: 'Prognosis & Follow-up', type: 'data', desc: 'Outcomes data, monitoring schedule, referral criteria', icon: 'trending-up', color: '#FFD700' },
    { title: 'Patient Counseling', type: 'list', desc: 'Education points, lifestyle advice, red flags', icon: 'record-voice-over', color: '#FF6B35' },
    { title: 'References & Resources', type: 'closing', desc: 'Evidence base, guidelines, further reading', icon: 'library-books', color: '#7B2FBE' },
  ],
};

export default function MedicalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [presentationTitle, setPresentationTitle] = useState('');
  const [presenterName, setPresenterName] = useState('');
  const [institution, setInstitution] = useState('');
  const [selectedSlides, setSelectedSlides] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [audience, setAudience] = useState<'physicians' | 'patients' | 'students'>('physicians');

  const currentCategory = MEDICAL_CATEGORIES.find(c => c.id === selectedCategory);
  const slides = selectedCategory === 'cardiology'
    ? SLIDE_TEMPLATES.cardiology
    : selectedCategory
      ? SLIDE_TEMPLATES.general
      : [];

  const toggleSlide = (title: string) => {
    setSelectedSlides(prev =>
      prev.includes(title) ? prev.filter(s => s !== title) : [...prev, title]
    );
  };

  const selectAll = () => {
    if (selectedSlides.length === slides.length) {
      setSelectedSlides([]);
    } else {
      setSelectedSlides(slides.map(s => s.title));
    }
  };

  const buildPresentation = () => {
    if (!presentationTitle) { showAlert('Missing Info', 'Please enter a presentation title first.'); return; }
    if (selectedSlides.length === 0) { showAlert('No Slides', 'Select at least one slide template.'); return; }
    setCurrentSlideIndex(0);
    setPreviewVisible(true);
  };

  const activeSlides = slides.filter(s => selectedSlides.includes(s.title));

  const handleExportPDF = async () => {
    if (!presentationTitle) { showAlert('Missing Info', 'Please enter a presentation title first.'); return; }
    if (activeSlides.length === 0) { showAlert('No Slides', 'Please select at least one slide.'); return; }
    showAlert('Exporting PDF', 'Generating your presentation PDF...');
    const success = await exportMedicalPDF(
      presentationTitle,
      presenterName,
      institution,
      audience,
      currentCategory?.name || 'General Practice',
      activeSlides.map(s => ({ title: s.title, desc: s.desc, type: s.type })),
    );
    if (!success) showAlert('Export Failed', 'Could not export PDF. Please try again.');
  };

  const handleSharePresentation = async () => {
    const slideList = activeSlides.map((s, i) => `${i + 1}. ${s.title}`).join('\n');
    const shareText = `📋 Medical Presentation: ${presentationTitle}\n\nSpecialty: ${currentCategory?.name}\nPresenter: ${presenterName || 'N/A'}\nInstitution: ${institution || 'N/A'}\nAudience: ${audience}\nSlides: ${activeSlides.length}\n\n${slideList}\n\n— E-S Marketing Hub Medical Builder`;
    try { await Share.share({ message: shareText }); } catch {}
  };

  const TYPE_ICONS: Record<string, string> = {
    title: 'title', summary: 'summarize', visual: 'image',
    content: 'article', data: 'bar-chart', list: 'list',
    table: 'table-chart', case: 'person', closing: 'flag',
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Medical Presentation Builder</Text>
          <Text style={styles.headerSub}>Professional clinical presentations</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Step 1: Category */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
            <Text style={styles.stepTitle}>Select Medical Specialty</Text>
          </View>
          <View style={styles.categoryGrid}>
            {MEDICAL_CATEGORIES.map(cat => (
              <Pressable
                key={cat.id}
                style={[styles.catItem, selectedCategory === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '11' }]}
                onPress={() => { setSelectedCategory(cat.id); setSelectedSlides([]); }}
              >
                <View style={[styles.catIcon, { backgroundColor: cat.color + '22' }]}>
                  <MaterialIcons name={cat.icon as any} size={22} color={cat.color} />
                </View>
                <Text style={[styles.catName, selectedCategory === cat.id && { color: cat.color }]}>{cat.name}</Text>
                {selectedCategory === cat.id && (
                  <MaterialIcons name="check-circle" size={14} color={cat.color} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Step 2: Details */}
        {selectedCategory !== '' && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
              <Text style={styles.stepTitle}>Presentation Details</Text>
            </View>

            <Text style={styles.fieldLabel}>Presentation Title *</Text>
            <TextInput style={styles.field} value={presentationTitle} onChangeText={setPresentationTitle}
              placeholder="e.g. Management of Acute Coronary Syndrome" placeholderTextColor={Colors.textMuted} />

            <Text style={styles.fieldLabel}>Presenter Name</Text>
            <TextInput style={styles.field} value={presenterName} onChangeText={setPresenterName}
              placeholder="Dr. [Your Name], MD" placeholderTextColor={Colors.textMuted} />

            <Text style={styles.fieldLabel}>Institution / Conference</Text>
            <TextInput style={styles.field} value={institution} onChangeText={setInstitution}
              placeholder="Hospital / University / Conference Name" placeholderTextColor={Colors.textMuted} />

            <Text style={styles.fieldLabel}>Target Audience</Text>
            <View style={styles.audienceRow}>
              {(['physicians', 'patients', 'students'] as const).map(aud => (
                <Pressable key={aud} style={[styles.audBtn, audience === aud && styles.audBtnActive]}
                  onPress={() => setAudience(aud)}>
                  <Text style={[styles.audText, audience === aud && styles.audTextActive]}>
                    {aud.charAt(0).toUpperCase() + aud.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Slide Selection */}
        {selectedCategory !== '' && slides.length > 0 && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
              <Text style={styles.stepTitle}>Select Slides ({selectedSlides.length}/{slides.length})</Text>
              <Pressable onPress={selectAll} style={styles.selectAllBtn}>
                <Text style={styles.selectAllText}>{selectedSlides.length === slides.length ? 'Deselect All' : 'Select All'}</Text>
              </Pressable>
            </View>
            {slides.map((slide, i) => (
              <Pressable key={i} style={[styles.slideItem, selectedSlides.includes(slide.title) && styles.slideItemActive]}
                onPress={() => toggleSlide(slide.title)}>
                <View style={[styles.slideIconWrap, { backgroundColor: slide.color + '22' }]}>
                  <MaterialIcons name={(TYPE_ICONS[slide.type] || 'article') as any} size={20} color={slide.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.slideName}>{slide.title}</Text>
                  <Text style={styles.slideDesc} numberOfLines={1}>{slide.desc}</Text>
                </View>
                <View style={[styles.slideCheck, selectedSlides.includes(slide.title) && styles.slideCheckActive]}>
                  {selectedSlides.includes(slide.title) && <MaterialIcons name="check" size={14} color={Colors.background} />}
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Build Button */}
        {selectedSlides.length > 0 && (
          <Pressable style={({ pressed }) => [styles.buildBtn, pressed && { opacity: 0.9 }]} onPress={buildPresentation}>
            <MaterialIcons name="slideshow" size={22} color={Colors.background} />
            <Text style={styles.buildBtnText}>Preview Presentation ({selectedSlides.length} slides)</Text>
          </Pressable>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Presentation Preview Modal */}
      <Modal visible={previewVisible} animationType="fade" onRequestClose={() => setPreviewVisible(false)}>
        <View style={[styles.previewModal, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
          {/* Preview Header */}
          <View style={styles.previewHeader}>
            <Pressable onPress={() => setPreviewVisible(false)} style={styles.closePreview}>
              <MaterialIcons name="close" size={22} color={Colors.text} />
            </Pressable>
            <Text style={styles.previewHeaderTitle} numberOfLines={1}>{presentationTitle || 'Medical Presentation'}</Text>
            <Text style={styles.slideCounter}>{currentSlideIndex + 1}/{activeSlides.length}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentSlideIndex + 1) / activeSlides.length) * 100}%` }]} />
          </View>

          {/* Slide Display */}
          {activeSlides[currentSlideIndex] && (
            <View style={styles.slideDisplay}>
              <View style={[styles.slideDisplayIcon, { backgroundColor: activeSlides[currentSlideIndex].color + '22' }]}>
                <MaterialIcons
                  name={(TYPE_ICONS[activeSlides[currentSlideIndex].type] || 'article') as any}
                  size={48} color={activeSlides[currentSlideIndex].color}
                />
              </View>

              <View style={[styles.slideTypeBadge, { backgroundColor: activeSlides[currentSlideIndex].color }]}>
                <Text style={styles.slideTypeBadgeText}>{activeSlides[currentSlideIndex].type.toUpperCase()}</Text>
              </View>

              <Text style={styles.slideDisplayTitle}>{activeSlides[currentSlideIndex].title}</Text>
              <Text style={styles.slideDisplayDesc}>{activeSlides[currentSlideIndex].desc}</Text>

              {currentCategory && (
                <View style={styles.slideSpecialty}>
                  <MaterialIcons name={currentCategory.icon as any} size={16} color={currentCategory.color} />
                  <Text style={[styles.slideSpecialtyText, { color: currentCategory.color }]}>{currentCategory.name}</Text>
                  <Text style={styles.slideAudience}>• {audience}</Text>
                </View>
              )}

              <View style={styles.slidePresenter}>
                {presenterName !== '' && <Text style={styles.slidePresenterText}>{presenterName}</Text>}
                {institution !== '' && <Text style={styles.slideInstitution}>{institution}</Text>}
              </View>
            </View>
          )}

          {/* Navigation */}
          <View style={styles.slideNav}>
            <Pressable
              style={[styles.navBtn, currentSlideIndex === 0 && styles.navBtnDisabled]}
              onPress={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
            >
              <MaterialIcons name="chevron-left" size={28} color={currentSlideIndex === 0 ? Colors.textMuted : Colors.text} />
              <Text style={[styles.navText, currentSlideIndex === 0 && { color: Colors.textMuted }]}>Previous</Text>
            </Pressable>

            <View style={styles.exportBtnRow}>
              <Pressable style={styles.exportBtn} onPress={handleExportPDF}>
                <MaterialIcons name="picture-as-pdf" size={18} color={Colors.background} />
                <Text style={styles.exportBtnText}>PDF</Text>
              </Pressable>
              <Pressable style={styles.sharePreviewBtn} onPress={handleSharePresentation}>
                <MaterialIcons name="share" size={18} color={Colors.primary} />
              </Pressable>
            </View>

            <Pressable
              style={[styles.navBtn, currentSlideIndex === activeSlides.length - 1 && styles.navBtnDisabled]}
              onPress={() => setCurrentSlideIndex(prev => Math.min(activeSlides.length - 1, prev + 1))}
              disabled={currentSlideIndex === activeSlides.length - 1}
            >
              <Text style={[styles.navText, currentSlideIndex === activeSlides.length - 1 && { color: Colors.textMuted }]}>Next</Text>
              <MaterialIcons name="chevron-right" size={28} color={currentSlideIndex === activeSlides.length - 1 ? Colors.textMuted : Colors.text} />
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
  scroll: { paddingHorizontal: Spacing.md },
  stepCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.md },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  stepNumText: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold, color: Colors.background },
  stepTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, flex: 1 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    padding: 10, borderWidth: 1, borderColor: Colors.border, width: '48%',
  },
  catIcon: { width: 36, height: 36, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  catName: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: 6, marginTop: 12 },
  field: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, height: 48, fontSize: FontSize.md,
    color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  audienceRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  audBtn: {
    flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center',
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  audBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  audText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  audTextActive: { color: Colors.background, fontWeight: FontWeight.bold },
  selectAllBtn: {
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: Colors.primary + '22', borderRadius: BorderRadius.full,
  },
  selectAllText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold },
  slideItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md,
    padding: 12, marginBottom: 6, borderWidth: 1, borderColor: Colors.border,
  },
  slideItemActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '0D' },
  slideIconWrap: { width: 40, height: 40, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  slideName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 2 },
  slideDesc: { fontSize: FontSize.xs, color: Colors.textMuted },
  slideCheck: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  slideCheckActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  buildBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, height: 56, borderRadius: BorderRadius.lg, marginBottom: Spacing.md,
  },
  buildBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.background },
  previewModal: { flex: 1, backgroundColor: '#050510' },
  previewHeader: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#ffffff22',
  },
  closePreview: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#ffffff11', justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  previewHeaderTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  slideCounter: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.bold },
  progressBar: { height: 3, backgroundColor: '#ffffff11', marginHorizontal: Spacing.md },
  progressFill: { height: 3, backgroundColor: Colors.primary, borderRadius: 2 },
  slideDisplay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl,
  },
  slideDisplayIcon: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg,
  },
  slideTypeBadge: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full, marginBottom: 16,
  },
  slideTypeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.extrabold, color: Colors.background, letterSpacing: 1.5 },
  slideDisplayTitle: {
    fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text,
    textAlign: 'center', marginBottom: 12,
  },
  slideDisplayDesc: {
    fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 24, marginBottom: Spacing.lg,
  },
  slideSpecialty: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  slideSpecialtyText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  slideAudience: { fontSize: FontSize.sm, color: Colors.textMuted },
  slidePresenter: { alignItems: 'center', marginTop: 8 },
  slidePresenterText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  slideInstitution: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  slideNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: '#ffffff22',
  },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 10 },
  navBtnDisabled: { opacity: 0.4 },
  navText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  exportBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: BorderRadius.lg,
  },
  exportBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  sharePreviewBtn: {
    width: 44, height: 44, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary + '22', borderWidth: 1, borderColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
});
