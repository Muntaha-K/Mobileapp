import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { Button, Surface } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/format';

export default function ConfirmTransfer() {
  const p = useLocalSearchParams<{
    fromId: string;
    amount: string;
    note: string;
    toName: string;
    toIban: string;
    toBank: string;
    type: string;
  }>();
  const { accountById, makeTransfer } = useApp();
  const [loading, setLoading] = useState(false);

  const from = accountById(p.fromId);
  const amount = parseFloat(p.amount);
  const fee = p.type === 'intl' ? 25 : 0;
  const total = amount + fee;

  const confirm = () => {
    setLoading(true);
    setTimeout(() => {
      makeTransfer({
        fromAccountId: p.fromId,
        toName: p.toName,
        toIban: p.toIban,
        amount,
        note: p.note,
      });
      router.replace({
        pathname: '/transfer/success',
        params: { amount: String(amount), toName: p.toName },
      });
    }, 1100);
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Confirm transfer" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.amountHero}>
          <Text style={styles.amountLabel}>You are sending</Text>
          <Text style={styles.amountValue}>{formatMoney(amount)} <Text style={styles.cur}>SAR</Text></Text>
        </View>

        <Surface padded={false} style={styles.card}>
          <Row label="From" value={from?.name ?? ''} sub={from?.iban} />
          <Divider />
          <Row label="To" value={p.toName} sub={`${p.toBank} · ${p.toIban}`} />
          <Divider />
          <Row label="Amount" value={`${formatMoney(amount)} SAR`} />
          <Divider />
          <Row label="Fees" value={fee ? `${formatMoney(fee)} SAR` : 'Free'} />
          {p.note ? (
            <>
              <Divider />
              <Row label="Note" value={p.note} />
            </>
          ) : null}
          <Divider />
          <Row label="Total" value={`${formatMoney(total)} SAR`} bold />
        </Surface>

        <View style={styles.secure}>
          <Ionicons name="shield-checkmark" size={16} color={colors.success} />
          <Text style={styles.secureText}>Protected by anb secure transfer</Text>
        </View>

        <View style={{ height: spacing.xl }} />
        <Button title="Confirm & send" onPress={confirm} loading={loading} icon="lock-closed" />
        <Button title="Cancel" onPress={() => router.back()} variant="ghost" />
      </ScrollView>
    </View>
  );
}

function Row({ label, value, sub, bold }: { label: string; value: string; sub?: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={[styles.rowValue, bold && { fontSize: font.size.lg, color: colors.primary }]} numberOfLines={2}>
          {value}
        </Text>
        {sub ? <Text style={styles.rowSub} numberOfLines={1}>{sub}</Text> : null}
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  amountHero: { alignItems: 'center', marginVertical: spacing.xl },
  amountLabel: { color: colors.muted, fontSize: font.size.sm },
  amountValue: { color: colors.ink, fontSize: font.size.hero, fontWeight: font.weight.heavy, marginTop: 6 },
  cur: { fontSize: font.size.lg, fontWeight: font.weight.semibold, color: colors.muted },
  card: { paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.lg },
  rowLabel: { fontSize: font.size.sm, color: colors.muted, width: 70 },
  rowValue: { fontSize: font.size.md, color: colors.ink, fontWeight: font.weight.semibold, textAlign: 'right' },
  rowSub: { fontSize: font.size.xs, color: colors.faint, marginTop: 2, textAlign: 'right' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  secure: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  secureText: { color: colors.muted, fontSize: font.size.xs, marginLeft: 6 },
});
