import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { Template } from '@/constants/marketingData';

interface TemplateCardProps {
  template: Template;
  onPress: () => void;
}

export const TemplateCard = React.memo(({ template, onPress }: TemplateCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
      ]}
    >
      <View style={[styles.preview, { backgroundColor: template.color + '22', borderBottomColor: template.color + '44' }]}>
        <MaterialIcons name={template.icon as any} size={36} color={template.color} />
        {template.slides && (
          <View style={styles.slidesBadge}>
            <Text style={styles.slidesText}>{template.slides} slides</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{template.name}</Text>
        <Text style={styles.type}>{template.type}</Text>
        <View style={styles.tags}>
          {template.tags.slice(0, 2).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <Pressable style={[styles.useBtn, { backgroundColor: template.color }]}>
        <Text style={styles.useBtnText}>Use</Text>
      </Pressable>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  preview: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  slidesBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.overlay,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  slidesText: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  info: {
    padding: Spacing.sm + 4,
    flex: 1,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  type: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: 9,
    color: Colors.textSecondary,
  },
  useBtn: {
    margin: Spacing.sm,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  useBtnText: {
    color: Colors.background,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
