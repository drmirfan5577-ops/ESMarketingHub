import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Pressable, TextInput, Animated, Easing,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { AD_ANIMATIONS, AD_FORMATS } from '@/constants/marketingData';
import { useAlert } from '@/template';

export default function AdsScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [adText, setAdText] = useState('Your Amazing Product');
  const [subText, setSubText] = useState('Limited Time Offer - Act Now!');
  const [ctaText, setCtaText] = useState('GET IT NOW');
  const [selectedAnimation, setSelectedAnimation] = useState('a1');
  const [selectedFormat, setSelectedFormat] = useState('f1');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const animVal = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const AD_THEMES = [
    { bg: '#0a0a1a', accent: '#FFD700', name: 'Gold Dark' },
    { bg: '#0d1f2d', accent: '#00D4FF', name: 'Cyber Blue' },
    { bg: '#1a0d2e', accent: '#7B2FBE', name: 'Neon Purple' },
    { bg: '#1a0d0d', accent: '#FF1744', name: 'Fire Red' },
    { bg: '#0d1a0d', accent: '#00C853', name: 'Matrix Green' },
    { bg: '#1a1500', accent: '#FF6B35', name: 'Sunset Orange' },
  ];

  const currentTheme = AD_THEMES[selectedTheme];

  const startAnimation = () => {
    setIsPlaying(true);
    animVal.setValue(0);
    glowAnim.setValue(0);
    bounceAnim.setValue(0);

    Animated.parallel([
      Animated.timing(animVal, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -6, duration: 400, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 400, easing: Easing.bounce, useNativeDriver: true }),
        ])
      ),
    ]).start();

    setTimeout(() => setIsPlaying(false), 3000);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    animVal.setValue(1);
    glowAnim.stopAnimation();
    bounceAnim.stopAnimation();
  };

  const selectedAnim = AD_ANIMATIONS.find(a => a.id === selectedAnimation);
  const selectedFmt = AD_FORMATS.find(f => f.id === selectedFormat);

  const getAnimStyle = () => {
    switch (selectedAnimation) {
      case 'a1': return {
        transform: [{ translateX: animVal.interpolate({ inputRange: [0, 1], outputRange: [-120, 0] }) }],
        opacity: animVal,
      };
      case 'a2': return {
        transform: [{ scale: animVal.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.15, 1] }) }],
        opacity: animVal,
      };
      case 'a3': return { opacity: animVal };
      case 'a4': return {
        transform: [{ translateY: bounceAnim }],
        opacity: animVal,
      };
      case 'a5': return {
        transform: [{ rotate: animVal.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
        opacity: animVal,
      };
      default: return {
        transform: [{ scale: animVal.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
        opacity: animVal,
      };
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ad Generator</Text>
          <Text style={styles.headerSub}>Digital ads with animations & effects</Text>
        </View>

        {/* Ad Preview */}
        <View style={styles.previewSection}>
          <View style={[styles.previewCanvas, { backgroundColor: currentTheme.bg }]}>
            {/* Decorative elements */}
            <Animated.View style={[styles.decorCircle, { borderColor: currentTheme.accent + '44' }, getAnimStyle()]} />
            <View style={[styles.decorLine, { backgroundColor: currentTheme.accent + '33' }]} />

            <Animated.View style={[styles.previewContent, getAnimStyle()]}>
              <Animated.View style={[styles.previewBadge, { backgroundColor: currentTheme.accent }]}>
                <Text style={styles.previewBadgeText}>SPECIAL OFFER</Text>
              </Animated.View>
              <Text style={[styles.previewMainText, { color: Colors.text }]} numberOfLines={2}>
                {adText || 'Your Amazing Product'}
              </Text>
              <Text style={[styles.previewSubText, { color: currentTheme.accent }]} numberOfLines={1}>
                {subText || 'Limited Time Offer'}
              </Text>
              <Animated.View
                style={[styles.previewCta, { backgroundColor: currentTheme.accent },
                  { opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }
                ]}
              >
                <Text style={[styles.previewCtaText, { color: currentTheme.bg }]}>
                  {ctaText || 'ACT NOW'}
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Format badge */}
            <View style={styles.formatBadge}>
              <Text style={styles.formatBadgeText}>{selectedFmt?.name}</Text>
            </View>
          </View>

          {/* Play Controls */}
          <View style={styles.controls}>
            <Pressable
              style={({ pressed }) => [styles.playBtn, pressed && { opacity: 0.8 }]}
              onPress={isPlaying ? stopAnimation : startAnimation}
            >
              <MaterialIcons
                name={isPlaying ? 'stop' : 'play-arrow'}
                size={22}
                color={Colors.background}
              />
              <Text style={styles.playBtnText}>{isPlaying ? 'Stop' : 'Preview Animation'}</Text>
            </Pressable>
            <Pressable
              style={styles.exportBtn}
              onPress={() => showAlert('Export Ad', 'Your ad will be exported in HD quality. Full export coming soon!')}
            >
              <MaterialIcons name="download" size={20} color={Colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Ad Text Inputs */}
        <Text style={styles.sectionTitle}>Ad Content</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Headline</Text>
          <TextInput
            style={styles.input}
            value={adText}
            onChangeText={setAdText}
            placeholder="Enter your main headline"
            placeholderTextColor={Colors.textMuted}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Sub-headline</Text>
          <TextInput
            style={styles.input}
            value={subText}
            onChangeText={setSubText}
            placeholder="Enter supporting text"
            placeholderTextColor={Colors.textMuted}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Call to Action</Text>
          <TextInput
            style={styles.input}
            value={ctaText}
            onChangeText={setCtaText}
            placeholder="e.g. BUY NOW, LEARN MORE"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Color Themes */}
        <Text style={styles.sectionTitle}>Color Theme</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themesScroll}>
          {AD_THEMES.map((theme, i) => (
            <Pressable
              key={i}
              style={[styles.themeChip, selectedTheme === i && styles.themeChipActive]}
              onPress={() => setSelectedTheme(i)}
            >
              <View style={[styles.themeDot, { backgroundColor: theme.accent }]} />
              <Text style={[styles.themeLabel, selectedTheme === i && styles.themeLabelActive]}>
                {theme.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Animation Picker */}
        <Text style={styles.sectionTitle}>Animation Effect ({AD_ANIMATIONS.length} effects)</Text>
        <View style={styles.animGrid}>
          {AD_ANIMATIONS.map(anim => (
            <Pressable
              key={anim.id}
              style={[styles.animCard, selectedAnimation === anim.id && styles.animCardActive]}
              onPress={() => setSelectedAnimation(anim.id)}
            >
              <MaterialIcons
                name={anim.icon as any}
                size={22}
                color={selectedAnimation === anim.id ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.animName, selectedAnimation === anim.id && styles.animNameActive]}>
                {anim.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Format Picker */}
        <Text style={styles.sectionTitle}>Ad Format</Text>
        {AD_FORMATS.map(fmt => (
          <Pressable
            key={fmt.id}
            style={[styles.formatCard, selectedFormat === fmt.id && styles.formatCardActive]}
            onPress={() => setSelectedFormat(fmt.id)}
          >
            <View style={styles.formatInfo}>
              <Text style={[styles.formatName, selectedFormat === fmt.id && { color: Colors.primary }]}>
                {fmt.name}
              </Text>
              <Text style={styles.formatSize}>{fmt.size}</Text>
            </View>
            <View style={styles.platformTags}>
              {fmt.platforms.map(p => (
                <View key={p} style={styles.platformTag}>
                  <Text style={styles.platformText}>{p}</Text>
                </View>
              ))}
            </View>
            {selectedFormat === fmt.id && (
              <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
            )}
          </Pressable>
        ))}

        {/* Generate Button */}
        <Pressable
          style={({ pressed }) => [styles.generateBtn, pressed && { opacity: 0.9 }]}
          onPress={() => showAlert('Generating Ad', `Creating your "${selectedAnim?.name}" animated ad in ${selectedFmt?.name} format. Download ready shortly!`)}
        >
          <MaterialIcons name="auto-fix-high" size={22} color={Colors.background} />
          <Text style={styles.generateBtnText}>Generate & Export Ad</Text>
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
  },
  header: {
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
  previewSection: {
    marginBottom: Spacing.lg,
  },
  previewCanvas: {
    height: 220,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  decorCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    top: -40,
    right: -30,
  },
  decorLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  previewContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  previewBadge: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  previewBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.background,
    letterSpacing: 1.5,
  },
  previewMainText: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
  },
  previewSubText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  previewCta: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    marginTop: 4,
  },
  previewCtaText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    letterSpacing: 1,
  },
  formatBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  formatBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  playBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: BorderRadius.lg,
  },
  playBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
  exportBtn: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  inputGroup: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  themesScroll: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    marginBottom: 4,
  },
  themeChipActive: {
    borderColor: Colors.primary,
  },
  themeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  themeLabelActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  animGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing.md,
  },
  animCard: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  animCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '11',
  },
  animName: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
  animNameActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  formatCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '0D',
  },
  formatInfo: {
    flex: 1,
  },
  formatName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  formatSize: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  platformTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    maxWidth: 140,
  },
  platformTag: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  platformText: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  generateBtnText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
});
