import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { Button, EmptyState, Surface } from '@/components/ui';
import { categoryMeta } from '@/components/categories';
import { colors, font, radius, spacing } from '@/theme';
import { formatMoney, formatDate } from '@/utils/format';

export default function TransactionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, accountById } = useApp();
  const tx = transactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader title="Transaction" />
        <EmptyState icon="receipt-outline" title="Transaction not found" />
      </View>
    );
  }

  const meta = categoryMeta[tx.category];
  const account = accountById(tx.accountId);
  const credit = tx.amount > 0;
  const d = new Date(tx.date);
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Transaction details" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <View style={styles.hero}>
          <View style={[styles.icon, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.icon} size={34} color={meta.color} />
          </View>
          <Text style={styles.title}>{tx.title}</Text>
          <Text style={[styles.amount, { color: credit ? colors.success : colors.ink }]}>
            {formatMoney(tx.amount, true)} SAR
          </Text>
          <View style={[styles.statusPill, { backgroundColor: tx.pending ? '#FBF3D9' : colors.successSoft }]}>
            <Ionicons
              name={tx.pending ? 'time-outline' : 'checkmark-circle'}
              size={14}
              color={tx.pending ? colors.warning : colors.success}
            />
            <Text style={[styles.statusText, { color: tx.pending ? colors.warning : colors.success }]}>
              {tx.pending ? 'Pending' : 'Completed'}
            </Text>
          </View>
        </View>

        <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
          <Row label="Category" value={meta.label} />
          <Div />
          <Row label="Date" value={formatDate(tx.date)} />
          <Div />
          <Row label="Time" value={time} />
          <Div />
          <Row label="From account" value={account?.name ?? '—'} />
          <Div />
          <Row label="Reference" value={`REF${tx.id.toUpperCase()}00`} />
        </Surface>

        <View style={{ height: spacing.xl }} />
        <Button title="Share receipt" variant="secondary" icon="share-outline" onPress={() => {}} />
        <Button title="Report an issue" variant="ghost" onPress={() => {}} />
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}
function Div() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginVertical: spacing.xl },
  icon: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.ink, marginTop: spacing.md },
  amount: { fontSize: font.size.display, fontWeight: font.weight.heavy, marginTop: spacing.xs },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.pill, marginTop: spacing.md },
  statusText: { fontSize: font.size.xs, fontWeight: font.weight.semibold, marginLeft: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  rowLabel: { fontSize: font.size.sm, color: colors.muted },
  rowValue: { fontSize: font.size.md, color: colors.ink, fontWeight: font.weight.semibold },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
});
