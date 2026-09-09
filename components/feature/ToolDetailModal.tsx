import React, { useState } from 'react';
import {
  View, Text, Modal, ScrollView,
  Pressable, StyleSheet, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { MarketingTool } from '@/constants/marketingData';
import { shareContent, buildToolShareText } from '@/services/shareService';

interface ToolDetailModalProps {
  tool: MarketingTool | null;
  visible: boolean;
  onClose: () => void;
}

export function ToolDetailModal({ tool, visible, onClose }: ToolDetailModalProps) {
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  if (!tool) return null;

  const handleShare = async () => {
    const message = buildToolShareText(tool.name, tool.description, tool.tips);
    await shareContent({ title: tool.name, message });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.handle} />

        <View style={[styles.header, { backgroundColor: tool.color + '22' }]}>
          <View style={[styles.iconCircle, { backgroundColor: tool.color + '33' }]}>
            <MaterialIcons name={tool.icon as any} size={32} color={tool.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.toolName}>{tool.name}</Text>
            <Text style={[styles.category, { color: tool.color }]}>{tool.category}</Text>
          </View>
          <Pressable onPress={handleShare} hitSlop={12} style={styles.shareIconBtn}>
            <MaterialIcons name="share" size={20} color={tool.color} />
          </Pressable>
          <Pressable onPress={onClose} hitSlop={12} style={{ marginLeft: 8 }}>
            <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}>{tool.description}</Text>

          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={[styles.usageBox, { borderLeftColor: tool.color }]}>
            <Text style={styles.usageText}>{tool.usage}</Text>
          </View>

          <Text style={styles.sectionTitle}>Pro Tips</Text>
          {tool.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: tool.color }]} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}

          <View style={styles.actionRow}>
            <Pressable style={[styles.launchBtn, { backgroundColor: tool.color, flex: 1 }]}>
              <MaterialIcons name="rocket-launch" size={18} color={Colors.background} />
              <Text style={styles.launchBtnText}>Launch Tool</Text>
            </Pressable>
            <Pressable style={[styles.shareBtn, { borderColor: tool.color }]} onPress={handleShare}>
              <MaterialIcons name="share" size={18} color={tool.color} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  category: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginTop: 2,
  },
  body: {
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 8,
    marginTop: Spacing.md,
  },
  desc: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  usageBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
  },
  usageText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  shareIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceElevated, justifyContent: 'center', alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row', gap: 10, marginTop: Spacing.xl, marginBottom: 8,
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: BorderRadius.lg,
  },
  launchBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
  shareBtn: {
    width: 52, height: 52, borderRadius: BorderRadius.lg,
    borderWidth: 2, justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
  },
});
