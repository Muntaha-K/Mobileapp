import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { Avatar, IconTile, SectionHeader, Surface, Txt, Divider } from '@/components/ui';
import { TransactionRow } from '@/components/TransactionRow';
import { BankCard } from '@/components/BankCard';
import { colors, font, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/format';
import { quickActions, insights } from '@/data/mock';
import { initials } from '@/utils/format';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { user, totalBalance, accounts, cards, transactions } = useApp();
  const [hidden, setHidden] = useState(false);

  const recent = [...transactions]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 5);

  const budgetPct = Math.min(1, insights.spentThisMonth / insights.budget);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceAlt }}>
      <StatusBar style="light" />
      {/* Gradient header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: insets.top + spacing.md }]}
      >
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar initials={initials(user.name)} color="rgba(255,255,255,0.2)" />
            <View style={{ marginLeft: spacing.md }}>
              <Text style={styles.greeting}>{user.greetingAr} 👋</Text>
              <Text style={styles.name}>{user.name}</Text>
            </View>
          </View>
          <Pressable onPress={() => router.push('/notifications')} hitSlop={8} style={styles.bell}>
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {/* Total balance */}
        <View style={styles.balanceBlock}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.balanceLabel}>Total balance</Text>
            <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} style={{ marginLeft: 8 }}>
              <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={16} color="rgba(255,255,255,0.85)" />
            </Pressable>
          </View>
          <Text style={styles.balanceValue}>
            {hidden ? '•••••••' : formatMoney(totalBalance)}{' '}
            <Text style={styles.balanceCurrency}>SAR</Text>
          </Text>
          <Text style={styles.balanceSub}>Across {accounts.length} accounts</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick actions */}
        <Surface style={styles.quickCard}>
          <View style={styles.quickRow}>
            {quickActions.map((qa) => (
              <Pressable
                key={qa.id}
                style={styles.quick}
                onPress={() => router.push(qa.route as any)}
              >
                <IconTile name={qa.icon as any} />
                <Text style={styles.quickLabel}>{qa.label}</Text>
              </Pressable>
            ))}
          </View>
        </Surface>

        {/* Accounts snapshot */}
        <View style={styles.section}>
          <SectionHeader title="My accounts" actionLabel="See all" onAction={() => router.push('/(tabs)/accounts')} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing.lg }}
          >
            {accounts.map((a) => (
              <Pressable key={a.id} onPress={() => router.push(`/account/${a.id}`)} style={styles.accChip}>
                <View style={styles.accIcon}>
                  <Ionicons
                    name={a.type === 'savings' ? 'trending-up' : a.type === 'investment' ? 'stats-chart' : 'card'}
                    size={18}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.accName} numberOfLines={1}>{a.name}</Text>
                <Text style={styles.accBalance}>{hidden ? '••••' : formatMoney(a.balance)} SAR</Text>
                <Text style={styles.accType}>{a.type.toUpperCase()}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Spending insight */}
        <View style={styles.section}>
          <Surface>
            <View style={styles.insightTop}>
              <View>
                <Txt variant="label">Spending this month</Txt>
                <Text style={styles.insightValue}>{formatMoney(insights.spentThisMonth)} SAR</Text>
              </View>
              <View style={styles.insightBadge}>
                <Ionicons name="pie-chart-outline" size={16} color={colors.primary} />
                <Text style={styles.insightBadgeText}>{insights.topCategory}</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${budgetPct * 100}%` }]} />
            </View>
            <Text style={styles.insightHint}>
              {formatMoney(insights.spentThisMonth)} of {formatMoney(insights.budget)} SAR budget
            </Text>
          </Surface>
        </View>

        {/* Cards preview */}
        <View style={styles.section}>
          <SectionHeader title="My cards" actionLabel="Manage" onAction={() => router.push('/(tabs)/cards')} />
          <BankCard card={cards[0]} onPress={() => router.push(`/card/${cards[0].id}`)} />
        </View>

        {/* Recent transactions */}
        <View style={styles.section}>
          <SectionHeader title="Recent activity" actionLabel="View all" onAction={() => router.push('/transactions')} />
          <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
            {recent.map((tx, i) => (
              <View key={tx.id}>
                <TransactionRow tx={tx} showDate onPress={() => router.push(`/transaction/${tx.id}`)} />
                {i < recent.length - 1 ? <Divider inset={56} /> : null}
              </View>
            ))}
          </Surface>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl + spacing.lg,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: font.size.sm },
  name: { color: colors.white, fontSize: font.size.lg, fontWeight: font.weight.bold, marginTop: 1 },
  bell: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  balanceBlock: { marginTop: spacing.xxl },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: font.size.sm },
  balanceValue: { color: colors.white, fontSize: font.size.hero, fontWeight: font.weight.heavy, marginTop: 4 },
  balanceCurrency: { fontSize: font.size.lg, fontWeight: font.weight.semibold },
  balanceSub: { color: 'rgba(255,255,255,0.75)', fontSize: font.size.xs, marginTop: 4 },

  quickCard: { marginHorizontal: spacing.lg, marginTop: -spacing.xxxl, borderRadius: radius.lg },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quick: { alignItems: 'center', flex: 1 },
  quickLabel: { fontSize: font.size.xs, color: colors.body, marginTop: 6, fontWeight: font.weight.semibold },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xxl },
  accChip: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  accIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  accName: { fontSize: font.size.sm, color: colors.muted, fontWeight: font.weight.medium },
  accBalance: { fontSize: font.size.lg, color: colors.ink, fontWeight: font.weight.bold, marginTop: 4 },
  accType: { fontSize: 9, color: colors.faint, marginTop: 4, letterSpacing: 1 },

  insightTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  insightValue: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.ink, marginTop: 2 },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  insightBadgeText: { color: colors.primary, fontSize: font.size.xs, fontWeight: font.weight.semibold, marginLeft: 4 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.primarySoft, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  insightHint: { fontSize: font.size.xs, color: colors.muted, marginTop: spacing.sm },
});
