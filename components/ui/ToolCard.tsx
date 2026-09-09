import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { MarketingTool } from '@/constants/marketingData';

interface ToolCardProps {
  tool: MarketingTool;
  onPress: () => void;
  compact?: boolean;
}

export const ToolCard = React.memo(({ tool, onPress, compact = false }: ToolCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: tool.color + '22' }]}>
        <MaterialIcons name={tool.icon as any} size={compact ? 20 : 26} color={tool.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{tool.name}</Text>
        <Text style={styles.desc} numberOfLines={compact ? 1 : 2}>{tool.description}</Text>
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { color: tool.color }]}>{tool.category}</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardCompact: {
    padding: Spacing.sm + 4,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  desc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
