import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { Avatar, Surface } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';
import { initials } from '@/utils/format';

export default function Profile() {
  const { user } = useApp();

  const info: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
    { icon: 'call-outline', label: 'Mobile', value: '+966 55 ••• ••21' },
    { icon: 'mail-outline', label: 'Email', value: 'mun.k•••@email.com' },
    { icon: 'card-outline', label: 'National ID', value: '10••••••78' },
    { icon: 'location-outline', label: 'City', value: 'Riyadh, KSA' },
    { icon: 'calendar-outline', label: 'Member since', value: user.memberSince },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceAlt }}>
      <StatusBar style="light" />
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={{ paddingBottom: spacing.xxxl }}>
        <AppHeader title="Profile" light right={<Ionicons name="create-outline" size={22} color={colors.white} />} />
        <View style={{ alignItems: 'center', paddingTop: spacing.sm }}>
          <Avatar initials={initials(user.name)} size={88} color="rgba(255,255,255,0.2)" />
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.verified}>
            <Ionicons name="shield-checkmark" size={14} color={colors.white} />
            <Text style={styles.verifiedText}>Verified · Absher authenticated</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, marginTop: -spacing.xl }} showsVerticalScrollIndicator={false}>
        <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
          {info.map((row, i, arr) => (
            <View key={row.label} style={[styles.row, i < arr.length - 1 && styles.rowBorder]}>
              <View style={styles.rowIcon}>
                <Ionicons name={row.icon} size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValue}>{row.value}</Text>
              </View>
            </View>
          ))}
        </Surface>

        <Text style={styles.note}>
          This is a simulation. All details shown are sample data and not real customer information.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { color: colors.white, fontSize: font.size.xxl, fontWeight: font.weight.bold, marginTop: spacing.md },
  verified: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.pill },
  verifiedText: { color: colors.white, fontSize: font.size.xs, marginLeft: 5 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md + 2 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: font.size.xs, color: colors.muted },
  rowValue: { fontSize: font.size.md, color: colors.ink, fontWeight: font.weight.semibold, marginTop: 2 },
  note: { fontSize: font.size.xs, color: colors.faint, textAlign: 'center', marginTop: spacing.xl, lineHeight: 18 },
});
