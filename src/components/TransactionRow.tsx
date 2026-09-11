import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { categoryMeta } from './categories';
import { IconTile } from './ui';
import { formatMoney, formatShortDate } from '@/utils/format';
import type { Transaction } from '@/data/types';

export function TransactionRow({
  tx,
  onPress,
  showDate = false,
}: {
  tx: Transaction;
  onPress?: () => void;
  showDate?: boolean;
}) {
  const meta = categoryMeta[tx.category];
  const credit = tx.amount > 0;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
    >
      <IconTile name={meta.icon} color={meta.color} bg={meta.bg} />
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {tx.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {tx.subtitle ?? meta.label}
          {showDate ? ` · ${formatShortDate(tx.date)}` : ''}
          {tx.pending ? ' · Pending' : ''}
        </Text>
      </View>
      <View style={styles.amountWrap}>
        <Text style={[styles.amount, { color: credit ? colors.success : colors.ink }]}>
          {formatMoney(tx.amount, true)}
        </Text>
        <Text style={styles.currency}>SAR</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  middle: { flex: 1, marginLeft: spacing.md },
  title: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.ink },
  subtitle: { fontSize: font.size.sm, color: colors.muted, marginTop: 2 },
  amountWrap: { alignItems: 'flex-end' },
  amount: { fontSize: font.size.md, fontWeight: font.weight.bold },
  currency: { fontSize: font.size.xs, color: colors.faint, marginTop: 1 },
});
