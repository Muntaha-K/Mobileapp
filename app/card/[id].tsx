import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { BankCard } from '@/components/BankCard';
import { EmptyState, Surface } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/format';

export default function CardDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cardById, toggleCardFreeze } = useApp();
  const card = cardById(id);
  const [showNumber, setShowNumber] = useState(false);
  const [online, setOnline] = useState(true);
  const [contactless, setContactless] = useState(true);
  const [intl, setIntl] = useState(false);

  if (!card) {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader title="Card" />
        <EmptyState icon="card-outline" title="Card not found" />
      </View>
    );
  }

  const isCredit = card.kind === 'credit';
  const available = isCredit ? (card.limit ?? 0) - card.balance : card.balance;

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title={card.label} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }} showsVerticalScrollIndicator={false}>
        <BankCard card={card} showFull={showNumber} />

        <Pressable style={styles.reveal} onPress={() => setShowNumber((s) => !s)}>
          <Ionicons name={showNumber ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.primary} />
          <Text style={styles.revealText}>{showNumber ? 'Hide card number' : 'Show card number'}</Text>
        </Pressable>

        {/* Balance / limit */}
        <Surface style={styles.balCard}>
          <View style={styles.balRow}>
            <View style={styles.balCol}>
              <Text style={styles.balLabel}>{isCredit ? 'Outstanding' : 'Balance'}</Text>
              <Text style={styles.balValue}>{formatMoney(card.balance)} SAR</Text>
            </View>
            <View style={styles.balCol}>
              <Text style={styles.balLabel}>Available</Text>
              <Text style={styles.balValue}>{formatMoney(available)} SAR</Text>
            </View>
          </View>
          {isCredit && card.limit ? (
            <>
              <View style={styles.limitTrack}>
                <View style={[styles.limitFill, { width: `${Math.min(100, (card.balance / card.limit) * 100)}%` }]} />
              </View>
              <Text style={styles.limitText}>Credit limit {formatMoney(card.limit)} SAR</Text>
            </>
          ) : null}
        </Surface>

        {/* Freeze */}
        <Pressable style={styles.freezeCard} onPress={() => toggleCardFreeze(card.id)}>
          <View style={[styles.freezeIcon, card.frozen && { backgroundColor: colors.primary }]}>
            <Ionicons name={card.frozen ? 'snow' : 'snow-outline'} size={22} color={card.frozen ? colors.white : colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.freezeTitle}>{card.frozen ? 'Card is frozen' : 'Freeze card'}</Text>
            <Text style={styles.freezeSub}>{card.frozen ? 'Tap to unfreeze and resume use' : 'Temporarily block all transactions'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.faint} />
        </Pressable>

        {/* Controls */}
        <Text style={styles.groupTitle}>Card controls</Text>
        <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
          <ToggleRow icon="globe-outline" label="Online payments" value={online} onChange={setOnline} />
          <ToggleRow icon="radio-outline" label="Contactless" value={contactless} onChange={setContactless} />
          <ToggleRow icon="airplane-outline" label="International use" value={intl} onChange={setIntl} last />
        </Surface>

        {/* Services */}
        <Text style={styles.groupTitle}>Services</Text>
        <Surface padded={false} style={{ paddingHorizontal: spacing.lg }}>
          <LinkRow icon="keypad-outline" label="Change PIN" />
          <LinkRow icon="repeat-outline" label="Replace card" />
          {isCredit ? <LinkRow icon="cash-outline" label="Pay credit card" onPress={() => router.push('/transfer/new')} /> : null}
          <LinkRow icon="warning-outline" label="Report lost or stolen" danger last />
        </Surface>
      </ScrollView>
    </View>
  );
}

function ToggleRow({
  icon, label, value, onChange, last,
}: { icon: keyof typeof Ionicons.glyphMap; label: string; value: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary, false: colors.line }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function LinkRow({
  icon, label, onPress, danger, last,
}: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void; danger?: boolean; last?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.row, !last && styles.rowBorder]}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.primary} />
      <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.faint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  reveal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg },
  revealText: { color: colors.primary, fontWeight: font.weight.semibold, marginLeft: 8 },
  balCard: { marginTop: spacing.sm },
  balRow: { flexDirection: 'row' },
  balCol: { flex: 1 },
  balLabel: { fontSize: font.size.xs, color: colors.muted },
  balValue: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.ink, marginTop: 4 },
  limitTrack: { height: 8, borderRadius: 4, backgroundColor: colors.primarySoft, marginTop: spacing.lg, overflow: 'hidden' },
  limitFill: { height: 8, borderRadius: 4, backgroundColor: colors.accent },
  limitText: { fontSize: font.size.xs, color: colors.muted, marginTop: spacing.sm },
  freezeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  freezeIcon: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  freezeTitle: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.ink },
  freezeSub: { fontSize: font.size.xs, color: colors.muted, marginTop: 2 },
  groupTitle: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.muted, marginTop: spacing.xl, marginBottom: spacing.sm, marginLeft: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md + 2 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowLabel: { flex: 1, marginLeft: spacing.md, fontSize: font.size.md, color: colors.ink, fontWeight: font.weight.medium },
});
