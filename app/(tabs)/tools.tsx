import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TextInput, Pressable, FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { MARKETING_TOOLS, TOOL_CATEGORIES, MarketingTool } from '@/constants/marketingData';
import { ToolCard } from '@/components/ui/ToolCard';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { ToolDetailModal } from '@/components/feature/ToolDetailModal';

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState<MarketingTool | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredTools = useMemo(() => {
    return MARKETING_TOOLS.filter(t => {
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesSearch = search === '' ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const openTool = useCallback((tool: MarketingTool) => {
    setSelectedTool(tool);
    setModalVisible(true);
  }, []);

  const categoryColors: Record<string, string> = {
    SEO: Colors.accent2,
    'Social Media': Colors.accent3,
    Email: Colors.accent1,
    Content: Colors.accent4,
    Video: Colors.accent5,
    Design: Colors.primary,
    Analytics: Colors.accent2,
    Apps: Colors.accent1,
    Local: Colors.accent3,
    Medical: Colors.accent4,
    'E-Commerce': Colors.primary,
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketing Tools</Text>
        <Text style={styles.headerSub}>{MARKETING_TOOLS.length} professional tools</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tools..."
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
          {TOOL_CATEGORIES.map(cat => (
            <CategoryChip
              key={cat}
              label={cat}
              isSelected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
              color={categoryColors[cat] || Colors.primary}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results count */}
      <Text style={styles.resultCount}>
        {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
      </Text>

      {/* Tools List */}
      <FlatList
        data={filteredTools}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ToolCard tool={item} onPress={() => openTool(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="search-off" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No tools found</Text>
            <Text style={styles.emptySub}>Try a different search or category</Text>
          </View>
        }
      />

      <ToolDetailModal
        tool={selectedTool}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    height: 48,
  },
  catWrap: {
    height: 52,
    marginBottom: 4,
  },
  catContent: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  resultCount: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 24,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  emptySub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
