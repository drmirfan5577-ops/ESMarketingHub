import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  FlatList, Pressable, TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { TEMPLATES, TEMPLATE_CATEGORIES, Template } from '@/constants/marketingData';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { useAlert } from '@/template';

export default function TemplatesScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesSearch = search === '' ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some(tag => tag.includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  const handleUseTemplate = (template: Template) => {
    showAlert(
      `Use "${template.name}"`,
      `This ${template.type} template ${template.slides ? `has ${template.slides} slides. ` : ''}Ready to customize for your needs.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Template', onPress: () => showAlert('Template Opened', 'Editing mode coming in next update!') },
      ]
    );
  };

  const renderGridItem = ({ item }: { item: Template }) => (
    <Pressable
      style={({ pressed }) => [styles.gridCard, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
      onPress={() => handleUseTemplate(item)}
    >
      <View style={[styles.gridPreview, { backgroundColor: item.color + '22' }]}>
        <MaterialIcons name={item.icon as any} size={32} color={item.color} />
        {item.slides ? (
          <View style={styles.slidesBadge}>
            <Text style={styles.slidesText}>{item.slides} slides</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={2}>{item.name}</Text>
        <Text style={[styles.gridType, { color: item.color }]}>{item.type}</Text>
        <Text style={styles.gridCat}>{item.category}</Text>
      </View>
      <Pressable
        style={[styles.useBtn, { backgroundColor: item.color }]}
        onPress={() => handleUseTemplate(item)}
      >
        <Text style={styles.useBtnText}>Use</Text>
      </Pressable>
    </Pressable>
  );

  const renderListItem = ({ item }: { item: Template }) => (
    <Pressable
      style={({ pressed }) => [styles.listCard, pressed && { opacity: 0.85 }]}
      onPress={() => handleUseTemplate(item)}
    >
      <View style={[styles.listIcon, { backgroundColor: item.color + '22' }]}>
        <MaterialIcons name={item.icon as any} size={24} color={item.color} />
      </View>
      <View style={styles.listInfo}>
        <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.listDesc} numberOfLines={1}>{item.description}</Text>
        <View style={styles.listMeta}>
          <Text style={[styles.listType, { color: item.color }]}>{item.type}</Text>
          {item.slides ? <Text style={styles.listSlides}>{item.slides} slides</Text> : null}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
    </Pressable>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Templates</Text>
          <Text style={styles.headerSub}>{TEMPLATES.length} ready-to-use templates</Text>
        </View>
        <View style={styles.viewToggle}>
          <Pressable
            style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleActive]}
            onPress={() => setViewMode('grid')}
          >
            <MaterialIcons name="grid-view" size={18} color={viewMode === 'grid' ? Colors.background : Colors.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
            onPress={() => setViewMode('list')}
          >
            <MaterialIcons name="view-list" size={18} color={viewMode === 'list' ? Colors.background : Colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={20} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search templates..."
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.md, alignItems: 'center' }}>
          {TEMPLATE_CATEGORIES.map(cat => (
            <CategoryChip
              key={cat}
              label={cat}
              isSelected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
              color={Colors.primary}
            />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.resultCount}>{filtered.length} templates</Text>

      <FlatList
        key={viewMode}
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="layers-clear" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No templates found</Text>
          </View>
        }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtn: {
    padding: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.primary,
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
    gap: 8,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  catWrap: {
    height: 52,
    marginBottom: 4,
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
  columnWrapper: {
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  gridPreview: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  slidesBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  slidesText: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  gridInfo: {
    padding: 10,
  },
  gridName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
    lineHeight: 17,
  },
  gridType: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginBottom: 1,
  },
  gridCat: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  useBtn: {
    margin: 8,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  useBtnText: {
    color: Colors.background,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  listDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  listMeta: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  listType: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  listSlides: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
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
});
