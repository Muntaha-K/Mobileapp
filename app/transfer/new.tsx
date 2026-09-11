import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { Avatar, Button } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';
import { formatMoney, initials } from '@/utils/format';

export default function NewTransfer() {
  const params = useLocalSearchParams<{ type?: string; beneficiaryId?: string }>();
  const { accounts, beneficiaries } = useApp();

  const [fromId, setFromId] = useState(accounts[0].id);
  const [beneficiaryId, setBeneficiaryId] = useState<string | undefined>(params.beneficiaryId);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const from = accounts.find((a) => a.id === fromId)!;
  const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId);
  const amountNum = parseFloat(amount || '0');

  const filteredBeneficiaries = useMemo(() => {
    if (params.type === 'intl') return beneficiaries.filter((b) => b.channel === 'international');
    if (params.type === 'local' || params.type === 'anb')
      return beneficiaries.filter((b) => b.channel === 'local');
    return beneficiaries;
  }, [beneficiaries, params.type]);

  const title =
    params.type === 'own'
      ? 'Between my accounts'
      : params.type === 'intl'
      ? 'International transfer'
      : params.type === 'anb'
      ? 'To anb account'
      : params.type === 'local'
      ? 'Local transfer'
      : 'New transfer';

  const isOwn = params.type === 'own';
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id);

  const valid =
    amountNum > 0 &&
    amountNum <= from.available &&
    (isOwn ? toAccountId && toAccountId !== fromId : !!beneficiary);

  const onContinue = () => {
    if (!valid) return;
    const toAccount = accounts.find((a) => a.id === toAccountId);
    router.push({
      pathname: '/transfer/confirm',
      params: {
        fromId,
        amount: String(amountNum),
        note,
        toName: isOwn ? toAccount?.name ?? '' : beneficiary?.name ?? '',
        toIban: isOwn ? toAccount?.iban ?? '' : beneficiary?.iban ?? '',
        toBank: isOwn ? 'anb' : beneficiary?.bank ?? '',
        type: params.type ?? 'local',
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title={title} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* From account */}
        <Text style={styles.label}>From account</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xl }}>
          {accounts.map((a) => {
            const active = a.id === fromId;
            return (
              <Pressable key={a.id} onPress={() => setFromId(a.id)} style={[styles.accCard, active && styles.accCardActive]}>
                <Text style={[styles.accCardName, active && { color: colors.white }]} numberOfLines={1}>{a.name}</Text>
                <Text style={[styles.accCardBal, active && { color: colors.white }]}>{formatMoney(a.balance)} SAR</Text>
                <Text style={[styles.accCardAvail, active && { color: 'rgba(255,255,255,0.8)' }]}>
                  Available {formatMoney(a.available)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Destination */}
        {isOwn ? (
          <>
            <Text style={styles.label}>To account</Text>
            {accounts.filter((a) => a.id !== fromId).map((a) => {
              const active = a.id === toAccountId;
              return (
                <Pressable key={a.id} onPress={() => setToAccountId(a.id)} style={[styles.destRow, active && styles.destRowActive]}>
                  <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={20} color={active ? colors.primary : colors.faint} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.destName}>{a.name}</Text>
                    <Text style={styles.destSub}>{formatMoney(a.balance)} SAR</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        ) : (
          <>
            <View style={styles.labelRow}>
              <Text style={styles.label}>To beneficiary</Text>
              <Pressable onPress={() => router.push('/beneficiaries')}>
                <Text style={styles.addLink}>+ Add new</Text>
              </Pressable>
            </View>
            {filteredBeneficiaries.map((b) => {
              const active = b.id === beneficiaryId;
              return (
                <Pressable key={b.id} onPress={() => setBeneficiaryId(b.id)} style={[styles.destRow, active && styles.destRowActive]}>
                  <Avatar initials={initials(b.name)} size={40} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.destName}>{b.name}</Text>
                    <Text style={styles.destSub}>{b.bank} · {b.iban.slice(0, 6)}••••</Text>
                  </View>
                  {active ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : null}
                </Pressable>
              );
            })}
          </>
        )}

        {/* Amount */}
        <Text style={[styles.label, { marginTop: spacing.xl }]}>Amount</Text>
        <View style={styles.amountBox}>
          <TextInput
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            placeholderTextColor={colors.faint}
            keyboardType="decimal-pad"
            style={styles.amountInput}
          />
          <Text style={styles.amountCur}>SAR</Text>
        </View>
        {amountNum > from.available ? (
          <Text style={styles.errorText}>Amount exceeds available balance.</Text>
        ) : null}

        {/* Note */}
        <Text style={[styles.label, { marginTop: spacing.xl }]}>Note (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Rent, gift, salary…"
          placeholderTextColor={colors.faint}
          style={styles.noteInput}
        />

        <View style={{ height: spacing.xxxl }} />
        <Button title="Continue" onPress={onContinue} disabled={!valid} icon="arrow-forward" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl * 2 },
  label: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.muted, marginBottom: spacing.sm },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addLink: { color: colors.primary, fontWeight: font.weight.semibold, fontSize: font.size.sm, marginBottom: spacing.sm },
  accCard: {
    width: 190,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginRight: spacing.md,
  },
  accCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  accCardName: { fontSize: font.size.sm, color: colors.muted, fontWeight: font.weight.medium },
  accCardBal: { fontSize: font.size.lg, color: colors.ink, fontWeight: font.weight.bold, marginTop: 6 },
  accCardAvail: { fontSize: font.size.xs, color: colors.faint, marginTop: 3 },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.sm,
  },
  destRowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  destName: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.ink },
  destSub: { fontSize: font.size.xs, color: colors.muted, marginTop: 2 },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
  },
  amountInput: { flex: 1, fontSize: font.size.display, fontWeight: font.weight.bold, color: colors.ink, paddingVertical: spacing.lg },
  amountCur: { fontSize: font.size.lg, color: colors.muted, fontWeight: font.weight.semibold },
  errorText: { color: colors.danger, fontSize: font.size.xs, marginTop: spacing.sm },
  noteInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: font.size.md,
    color: colors.ink,
  },
});
