import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { SectionHeader, Surface } from '@/components/ui';
import { billerMeta } from '@/components/categories';
import { colors, font, radius, spacing } from '@/theme';
import { formatDate, formatMoney } from '@/utils/format';

export default function Bills() {
  const { billers } = useApp();
  const due = billers.filter((b) => b.dueAmount);
  const others = billers.filter((b) => !b.dueAmount);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Pay bills" right={<Ionicons name="add" size={24} color={colors.ink} />} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }} showsVerticalScrollIndicator={false}>
        {due.length > 0 && (
          <>
            <SectionHeader title="Due soon" />
            {due.map((b) => {
              const meta = billerMeta[b.category];
              return (
                <Pressable
                  key={b.id}
                  onPress={() => router.push(`/bill/${b.id}`)}
                  style={({ pressed }) => [styles.dueRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={[styles.icon, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.icon} size={22} color={meta.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.name}>{b.name}</Text>
                    <Text style={styles.account}>{b.account}{b.dueDate ? ` · Due ${formatDate(b.dueDate)}` : ''}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.amount}>{formatMoney(b.dueAmount!)}</Text>
                    <Text style={styles.pay}>Pay now</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <SectionHeader title="Categories" />
          <View style={styles.grid}>
            {(['telecom', 'electricity', 'water', 'internet', 'traffic', 'government'] as const).map((cat) => {
              const meta = billerMeta[cat];
              return (
                <Pressable key={cat} style={styles.tile} onPress={() => router.push('/coming-soon')}>
                  <View style={[styles.tileIcon, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.icon} size={24} color={meta.color} />
                  </View>
                  <Text style={styles.tileLabel}>{labelFor(cat)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {others.length > 0 && (
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title="Saved billers" />
            <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
              {others.map((b, i, arr) => {
                const meta = billerMeta[b.category];
                return (
                  <Pressable
                    key={b.id}
                    onPress={() => router.push(`/bill/${b.id}`)}
                    style={[styles.savedRow, i < arr.length - 1 && styles.savedBorder]}
                  >
                    <Ionicons name={meta.icon} size={20} color={meta.color} />
                    <Text style={styles.savedLabel}>{b.name}</Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.faint} />
                  </Pressable>
                );
              })}
            </Surface>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function labelFor(cat: string) {
  const map: Record<string, string> = {
    telecom: 'Telecom',
    electricity: 'Electricity',
    water: 'Water',
    internet: 'Internet',
    traffic: 'Traffic',
    government: 'Government',
  };
  return map[cat] ?? cat;
}

const styles = StyleSheet.create({
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.ink },
  account: { fontSize: font.size.xs, color: colors.muted, marginTop: 2 },
  amount: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.ink },
  pay: { fontSize: font.size.xs, color: colors.primary, fontWeight: font.weight.semibold, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tileIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  tileLabel: { fontSize: font.size.xs, color: colors.body, fontWeight: font.weight.medium },
  savedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md + 2 },
  savedBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  savedLabel: { flex: 1, marginLeft: spacing.md, fontSize: font.size.md, color: colors.ink, fontWeight: font.weight.medium },
});
