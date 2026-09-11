import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { Divider, EmptyState, SectionHeader, Surface } from '@/components/ui';
import { TransactionRow } from '@/components/TransactionRow';
import { colors, font, radius, spacing } from '@/theme';
import { dateBucket, formatMoney } from '@/utils/format';

export default function AccountDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { accountById, transactionsForAccount } = useApp();
  const account = accountById(id);

  if (!account) {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader title="Account" />
        <EmptyState icon="alert-circle-outline" title="Account not found" />
      </View>
    );
  }

  const txs = transactionsForAccount(account.id);
  const grouped = groupByBucket(txs);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceAlt }}>
      <StatusBar style="light" />
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={{ paddingBottom: spacing.xxl }}>
        <AppHeader
          title={account.name}
          light
          right={<Ionicons name="ellipsis-horizontal" size={22} color={colors.white} />}
        />
        <View style={styles.heroBody}>
          <Text style={styles.heroLabel}>Available balance</Text>
          <Text style={styles.heroValue}>{formatMoney(account.available)} <Text style={styles.heroCur}>SAR</Text></Text>
          <Text style={styles.heroLabel}>Current balance {formatMoney(account.balance)} SAR</Text>

          <View style={styles.ibanRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ibanLabel}>IBAN</Text>
              <Text style={styles.ibanValue}>{account.iban}</Text>
            </View>
            <Pressable hitSlop={8} style={styles.copyBtn}>
              <Ionicons name="copy-outline" size={18} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.actionsBar}>
        <Action icon="swap-horizontal" label="Transfer" onPress={() => router.push('/transfer/new')} />
        <Action icon="receipt-outline" label="Pay bills" onPress={() => router.push('/bills')} />
        <Action icon="document-text-outline" label="Statement" onPress={() => router.push('/coming-soon')} />
        <Action icon="pencil-outline" label="Details" onPress={() => router.push('/coming-soon')} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xxxl }} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Transactions" actionLabel="Filter" onAction={() => {}} />
        {grouped.length === 0 ? (
          <EmptyState icon="time-outline" title="No transactions yet" />
        ) : (
          grouped.map((group) => (
            <View key={group.bucket} style={{ marginBottom: spacing.md }}>
              <Text style={styles.bucket}>{group.bucket}</Text>
              <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
                {group.items.map((tx, i) => (
                  <View key={tx.id}>
                    <TransactionRow tx={tx} onPress={() => router.push(`/transaction/${tx.id}`)} />
                    {i < group.items.length - 1 ? <Divider inset={56} /> : null}
                  </View>
                ))}
              </Surface>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function Action({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.action}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function groupByBucket(txs: { date: string }[] & any[]) {
  const map = new Map<string, any[]>();
  for (const tx of txs) {
    const b = dateBucket(tx.date);
    if (!map.has(b)) map.set(b, []);
    map.get(b)!.push(tx);
  }
  return Array.from(map.entries()).map(([bucket, items]) => ({ bucket, items }));
}

const styles = StyleSheet.create({
  heroBody: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: font.size.sm },
  heroValue: { color: colors.white, fontSize: font.size.hero, fontWeight: font.weight.heavy, marginVertical: 4 },
  heroCur: { fontSize: font.size.lg, fontWeight: font.weight.semibold },
  ibanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  ibanLabel: { color: 'rgba(255,255,255,0.7)', fontSize: font.size.xs },
  ibanValue: { color: colors.white, fontSize: font.size.sm, fontWeight: font.weight.semibold, marginTop: 2 },
  copyBtn: { padding: 6 },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    ...({ shadowColor: '#0B3D36', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3 }),
  },
  action: { alignItems: 'center' },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: font.size.xs, color: colors.body, marginTop: 6, fontWeight: font.weight.medium },
  bucket: { fontSize: font.size.xs, color: colors.muted, fontWeight: font.weight.semibold, marginBottom: spacing.sm, marginLeft: spacing.xs },
});
