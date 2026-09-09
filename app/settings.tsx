import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useAlert } from '@/template';

const SETTINGS_SECTIONS = [
  { id: 'about', label: 'About This App', icon: 'info', color: '#00D4FF' },
  { id: 'vision', label: 'Vision & Mission', icon: 'visibility', color: '#FFD700' },
  { id: 'privacy', label: 'Privacy Policy', icon: 'privacy-tip', color: '#00C853' },
  { id: 'terms', label: 'Terms of Service', icon: 'gavel', color: '#FF6B35' },
  { id: 'disclaimer', label: 'Disclaimers', icon: 'warning', color: '#FF1744' },
  { id: 'copyright', label: 'Copyright Notice', icon: 'copyright', color: '#7B2FBE' },
  { id: 'features', label: 'All Features & Specs', icon: 'star', color: '#FFD700' },
  { id: 'support', label: 'Contact & Support', icon: 'support-agent', color: '#00D4FF' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const CONTENT: Record<string, { title: string; color: string; body: string }> = {
    about: {
      title: 'About E-S Marketing Hub',
      color: '#00D4FF',
      body: `E-S Marketing Tools Hub is the world's most comprehensive all-in-one digital marketing platform built for professionals, entrepreneurs, small businesses, and content creators.

VERSION: 2.0.0
BUILD: 200
PLATFORM: React Native / Expo
COMPATIBILITY: Android, iOS, Web

WHAT'S INCLUDED:
• 53+ Professional Marketing Tools
• 100+ Customizable Templates
• AI Copy Generator (8 formats)
• Animated Video Ad Maker
• Medical Presentation Builder
• Content Calendar with Reminders
• ROI & Analytics Dashboard
• Game Generator (5 game types)
• 25 Trending Ad Templates
• Campaign Analytics Charts
• Social Media Hub
• Promo Kit Generator

BUILT WITH:
• React Native + Expo SDK 52
• Expo Router (file-based navigation)
• TypeScript
• OnSpace Cloud Backend
• @expo/vector-icons (Material Icons)
• expo-image, expo-av, expo-print
• expo-notifications, expo-sharing

This app is designed and developed to serve all industries including Medical, E-commerce, Social Media, Local Business, Apps & Games, and Enterprise Marketing.`,
    },
    vision: {
      title: 'Vision & Mission',
      color: '#FFD700',
      body: `OUR VISION:
To become the global #1 all-in-one marketing platform that empowers every entrepreneur, creator, and business — regardless of size or budget — to market professionally and compete at the highest level.

OUR MISSION:
We exist to democratize professional marketing. Every tool, template, and feature in E-S Marketing Hub is designed to put enterprise-grade marketing power in the hands of individuals and small teams.

OUR CORE VALUES:
✦ Empowerment — Give everyone the tools to succeed
✦ Innovation — Always evolving with new AI capabilities  
✦ Simplicity — Complex tools made simple and accessible
✦ Quality — World-class output from every feature
✦ Inclusivity — Built for every industry, language, and market

WHO WE SERVE:
• Digital Marketing Professionals
• Small Business Owners
• Content Creators & Influencers
• Medical & Healthcare Professionals
• E-commerce Entrepreneurs
• App Developers & Game Studios
• Marketing Agencies
• Students & Marketing Learners

OUR COMMITMENT:
We are committed to building features that create real results — not just demos, but working, deployable marketing assets that users can publish, share, and profit from immediately.`,
    },
    privacy: {
      title: 'Privacy Policy',
      color: '#00C853',
      body: `PRIVACY POLICY
E-S Marketing Tools Hub
Last Updated: ${new Date().getFullYear()}

1. INFORMATION WE COLLECT
This app stores all data locally on your device only. We do not transmit personal data to external servers without your explicit consent.

Local data stored on your device:
• Content you create (templates, copy, events)
• App preferences and settings
• Game scores (leaderboard)
• Calendar events you schedule

2. NOTIFICATIONS
Push notifications are only used for:
• Scheduled content reminders you set
• Daily marketing tips (can be disabled)
You can disable all notifications in device Settings.

3. ANALYTICS & TRACKING
We do NOT use:
• Google Analytics
• Facebook Pixel
• Firebase Analytics
• Any third-party tracking SDK

4. THIRD-PARTY SERVICES
• Expo: Used for app build/deployment infrastructure
• Device Share API: Used when you choose to share content
• Device Print API: Used for PDF export (your choice)

5. DATA SECURITY
All data remains on your device. No accounts required. No cloud storage without your explicit setup.

6. CHILDREN'S PRIVACY
This app is not directed at children under 13. We do not knowingly collect data from children.

7. YOUR RIGHTS
• Access: View all data in the app
• Delete: Clear app data via device settings
• Portability: Export any content you create

8. CONTACT
privacy@esmarketing.hub`,
    },
    terms: {
      title: 'Terms of Service',
      color: '#FF6B35',
      body: `TERMS OF SERVICE
E-S Marketing Tools Hub
Effective Date: ${new Date().getFullYear()}

1. ACCEPTANCE OF TERMS
By downloading, installing, or using this app, you agree to these Terms of Service. If you do not agree, do not use the app.

2. LICENSE GRANT
We grant you a personal, non-exclusive, non-transferable license to use this app for personal and commercial marketing activities.

3. PERMITTED USES
• Create marketing content for legitimate businesses
• Generate AI copy for products/services you own or represent
• Build presentations, videos, and campaigns
• Export and publish content you create

4. PROHIBITED USES
You may NOT use this app to:
• Create spam or unsolicited messages
• Produce misleading, deceptive, or fraudulent advertising
• Violate any applicable laws or regulations
• Infringe intellectual property rights of others
• Create content that promotes hate or violence

5. AI-GENERATED CONTENT
• AI copy is computer-generated and requires your review
• You are solely responsible for content you publish
• We make no guarantee of marketing results

6. MEDICAL CONTENT DISCLAIMER
All medical presentation content is for educational purposes only. Never use as a substitute for professional medical advice.

7. INTELLECTUAL PROPERTY
• Your created content belongs to you
• App interface and code are protected by copyright
• Marketing tools and methodologies are based on industry best practices

8. DISCLAIMER OF WARRANTIES
The app is provided "AS IS" without warranties of any kind.

9. LIMITATION OF LIABILITY
We are not liable for any marketing outcomes, business results, or indirect damages.

10. CHANGES TO TERMS
We may update these terms. Continued use constitutes acceptance.`,
    },
    disclaimer: {
      title: 'Important Disclaimers',
      color: '#FF1744',
      body: `IMPORTANT DISCLAIMERS

⚕️ MEDICAL DISCLAIMER
The Medical Presentation Builder is for educational and informational purposes ONLY. All medical content must be reviewed and verified by qualified, licensed healthcare professionals before use. This app does not provide medical advice, diagnosis, or treatment recommendations. Always consult with qualified medical professionals. Compliance with applicable medical advertising regulations is solely your responsibility.

📊 MARKETING RESULTS DISCLAIMER
Marketing results vary significantly based on market conditions, implementation quality, budget, and many other factors. No specific revenue, leads, conversions, or ROI results are guaranteed. Case studies and examples shown are for illustrative purposes only and do not represent typical results.

🤖 AI CONTENT DISCLAIMER
AI-generated copy is computer-generated text based on templates and algorithms. It may contain inaccuracies, errors, or content unsuitable for your specific use case. Always review, edit, and fact-check AI-generated content before publishing. You are solely responsible for all content you publish.

🎮 GAME CONTENT DISCLAIMER
Games and interactive content are provided for marketing engagement purposes. Game mechanics are simplified simulations. Real marketing results require professional strategies and execution.

📱 PLATFORM COMPLIANCE
You are responsible for ensuring your marketing content complies with the terms of service of each platform (Instagram, Facebook, TikTok, LinkedIn, Google, etc.) where you publish.

⚖️ LEGAL COMPLIANCE
You are responsible for ensuring all marketing content complies with applicable laws in your jurisdiction, including consumer protection laws, advertising standards, GDPR, CAN-SPAM, and other regulations.`,
    },
    copyright: {
      title: 'Copyright Notice',
      color: '#7B2FBE',
      body: `COPYRIGHT NOTICE
© ${new Date().getFullYear()} E-S Marketing Tools Hub. All Rights Reserved.

ORIGINAL CONTENT OWNED:
• App interface design and layout
• Marketing tools descriptions and tips (53+ tools)
• Template content and structures (100+ templates)
• AI copy formulas and frameworks
• Medical presentation templates
• Promotional text and copy
• Feature hub content and data

OPEN SOURCE COMPONENTS (MIT License):
• React Native (facebook/react-native)
• Expo Framework (expo/expo)
• Expo Router
• @expo/vector-icons
• React Navigation
• react-native-safe-area-context
• react-native-reanimated

THIRD-PARTY ASSETS:
• Icons: Material Icons by Google (Apache 2.0 License)
• Fonts: System fonts (iOS/Android default)

TRADEMARK:
"E-S Marketing Hub" name and logo are trademarks of the app owner.

PERMISSIONS:
✅ You may use the app's AI-generated content commercially
✅ You may use created templates in your marketing campaigns
✅ You may share app-generated copy and media

❌ You may NOT reproduce or distribute the app itself
❌ You may NOT copy the app's source code for commercial distribution
❌ You may NOT remove copyright notices or watermarks

For licensing inquiries: legal@esmarketing.hub`,
    },
    features: {
      title: 'All Features & Specifications',
      color: '#FFD700',
      body: `COMPLETE FEATURE SPECIFICATIONS

CORE MARKETING TOOLS (53+):
• SEO: Keyword Planner, Meta Tag Generator, Backlink Analyzer, Schema Markup
• Social: Post Scheduler, Hashtag Generator, Engagement Calculator, Influencer Finder
• Email: Campaign Builder, Subject Line Tester, A/B Split Tester, Drip Sequence
• Content: Blog Topic Generator, Content Calendar, Copywriting Frameworks
• Video: Script Generator, Thumbnail Creator, Caption Maker, Hook Writer
• Design: Color Palette Generator, Font Pairing, Ad Size Templates
• Analytics: ROI Calculator, CTR Optimizer, Conversion Tracker
• Local: Google My Business Optimizer, Review Strategy, Local SEO
• Medical: Patient Education, Clinical Trial Design, Pharma Ad Templates
• E-Commerce: Product Description Writer, Pricing Strategy, Cart Abandonment
• Apps: App Store Optimization, Rating Strategy, Onboarding Copy
• Games: Engagement Mechanics, Viral Loop Design, Monetization Models

AI COPY GENERATOR:
• 8 formats: Headline, Body, CTA, Email, Social, Product, SMS, Slogan
• 8 tones: Professional, Casual, Urgent, Luxury, Friendly, Bold, Empathetic, Humorous
• 6 formulas: AIDA, PAS, BAB, FAB, FOMO, 4Ps
• Multiple variants per generation
• AI quality scoring: Readability, Persuasion, Emotional Impact, CTA Strength
• Save and share functionality

VIDEO AD MAKER:
• 6 video styles: Product Showcase, Story Mode, Testimonial, Countdown, Tutorial, Brand Intro
• 6 scene types: Hook, Problem, Solution, Features, Social Proof, CTA
• 6 transition effects: Fade, 3D Flip, Zoom Burst, Slide Push, Glitch Cut, Particle
• 6 background music options
• 5 color themes
• Duration: 15s, 30s, 60s
• Platform ratios: 9:16, 1:1, 16:9, 4:5
• Watermark branding option
• Shareable preview links

MEDICAL PRESENTATION BUILDER:
• 8 specialties: Cardiology, Oncology, Neurology, Pediatrics, Orthopedics, Dermatology, Pharma, General
• 12 slide types per specialty
• 3 audience types: Physicians, Patients, Students
• PDF export with professional formatting
• Slide-by-slide preview mode

CONTENT CALENDAR:
• Full monthly calendar view
• Push notification reminders (1 hour before)
• 8 platform support: Instagram, Facebook, TikTok, LinkedIn, YouTube, Twitter, Email, Google
• 5 content types: Post, Email, Ad, Campaign, Meeting
• Content ideas bank with one-tap scheduling
• Calendar export and sharing

ROI ANALYTICS DASHBOARD:
• Campaign performance tracker
• ROAS calculator
• Budget allocation planner
• A/B test comparison
• AI-powered recommendations

GAME GENERATOR:
• 6 game types: Puzzle, Endless Runner, Idle Clicker, Quiz, Memory Match, Trivia
• Custom branding per game
• Persistent leaderboard with medals (Top 10)
• Publish-ready game export
• Marketing knowledge quiz content

TRENDING ADS (25+):
• Top-performing ad formats
• Trend score ratings
• Hook, CTA, and rationale for each format
• Industry-specific recommendations
• Pro implementation tips

TECHNICAL SPECS:
• Framework: React Native + Expo SDK 52
• Language: TypeScript
• Navigation: Expo Router (file-based)
• Min Android: API 24 (Android 7.0)
• Min iOS: iOS 15
• Offline capable: Yes (local data storage)
• Push notifications: Yes (expo-notifications)
• PDF export: Yes (expo-print + expo-sharing)`,
    },
    support: {
      title: 'Contact & Support',
      color: '#00D4FF',
      body: `CONTACT & SUPPORT

📧 GENERAL SUPPORT
support@esmarketing.hub

🔧 TECHNICAL ISSUES
tech@esmarketing.hub

⚖️ LEGAL & LICENSING
legal@esmarketing.hub

🔒 PRIVACY CONCERNS
privacy@esmarketing.hub

🤝 PARTNERSHIP & BUSINESS
business@esmarketing.hub

COMMUNITY:
• GitHub: github.com/esmarketing/hub
• Documentation: docs.esmarketing.hub

REPORTING ISSUES:
When reporting a bug, please include:
1. Device model and OS version
2. App version (Settings → About)
3. Steps to reproduce the issue
4. Screenshot if applicable

FEATURE REQUESTS:
We welcome feature requests! Email us with:
• Feature description
• Use case / why it helps you
• Any examples from other tools

RESPONSE TIME:
• General support: 24-48 hours
• Technical issues: 12-24 hours
• Critical bugs: Same day

BUILT WITH ❤️ BY THE E-S TEAM
Version 2.0.0 · Build 200`,
    },
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Settings & Info</Text>
          <Text style={styles.headerSub}>About, Legal, Privacy & More</Text>
        </View>
        <Pressable onPress={() => router.push('/admin' as any)} style={styles.adminBtn}>
          <MaterialIcons name="admin-panel-settings" size={18} color={Colors.primary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* App Identity Card */}
        <View style={styles.appCard}>
          <View style={styles.appIconWrap}>
            <MaterialIcons name="hub" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>E-S Marketing Tools Hub</Text>
          <Text style={styles.appTagline}>Your Complete Marketing Powerhouse</Text>
          <View style={styles.appBadgesRow}>
            <View style={styles.appBadge}><Text style={styles.appBadgeText}>v2.0.0</Text></View>
            <View style={[styles.appBadge, { backgroundColor: '#00C853' + '22' }]}><Text style={[styles.appBadgeText, { color: '#00C853' }]}>53+ Tools</Text></View>
            <View style={[styles.appBadge, { backgroundColor: '#00D4FF' + '22' }]}><Text style={[styles.appBadgeText, { color: '#00D4FF' }]}>AI Powered</Text></View>
          </View>
        </View>

        {/* Sections */}
        {SETTINGS_SECTIONS.map(section => (
          <View key={section.id}>
            <Pressable
              style={[styles.sectionRow, activeSection === section.id && { borderColor: section.color, backgroundColor: section.color + '0D' }]}
              onPress={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <View style={[styles.sectionIcon, { backgroundColor: section.color + '22' }]}>
                <MaterialIcons name={section.icon as any} size={22} color={section.color} />
              </View>
              <Text style={[styles.sectionLabel, activeSection === section.id && { color: section.color }]}>{section.label}</Text>
              <MaterialIcons
                name={activeSection === section.id ? 'expand-less' : 'expand-more'}
                size={20}
                color={activeSection === section.id ? section.color : Colors.textMuted}
              />
            </Pressable>

            {activeSection === section.id && CONTENT[section.id] && (
              <View style={[styles.contentPanel, { borderLeftColor: CONTENT[section.id].color }]}>
                <Text style={[styles.contentTitle, { color: CONTENT[section.id].color }]}>
                  {CONTENT[section.id].title}
                </Text>
                <Text style={styles.contentBody}>{CONTENT[section.id].body}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Admin Access */}
        <Pressable style={styles.adminAccessRow} onPress={() => router.push('/admin' as any)}>
          <View style={styles.adminAccessIcon}>
            <MaterialIcons name="admin-panel-settings" size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminAccessTitle}>Admin Panel</Text>
            <Text style={styles.adminAccessSub}>Full app control, feature management & deployment</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={14} color={Colors.primary} />
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  adminBtn: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '22', justifyContent: 'center', alignItems: 'center',
  },
  scroll: { paddingHorizontal: Spacing.md },
  appCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary + '44',
  },
  appIconWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary + '22',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  appName: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text, textAlign: 'center', marginBottom: 4 },
  appTagline: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginBottom: 12 },
  appBadgesRow: { flexDirection: 'row', gap: 8 },
  appBadge: { backgroundColor: Colors.primary + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  appBadgeText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: 6, borderWidth: 1, borderColor: Colors.border,
  },
  sectionIcon: { width: 40, height: 40, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  sectionLabel: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  contentPanel: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: 10, borderLeftWidth: 3, borderWidth: 1, borderColor: Colors.border,
  },
  contentTitle: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, marginBottom: 12 },
  contentBody: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  adminAccessRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.primary + '11', borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginTop: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '44',
  },
  adminAccessIcon: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '22', justifyContent: 'center', alignItems: 'center',
  },
  adminAccessTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
  adminAccessSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
});
