import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Modal, Animated, Share,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { PROMPT_TEMPLATES, PROMPT_CATEGORIES } from '@/constants/promptsData';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { useAlert } from '@/template';

export default function PromptsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedPrompt, setSelectedPrompt] = useState<typeof PROMPT_TEMPLATES[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filledVars, setFilledVars] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showGenerated, setShowGenerated] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filtered = useMemo(() => {
    return PROMPT_TEMPLATES.filter(p => {
      const matchCat = selectedCat === 'All' || p.category === selectedCat;
      const matchSearch = search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.useCase.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, selectedCat]);

  const openPrompt = (prompt: typeof PROMPT_TEMPLATES[0]) => {
    setSelectedPrompt(prompt);
    const initVars: Record<string, string> = {};
    prompt.variables.forEach(v => { initVars[v] = ''; });
    setFilledVars(initVars);
    setGeneratedPrompt('');
    setShowGenerated(false);
    setModalVisible(true);
  };

  const generatePrompt = () => {
    if (!selectedPrompt) return;
    let result = selectedPrompt.prompt;
    Object.entries(filledVars).forEach(([key, val]) => {
      result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), val || `[${key}]`);
    });
    setGeneratedPrompt(result);
    setShowGenerated(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  const copyPrompt = async () => {
    try {
      await Share.share({ message: generatedPrompt });
    } catch {
      showAlert('Copied!', 'Prompt ready to use in any AI tool.');
    }
  };

  const CAT_COLORS: Record<string, string> = {
    'Social Media': '#E1306C', Email: '#FF6B35', Product: '#00C853',
    Medical: '#00C853', 'Video Script': '#FF0000', SEO: '#4285F4',
    'App Store': '#FF6B35', Game: '#7B2FBE', Local: '#7B2FBE',
    B2B: '#0A66C2', 'E-Commerce': '#FF1744',
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>AI Prompts Generator</Text>
          <Text style={styles.headerSub}>{PROMPT_TEMPLATES.length} ready-to-use marketing prompts</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={20} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search prompts..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search !== '' && (
          <Pressable onPress={() => setSearch('')}>
            <MaterialIcons name="close" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Categories */}
      <View style={styles.catWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
          {PROMPT_CATEGORIES.map(cat => (
            <CategoryChip key={cat} label={cat} isSelected={selectedCat === cat}
              onPress={() => setSelectedCat(cat)} color={CAT_COLORS[cat] || Colors.primary} />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.count}>{filtered.length} prompts</Text>

      {/* Prompts List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.map(prompt => (
          <Pressable
            key={prompt.id}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
            onPress={() => openPrompt(prompt)}
          >
            <View style={[styles.cardIcon, { backgroundColor: (CAT_COLORS[prompt.category] || Colors.primary) + '22' }]}>
              <MaterialIcons name={prompt.icon as any} size={26} color={CAT_COLORS[prompt.category] || Colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={1}>{prompt.title}</Text>
              <Text style={styles.cardUseCase} numberOfLines={1}>{prompt.useCase}</Text>
              <View style={styles.cardMeta}>
                <View style={[styles.catBadge, { backgroundColor: (CAT_COLORS[prompt.category] || Colors.primary) + '22' }]}>
                  <Text style={[styles.catBadgeText, { color: CAT_COLORS[prompt.category] || Colors.primary }]}>
                    {prompt.category}
                  </Text>
                </View>
                <Text style={styles.varCount}>{prompt.variables.length} variables</Text>
              </View>
            </View>
            <MaterialIcons name="auto-fix-high" size={20} color={Colors.primary} />
          </Pressable>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={[styles.modalRoot, { paddingTop: insets.top }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: (CAT_COLORS[selectedPrompt.category] || Colors.primary) + '22' }]}>
                <MaterialIcons name={selectedPrompt.icon as any} size={28} color={CAT_COLORS[selectedPrompt.category] || Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle} numberOfLines={2}>{selectedPrompt.title}</Text>
                <Text style={[styles.modalCat, { color: CAT_COLORS[selectedPrompt.category] || Colors.primary }]}>
                  {selectedPrompt.category} · {selectedPrompt.useCase}
                </Text>
              </View>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={12}>
                <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Base Prompt Preview */}
              <Text style={styles.sectionLabel}>Prompt Template</Text>
              <View style={styles.promptPreview}>
                <Text style={styles.promptPreviewText}>{selectedPrompt.prompt}</Text>
              </View>

              {/* Variable Inputs */}
              <Text style={styles.sectionLabel}>Fill in Variables</Text>
              {selectedPrompt.variables.map(variable => (
                <View key={variable} style={styles.varInput}>
                  <Text style={styles.varLabel}>[{variable}]</Text>
                  <TextInput
                    style={styles.varField}
                    placeholder={`Enter ${variable.toLowerCase().replace(/_/g, ' ')}...`}
                    placeholderTextColor={Colors.textMuted}
                    value={filledVars[variable] || ''}
                    onChangeText={val => setFilledVars(prev => ({ ...prev, [variable]: val }))}
                    multiline={variable.includes('FEATURES') || variable.includes('LIST')}
                  />
                </View>
              ))}

              {/* Generate Button */}
              <Pressable
                style={({ pressed }) => [styles.generateBtn, pressed && { opacity: 0.9 }]}
                onPress={generatePrompt}
              >
                <MaterialIcons name="auto-fix-high" size={20} color={Colors.background} />
                <Text style={styles.generateBtnText}>Generate Prompt</Text>
              </Pressable>

              {/* Generated Output */}
              {showGenerated && (
                <Animated.View style={[styles.outputBox, { opacity: fadeAnim }]}>
                  <View style={styles.outputHeader}>
                    <Text style={styles.outputTitle}>Your Ready Prompt</Text>
                    <Pressable style={styles.copyBtn} onPress={copyPrompt}>
                      <MaterialIcons name="share" size={16} color={Colors.primary} />
                      <Text style={styles.copyBtnText}>Copy & Share</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.outputText}>{generatedPrompt}</Text>
                  <View style={styles.aiHint}>
                    <MaterialIcons name="tips-and-updates" size={14} color={Colors.primary} />
                    <Text style={styles.aiHintText}>Paste this into ChatGPT, Claude, Gemini, or any AI tool</Text>
                  </View>
                </Animated.View>
              )}

              <View style={{ height: 40 }} />
            </ScrollView>
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
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md, marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md, borderWidth: 1, borderColor: Colors.border, height: 48,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  catWrap: { height: 52, marginBottom: 4 },
  catContent: { paddingHorizontal: Spacing.md, alignItems: 'center' },
  count: { fontSize: FontSize.sm, color: Colors.textMuted, paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  scroll: { paddingHorizontal: Spacing.md },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  cardIcon: { width: 52, height: 52, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 2 },
  cardUseCase: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  catBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  varCount: { fontSize: FontSize.xs, color: Colors.textMuted },
  modalRoot: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalIcon: { width: 48, height: 48, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  modalCat: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginTop: 2 },
  modalScroll: { flex: 1, paddingHorizontal: Spacing.md },
  sectionLabel: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text,
    marginTop: Spacing.lg, marginBottom: Spacing.sm,
  },
  promptPreview: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  promptPreviewText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  varInput: { marginBottom: Spacing.md },
  varLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary, marginBottom: 6 },
  varField: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, minHeight: 48,
  },
  generateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg, marginTop: Spacing.sm,
  },
  generateBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  outputBox: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 2, borderColor: Colors.primary + '44', marginTop: Spacing.lg,
  },
  outputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  outputTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary + '22', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full,
  },
  copyBtnText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  outputText: { fontSize: FontSize.sm, color: Colors.text, lineHeight: 22 },
  aiHint: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: Spacing.md, padding: Spacing.sm,
    backgroundColor: Colors.primary + '11', borderRadius: BorderRadius.md,
  },
  aiHintText: { fontSize: FontSize.xs, color: Colors.textSecondary, flex: 1 },
});
