import React, { useState } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { Screen } from '@/components/Screen';
import { IconTile, Surface, Txt } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/format';
import type { AccountType } from '@/data/types';

const typeIcon: Record<AccountType, keyof typeof Ionicons.glyphMap> = {
  current: 'card-outline',
  savings: 'trending-up-outline',
  investment: 'stats-chart-outline',
};

export default function Accounts() {
  const insets = useSafeAreaInsets();
  const { accounts, totalBalance } = useApp();
  const [hidden, setHidden] = useState(false);

  return (
    <Screen edgesTop contentStyle={{ paddingTop: insets.top + spacing.md }}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Accounts</Text>
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} style={styles.eye}>
          <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.primary} />
        </Pressable>
      </View>

      <Surface style={styles.summary}>
        <Txt variant="label" color="rgba(255,255,255,0.85)">Total balance</Txt>
        <Text style={styles.summaryValue}>
          {hidden ? '•••••••' : formatMoney(totalBalance)} <Text style={styles.summaryCur}>SAR</Text>
        </Text>
        <Text style={styles.summarySub}>{accounts.length} active accounts</Text>
      </Surface>

      <View style={{ marginTop: spacing.xl }}>
        {accounts.map((a) => (
          <Pressable
            key={a.id}
            onPress={() => router.push(`/account/${a.id}`)}
            style={({ pressed }) => [styles.accRow, pressed && { opacity: 0.7 }]}
          >
            <IconTile name={typeIcon[a.type]} size={48} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.accName}>{a.name}</Text>
              <Text style={styles.accIban}>{a.iban.replace(/(.{4}) (.{4}).*(.{4})$/, '$1 •••• $3')}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.accBalance}>{hidden ? '••••' : formatMoney(a.balance)}</Text>
              <Text style={styles.accCur}>SAR</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.faint} style={{ marginLeft: 6 }} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.openNew} onPress={() => router.push('/coming-soon')}>
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.openNewText}>Open a new account</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  screenTitle: { fontSize: font.size.display, fontWeight: font.weight.heavy, color: colors.ink },
  eye: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  summary: { backgroundColor: colors.primary, borderRadius: radius.xl },
  summaryValue: { color: colors.white, fontSize: font.size.display, fontWeight: font.weight.heavy, marginTop: 6 },
  summaryCur: { fontSize: font.size.md, fontWeight: font.weight.semibold },
  summarySub: { color: 'rgba(255,255,255,0.8)', fontSize: font.size.xs, marginTop: 4 },
  accRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  accName: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.ink },
  accIban: { fontSize: font.size.xs, color: colors.muted, marginTop: 3 },
  accBalance: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.ink },
  accCur: { fontSize: font.size.xs, color: colors.faint },
  openNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    borderStyle: 'dashed',
  },
  openNewText: { color: colors.primary, fontWeight: font.weight.semibold, marginLeft: 8 },
});
