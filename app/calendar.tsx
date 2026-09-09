import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { PLATFORM_COLORS, CONTENT_IDEAS } from '@/constants/calendarData';
import { useAlert } from '@/template';
import { scheduleEventReminder } from '@/services/notifications';
import { shareContent } from '@/services/shareService';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  month: number;
  year: number;
  platform: string;
  type: string;
  color: string;
  notes: string;
  time: string;
}

const EVENT_TYPES = ['post', 'email', 'ad', 'campaign', 'meeting'];
const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'Twitter', 'Email', 'Google'];

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 'e1', title: 'Instagram Reel Launch', day: today.getDate(), month: today.getMonth(), year: today.getFullYear(), platform: 'Instagram', type: 'post', color: '#E1306C', notes: 'Product showcase reel', time: '18:00' },
    { id: 'e2', title: 'Weekly Email Newsletter', day: today.getDate() + 2, month: today.getMonth(), year: today.getFullYear(), platform: 'Email', type: 'email', color: '#FF6B35', notes: 'Weekly tips roundup', time: '09:00' },
    { id: 'e3', title: 'Facebook Ad Campaign', day: today.getDate() + 5, month: today.getMonth(), year: today.getFullYear(), platform: 'Facebook', type: 'ad', color: '#1877F2', notes: 'Flash sale promotion', time: '12:00' },
    { id: 'e4', title: 'LinkedIn Thought Leadership', day: today.getDate() + 7, month: today.getMonth(), year: today.getFullYear(), platform: 'LinkedIn', type: 'post', color: '#0A66C2', notes: 'Industry insight post', time: '08:00' },
  ]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', platform: 'Instagram', type: 'post', notes: '', time: '12:00' });

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const getEventsForDay = (day: number) =>
    events.filter(e => e.day === day && e.month === viewMonth && e.year === viewYear);

  const selectedDayEvents = useMemo(() =>
    selectedDay ? getEventsForDay(selectedDay) : [],
    [selectedDay, events, viewMonth, viewYear]
  );

  const addEvent = async () => {
    if (!newEvent.title) { showAlert('Missing Title', 'Please enter an event title.'); return; }
    const event: CalendarEvent = {
      id: `e${Date.now()}`,
      title: newEvent.title,
      day: selectedDay || today.getDate(),
      month: viewMonth,
      year: viewYear,
      platform: newEvent.platform,
      type: newEvent.type,
      color: PLATFORM_COLORS[newEvent.platform] || Colors.primary,
      notes: newEvent.notes,
      time: newEvent.time,
    };
    setEvents(prev => [...prev, event]);
    try {
      const [hours, minutes] = newEvent.time.split(':').map(Number);
      const eventDate = new Date(viewYear, viewMonth, selectedDay || today.getDate(), hours || 12, minutes || 0);
      await scheduleEventReminder(
        newEvent.title,
        `${newEvent.platform} ${newEvent.type} at ${newEvent.time}. Time to publish!`,
        eventDate,
      );
    } catch { /* silent */ }
    setNewEvent({ title: '', platform: 'Instagram', type: 'post', notes: '', time: '12:00' });
    setAddModalVisible(false);
    showAlert('Scheduled!', 'Event added. Reminder set 1 hour before!');
  };

  const handleShareCalendar = async () => {
    const thisMonth = events.filter(e => e.month === viewMonth && e.year === viewYear);
    const msg = `\ud83d\udcc5 My Content Calendar \u2014 ${MONTHS[viewMonth]} ${viewYear}\n\n${thisMonth.map(e => `\u2022 ${e.day}: ${e.title} (${e.platform})`).join('\n')}\n\nTotal: ${events.length} events scheduled\n\n\u2014 E-S Marketing Hub`;
    await shareContent({ title: 'My Content Calendar', message: msg });
  };

  const deleteEvent = (id: string) => {
    showAlert('Delete Event', 'Remove this scheduled item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setEvents(prev => prev.filter(e => e.id !== id)) },
    ]);
  };

  const TYPE_ICONS: Record<string, string> = {
    post: 'post-add', email: 'email', ad: 'campaign', campaign: 'flag', meeting: 'groups',
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Content Calendar</Text>
        <Pressable style={styles.shareCalBtn} onPress={handleShareCalendar}>
          <MaterialIcons name="share" size={18} color={Colors.primary} />
        </Pressable>
        <Pressable style={styles.addBtn} onPress={() => { setAddModalVisible(true); }}>
          <MaterialIcons name="add" size={22} color={Colors.background} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month Navigator */}
        <View style={styles.monthNav}>
          <Pressable onPress={prevMonth} style={styles.monthNavBtn}>
            <MaterialIcons name="chevron-left" size={28} color={Colors.text} />
          </Pressable>
          <Text style={styles.monthTitle}>{MONTHS[viewMonth]} {viewYear}</Text>
          <Pressable onPress={nextMonth} style={styles.monthNavBtn}>
            <MaterialIcons name="chevron-right" size={28} color={Colors.text} />
          </Pressable>
        </View>

        {/* Day Headers */}
        <View style={styles.dayHeaders}>
          {DAYS.map(d => (
            <Text key={d} style={styles.dayHeader}>{d}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calGrid}>
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.calCell} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
            const isSelected = selectedDay === day;
            return (
              <Pressable key={day} style={[styles.calCell, isSelected && styles.calCellSelected]}
                onPress={() => setSelectedDay(day)}>
                <View style={[styles.dayNum, isToday && styles.dayNumToday, isSelected && styles.dayNumSelected]}>
                  <Text style={[styles.dayText, isToday && styles.dayTextToday, isSelected && styles.dayTextSelected]}>
                    {day}
                  </Text>
                </View>
                <View style={styles.eventDots}>
                  {dayEvents.slice(0, 3).map((ev, idx) => (
                    <View key={idx} style={[styles.eventDot, { backgroundColor: ev.color }]} />
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Selected Day Events */}
        {selectedDay && (
          <View style={styles.dayEventsSection}>
            <View style={styles.dayEventsHeader}>
              <Text style={styles.dayEventsTitle}>{selectedDay} {MONTHS[viewMonth]}</Text>
              <Pressable style={styles.addEventBtn} onPress={() => setAddModalVisible(true)}>
                <MaterialIcons name="add" size={16} color={Colors.primary} />
                <Text style={styles.addEventText}>Add Event</Text>
              </Pressable>
            </View>

            {selectedDayEvents.length === 0 ? (
              <View style={styles.noEvents}>
                <MaterialIcons name="calendar-today" size={36} color={Colors.textMuted} />
                <Text style={styles.noEventsText}>No events scheduled</Text>
                <Text style={styles.noEventsSub}>Tap + to add a content event</Text>
              </View>
            ) : (
              selectedDayEvents.map(event => (
                <View key={event.id} style={[styles.eventCard, { borderLeftColor: event.color }]}>
                  <View style={[styles.eventIcon, { backgroundColor: event.color + '22' }]}>
                    <MaterialIcons name={(TYPE_ICONS[event.type] || 'event') as any} size={20} color={event.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.eventMeta}>
                      <Text style={[styles.eventPlatform, { color: event.color }]}>{event.platform}</Text>
                      <Text style={styles.eventTime}>{event.time}</Text>
                    </View>
                    {event.notes !== '' && <Text style={styles.eventNotes}>{event.notes}</Text>}
                  </View>
                  <Pressable onPress={() => deleteEvent(event.id)} hitSlop={12}>
                    <MaterialIcons name="delete-outline" size={20} color={Colors.textMuted} />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        )}

        {/* Content Ideas */}
        <View style={styles.ideasSection}>
          <Text style={styles.ideasTitle}>Content Ideas</Text>
          {CONTENT_IDEAS.slice(0, 6).map((idea, i) => (
            <Pressable key={i} style={styles.ideaCard}
              onPress={() => {
                setNewEvent({ title: idea.idea, platform: idea.platform, type: idea.type, notes: '', time: '12:00' });
                setAddModalVisible(true);
              }}>
              <View style={[styles.ideaIcon, { backgroundColor: (PLATFORM_COLORS[idea.platform] || Colors.primary) + '22' }]}>
                <MaterialIcons name="lightbulb" size={18} color={PLATFORM_COLORS[idea.platform] || Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ideaText} numberOfLines={2}>{idea.idea}</Text>
                <Text style={[styles.ideaPlatform, { color: PLATFORM_COLORS[idea.platform] || Colors.primary }]}>
                  {idea.platform}
                </Text>
              </View>
              <Pressable style={styles.useIdeaBtn}
                onPress={() => { setNewEvent({ title: idea.idea, platform: idea.platform, type: idea.type, notes: '', time: '12:00' }); setAddModalVisible(true); }}>
                <MaterialIcons name="add-circle" size={22} color={Colors.primary} />
              </Pressable>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Event Modal */}
      <Modal visible={addModalVisible} animationType="slide" transparent onRequestClose={() => setAddModalVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setAddModalVisible(false)} />
        <View style={[styles.addModal, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Add Content Event</Text>
          <Text style={styles.modalDate}>
            {selectedDay} {MONTHS[viewMonth]} {viewYear}
          </Text>

          <Text style={styles.modalLabel}>Event Title *</Text>
          <TextInput style={styles.modalField} value={newEvent.title} onChangeText={t => setNewEvent(p => ({ ...p, title: t }))}
            placeholder="e.g. Product launch reel" placeholderTextColor={Colors.textMuted} />

          <Text style={styles.modalLabel}>Platform</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformScroll} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
            {PLATFORMS.map(pl => (
              <Pressable key={pl} style={[styles.platformBtn, newEvent.platform === pl && { backgroundColor: (PLATFORM_COLORS[pl] || Colors.primary), borderColor: (PLATFORM_COLORS[pl] || Colors.primary) }]}
                onPress={() => setNewEvent(p => ({ ...p, platform: pl }))}>
                <Text style={[styles.platformBtnText, newEvent.platform === pl && { color: Colors.background }]}>{pl}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.modalLabel}>Content Type</Text>
          <View style={styles.typeRow}>
            {EVENT_TYPES.map(type => (
              <Pressable key={type} style={[styles.typeBtn, newEvent.type === type && styles.typeBtnActive]}
                onPress={() => setNewEvent(p => ({ ...p, type }))}>
                <Text style={[styles.typeBtnText, newEvent.type === type && { color: Colors.background }]}>{type}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.modalLabel}>Time</Text>
          <TextInput style={styles.modalField} value={newEvent.time} onChangeText={t => setNewEvent(p => ({ ...p, time: t }))}
            placeholder="e.g. 18:00" placeholderTextColor={Colors.textMuted} />

          <Text style={styles.modalLabel}>Notes (optional)</Text>
          <TextInput style={[styles.modalField, { height: 72 }]} value={newEvent.notes} onChangeText={t => setNewEvent(p => ({ ...p, notes: t }))}
            placeholder="Add notes or details..." placeholderTextColor={Colors.textMuted} multiline />

          <Pressable style={styles.saveBtn} onPress={addEvent}>
            <MaterialIcons name="event-available" size={20} color={Colors.background} />
            <Text style={styles.saveBtnText}>Schedule Event</Text>
          </Pressable>
        </View>
      </Modal>
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
  headerTitle: { flex: 1, fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text },
  shareCalBtn: {
    width: 38, height: 38, borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '22', borderWidth: 1, borderColor: Colors.primary + '44',
    justifyContent: 'center', alignItems: 'center',
  },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, marginBottom: Spacing.sm,
  },
  monthNavBtn: { padding: 8 },
  monthTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  dayHeaders: { flexDirection: 'row', paddingHorizontal: Spacing.md, marginBottom: 4 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.semibold },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.md },
  calCell: { width: '14.28%', alignItems: 'center', paddingVertical: 4, borderRadius: BorderRadius.sm },
  calCellSelected: { backgroundColor: Colors.primary + '11' },
  dayNum: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  dayNumToday: { backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.primary },
  dayNumSelected: { backgroundColor: Colors.primary },
  dayText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  dayTextToday: { color: Colors.primary, fontWeight: FontWeight.bold },
  dayTextSelected: { color: Colors.background, fontWeight: FontWeight.bold },
  eventDots: { flexDirection: 'row', gap: 2, marginTop: 2, height: 5, alignItems: 'center' },
  eventDot: { width: 5, height: 5, borderRadius: 3 },
  dayEventsSection: { paddingHorizontal: Spacing.md, marginTop: Spacing.md },
  dayEventsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  dayEventsTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  addEventBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary + '22', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full,
  },
  addEventText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  noEvents: { alignItems: 'center', paddingVertical: 32 },
  noEventsText: { fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: FontWeight.semibold, marginTop: 10 },
  noEventsSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4 },
  eventCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1,
    borderColor: Colors.border, borderLeftWidth: 3,
  },
  eventIcon: { width: 40, height: 40, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  eventTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 4 },
  eventMeta: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 4 },
  eventPlatform: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  eventTime: { fontSize: FontSize.sm, color: Colors.textMuted },
  eventNotes: { fontSize: FontSize.sm, color: Colors.textSecondary, fontStyle: 'italic' },
  ideasSection: { paddingHorizontal: Spacing.md, marginTop: Spacing.lg },
  ideasTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  ideaCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  ideaIcon: { width: 38, height: 38, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  ideaText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.medium, lineHeight: 18 },
  ideaPlatform: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, marginTop: 2 },
  useIdeaBtn: { padding: 4 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  addModal: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.md, maxHeight: '80%',
  },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text, marginBottom: 4 },
  modalDate: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold, marginBottom: Spacing.md },
  modalLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: 6, marginTop: 12 },
  modalField: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: FontSize.md,
    color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  platformScroll: { marginBottom: 4 },
  platformBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  platformBtnText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeBtnText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg, marginTop: Spacing.lg,
  },
  saveBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
});
