import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { Screen } from '@/components/Screen';
import { Avatar, IconTile, SectionHeader, Surface } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';
import { initials } from '@/utils/format';

const transferTypes = [
  { id: 'own', label: 'Between my accounts', desc: 'Move money instantly', icon: 'repeat-outline', color: '#0B7D6E', bg: colors.primarySoft },
  { id: 'anb', label: 'To anb account', desc: 'Free & instant', icon: 'flash-outline', color: '#E0A800', bg: '#FBF3D9' },
  { id: 'local', label: 'Local transfer (IPS/SARIE)', desc: 'To any bank in KSA', icon: 'business-outline', color: '#2F6FED', bg: '#E8F0FE' },
  { id: 'intl', label: 'International transfer', desc: 'Send money abroad', icon: 'globe-outline', color: '#8B5CF6', bg: '#F1ECFE' },
] as const;

export default function Transfers() {
  const insets = useSafeAreaInsets();
  const { beneficiaries } = useApp();
  const favorites = beneficiaries.filter((b) => b.favorite);

  return (
    <Screen edgesTop contentStyle={{ paddingTop: insets.top + spacing.md }}>
      <Text style={styles.screenTitle}>Transfer</Text>

      {favorites.length > 0 && (
        <View style={{ marginTop: spacing.lg }}>
          <SectionHeader title="Quick send" actionLabel="All" onAction={() => router.push('/beneficiaries')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable style={styles.favAdd} onPress={() => router.push('/beneficiaries')}>
              <View style={styles.favAddCircle}>
                <Ionicons name="add" size={26} color={colors.primary} />
              </View>
              <Text style={styles.favName}>Add</Text>
            </Pressable>
            {favorites.map((b) => (
              <Pressable
                key={b.id}
                style={styles.fav}
                onPress={() => router.push({ pathname: '/transfer/new', params: { beneficiaryId: b.id } })}
              >
                <Avatar initials={initials(b.name)} />
                <Text style={styles.favName} numberOfLines={1}>{b.nickname ?? b.name.split(' ')[0]}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader title="Send money" />
        {transferTypes.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => router.push({ pathname: '/transfer/new', params: { type: t.id } })}
            style={({ pressed }) => [styles.typeRow, pressed && { opacity: 0.7 }]}
          >
            <IconTile name={t.icon as any} color={t.color} bg={t.bg} size={48} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.typeLabel}>{t.label}</Text>
              <Text style={styles.typeDesc}>{t.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.faint} />
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader title="More services" />
        <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
          {[
            { label: 'Request money', icon: 'download-outline', route: '/coming-soon' },
            { label: 'Scheduled & standing orders', icon: 'calendar-outline', route: '/coming-soon' },
            { label: 'Beneficiaries', icon: 'people-outline', route: '/beneficiaries' },
          ].map((row, i, arr) => (
            <Pressable
              key={row.label}
              onPress={() => router.push(row.route as any)}
              style={[styles.serviceRow, i < arr.length - 1 && styles.serviceBorder]}
            >
              <Ionicons name={row.icon as any} size={20} color={colors.primary} />
              <Text style={styles.serviceLabel}>{row.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.faint} />
            </Pressable>
          ))}
        </Surface>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenTitle: { fontSize: font.size.display, fontWeight: font.weight.heavy, color: colors.ink },
  fav: { alignItems: 'center', marginRight: spacing.lg, width: 60 },
  favAdd: { alignItems: 'center', marginRight: spacing.lg, width: 60 },
  favAddCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favName: { fontSize: font.size.xs, color: colors.body, marginTop: 6, fontWeight: font.weight.medium },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  typeLabel: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.ink },
  typeDesc: { fontSize: font.size.sm, color: colors.muted, marginTop: 2 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg },
  serviceBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  serviceLabel: { flex: 1, marginLeft: spacing.md, fontSize: font.size.md, color: colors.ink, fontWeight: font.weight.medium },
});
