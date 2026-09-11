import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { colors, font, radius, spacing } from '@/theme';

const items: { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string; title: string; body: string; time: string; unread?: boolean }[] = [
  { icon: 'arrow-down-circle', color: colors.success, bg: colors.successSoft, title: 'Salary credited', body: 'SAR 22,500.00 received from Aramco.', time: '2d ago', unread: true },
  { icon: 'card', color: colors.primary, bg: colors.primarySoft, title: 'Card payment', body: 'SAR 289.00 at Jarir Bookstore.', time: '3h ago', unread: true },
  { icon: 'alert-circle', color: colors.warning, bg: '#FBF3D9', title: 'Bill due soon', body: 'STC bill of SAR 289.00 is due on 18 Sep.', time: '1d ago' },
  { icon: 'shield-checkmark', color: colors.info, bg: '#E8F0FE', title: 'New login', body: 'Your account was accessed on a new device.', time: '4d ago' },
  { icon: 'gift', color: '#8B5CF6', bg: '#F1ECFE', title: 'anb Rewards', body: 'You earned 450 points this month.', time: '5d ago' },
];

export default function Notifications() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Notifications" right={<Text style={styles.clear}>Mark all</Text>} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }} showsVerticalScrollIndicator={false}>
        {items.map((n, i) => (
          <View key={i} style={styles.row}>
            <View style={[styles.icon, { backgroundColor: n.bg }]}>
              <Ionicons name={n.icon} size={20} color={n.color} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.title}>{n.title}</Text>
                {n.unread ? <View style={styles.dot} /> : null}
              </View>
              <Text style={styles.body}>{n.body}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  clear: { color: colors.primary, fontWeight: font.weight.semibold, fontSize: font.size.sm },
  row: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.line,
  },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.ink },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: 8 },
  body: { fontSize: font.size.sm, color: colors.body, marginTop: 3 },
  time: { fontSize: font.size.xs, color: colors.faint, marginTop: 6 },
});
