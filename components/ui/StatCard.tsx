import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';

interface StatCardProps {
  value: string;
  label: string;
  icon: string;
  color: string;
}

export function StatCard({ value, label, icon, color }: StatCardProps) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <MaterialIcons name={icon as any} size={22} color={color} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 4,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    marginTop: 6,
    marginBottom: 2,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
});
