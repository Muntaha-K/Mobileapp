import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { Screen } from '@/components/Screen';
import { Avatar, Surface } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';
import { initials } from '@/utils/format';

type Row = { label: string; icon: keyof typeof Ionicons.glyphMap; route: string; danger?: boolean };

const groups: { title: string; rows: Row[] }[] = [
  {
    title: 'Banking',
    rows: [
      { label: 'Pay bills', icon: 'receipt-outline', route: '/bills' },
      { label: 'Beneficiaries', icon: 'people-outline', route: '/beneficiaries' },
      { label: 'Transactions', icon: 'list-outline', route: '/transactions' },
      { label: 'Statements & documents', icon: 'document-text-outline', route: '/coming-soon' },
    ],
  },
  {
    title: 'Lifestyle',
    rows: [
      { label: 'anb Rewards', icon: 'gift-outline', route: '/coming-soon' },
      { label: 'Offers & discounts', icon: 'pricetags-outline', route: '/coming-soon' },
      { label: 'Financing & loans', icon: 'cash-outline', route: '/coming-soon' },
    ],
  },
  {
    title: 'Settings',
    rows: [
      { label: 'Security & login', icon: 'lock-closed-outline', route: '/coming-soon' },
      { label: 'Notifications', icon: 'notifications-outline', route: '/notifications' },
      { label: 'Language / اللغة', icon: 'language-outline', route: '/coming-soon' },
      { label: 'Help & support', icon: 'headset-outline', route: '/coming-soon' },
    ],
  },
];

export default function More() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useApp();

  const doLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <Screen edgesTop contentStyle={{ paddingTop: insets.top + spacing.md }}>
      <Text style={styles.screenTitle}>More</Text>

      <Pressable onPress={() => router.push('/profile')} style={styles.profile}>
        <Avatar initials={initials(user.name)} size={56} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileSub}>Personal · Member since {user.memberSince}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.faint} />
      </Pressable>

      {groups.map((g) => (
        <View key={g.title} style={{ marginTop: spacing.xl }}>
          <Text style={styles.groupTitle}>{g.title}</Text>
          <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
            {g.rows.map((row, i, arr) => (
              <Pressable
                key={row.label}
                onPress={() => router.push(row.route as any)}
                style={[styles.row, i < arr.length - 1 && styles.rowBorder]}
              >
                <View style={styles.rowIcon}>
                  <Ionicons name={row.icon} size={19} color={colors.primary} />
                </View>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.faint} />
              </Pressable>
            ))}
          </Surface>
        </View>
      ))}

      <Pressable onPress={doLogout} style={styles.logout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>

      <Text style={styles.version}>anb simulation · v1.0.0 (demo)</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenTitle: { fontSize: font.size.display, fontWeight: font.weight.heavy, color: colors.ink, marginBottom: spacing.lg },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  profileName: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.ink },
  profileSub: { fontSize: font.size.sm, color: colors.muted, marginTop: 2 },
  groupTitle: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.muted, marginBottom: spacing.sm, marginLeft: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md + 2 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, marginLeft: spacing.md, fontSize: font.size.md, color: colors.ink, fontWeight: font.weight.medium },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSoft,
  },
  logoutText: { color: colors.danger, fontWeight: font.weight.bold, marginLeft: 8 },
  version: { textAlign: 'center', color: colors.faint, fontSize: font.size.xs, marginTop: spacing.xl },
});
