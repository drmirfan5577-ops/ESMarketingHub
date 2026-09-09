import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize, Spacing } from '@/constants/theme';

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  color?: string;
}

export function CategoryChip({ label, isSelected, onPress, color = Colors.primary }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        isSelected && { backgroundColor: color, borderColor: color },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  labelSelected: {
    color: Colors.background,
    fontWeight: '700',
  },
});
