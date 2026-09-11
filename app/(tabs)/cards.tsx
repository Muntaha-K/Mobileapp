import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { Screen } from '@/components/Screen';
import { BankCard } from '@/components/BankCard';
import { colors, font, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/format';

export default function Cards() {
  const insets = useSafeAreaInsets();
  const { cards, toggleCardFreeze } = useApp();

  return (
    <Screen edgesTop contentStyle={{ paddingTop: insets.top + spacing.md }}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Cards</Text>
        <Pressable onPress={() => router.push('/coming-soon')} hitSlop={8} style={styles.add}>
          <Ionicons name="add" size={22} color={colors.white} />
        </Pressable>
      </View>

      {cards.map((card) => {
        const isCredit = card.kind === 'credit';
        const available = isCredit ? (card.limit ?? 0) - card.balance : card.balance;
        return (
          <View key={card.id} style={{ marginBottom: spacing.xxl }}>
            <BankCard card={card} onPress={() => router.push(`/card/${card.id}`)} />

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>{isCredit ? 'Outstanding' : 'Balance'}</Text>
                <Text style={styles.statValue}>{formatMoney(card.balance)} SAR</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Available</Text>
                <Text style={styles.statValue}>{formatMoney(available)} SAR</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <CardAction
                icon={card.frozen ? 'sunny-outline' : 'snow-outline'}
                label={card.frozen ? 'Unfreeze' : 'Freeze'}
                active={card.frozen}
                onPress={() => toggleCardFreeze(card.id)}
              />
              <CardAction icon="eye-outline" label="Details" onPress={() => router.push(`/card/${card.id}`)} />
              <CardAction icon="options-outline" label="Settings" onPress={() => router.push(`/card/${card.id}`)} />
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

function CardAction({
  icon,
  label,
  onPress,
  active,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.action}>
      <View style={[styles.actionIcon, active && { backgroundColor: colors.primary }]}>
        <Ionicons name={icon} size={20} color={active ? colors.white : colors.primary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  screenTitle: { fontSize: font.size.display, fontWeight: font.weight.heavy, color: colors.ink },
  add: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  statLabel: { fontSize: font.size.xs, color: colors.muted },
  statValue: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.ink, marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.md },
  action: { alignItems: 'center' },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: font.size.xs, color: colors.body, marginTop: 6, fontWeight: font.weight.medium },
});
