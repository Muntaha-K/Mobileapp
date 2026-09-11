import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { Divider, EmptyState, Surface } from '@/components/ui';
import { TransactionRow } from '@/components/TransactionRow';
import { colors, font, radius, spacing } from '@/theme';
import { dateBucket } from '@/utils/format';

type Filter = 'all' | 'in' | 'out';
const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in', label: 'Income' },
  { id: 'out', label: 'Expenses' },
];

export default function Transactions() {
  const { transactions } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    return [...transactions]
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .filter((t) => {
        if (filter === 'in' && t.amount < 0) return false;
        if (filter === 'out' && t.amount > 0) return false;
        if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      });
  }, [transactions, query, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const tx of filtered) {
      const b = dateBucket(tx.date);
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(tx);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Transactions" right={<Ionicons name="download-outline" size={22} color={colors.ink} />} />

      <View style={styles.searchWrap}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.faint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search transactions"
            placeholderTextColor={colors.faint}
            style={styles.searchInput}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.faint} />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.chips}>
          {filters.map((f) => (
            <Pressable key={f.id} onPress={() => setFilter(f.id)} style={[styles.chip, filter === f.id && styles.chipActive]}>
              <Text style={[styles.chipText, filter === f.id && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl * 2 }} showsVerticalScrollIndicator={false}>
        {grouped.length === 0 ? (
          <EmptyState icon="search-outline" title="No transactions found" subtitle="Try a different search or filter." />
        ) : (
          grouped.map(([bucket, items]) => (
            <View key={bucket} style={{ marginBottom: spacing.md }}>
              <Text style={styles.bucket}>{bucket}</Text>
              <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
                {items.map((tx, i) => (
                  <View key={tx.id}>
                    <TransactionRow tx={tx} onPress={() => router.push(`/transaction/${tx.id}`)} />
                    {i < items.length - 1 ? <Divider inset={56} /> : null}
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

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  search: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.md, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.line,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm, paddingVertical: spacing.md, fontSize: font.size.md, color: colors.ink },
  chips: { flexDirection: 'row', marginTop: spacing.md },
  chip: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: font.size.sm, color: colors.body, fontWeight: font.weight.semibold },
  chipTextActive: { color: colors.white },
  bucket: { fontSize: font.size.xs, color: colors.muted, fontWeight: font.weight.semibold, marginBottom: spacing.sm, marginLeft: spacing.xs },
});
