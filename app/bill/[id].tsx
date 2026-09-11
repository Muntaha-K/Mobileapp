import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { Button, EmptyState, Surface } from '@/components/ui';
import { billerMeta } from '@/components/categories';
import { colors, font, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/format';

export default function PayBill() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { billers, accounts, payBill } = useApp();
  const biller = billers.find((b) => b.id === id);
  const [fromId, setFromId] = useState(accounts[0].id);
  const [amount, setAmount] = useState(biller?.dueAmount ? String(biller.dueAmount) : '');
  const [loading, setLoading] = useState(false);

  if (!biller) {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader title="Pay bill" />
        <EmptyState icon="receipt-outline" title="Biller not found" />
      </View>
    );
  }

  const meta = billerMeta[biller.category];
  const from = accounts.find((a) => a.id === fromId)!;
  const amountNum = parseFloat(amount || '0');
  const valid = amountNum > 0 && amountNum <= from.available;

  const pay = () => {
    setLoading(true);
    setTimeout(() => {
      payBill(biller.id, fromId, amountNum);
      router.replace({
        pathname: '/transfer/success',
        params: { amount: String(amountNum), toName: biller.name },
      });
    }, 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Pay bill" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
        <View style={styles.billerHead}>
          <View style={[styles.icon, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.icon} size={28} color={meta.color} />
          </View>
          <Text style={styles.billerName}>{biller.name}</Text>
          <Text style={styles.billerAccount}>Account {biller.account}</Text>
        </View>

        <Text style={styles.label}>Pay from</Text>
        {accounts.map((a) => {
          const active = a.id === fromId;
          return (
            <Pressable key={a.id} onPress={() => setFromId(a.id)} style={[styles.accRow, active && styles.accRowActive]}>
              <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={20} color={active ? colors.primary : colors.faint} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.accName}>{a.name}</Text>
                <Text style={styles.accSub}>Available {formatMoney(a.available)} SAR</Text>
              </View>
            </Pressable>
          );
        })}

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
        {amountNum > from.available ? <Text style={styles.error}>Amount exceeds available balance.</Text> : null}

        <View style={{ height: spacing.xxxl }} />
        <Button title={`Pay ${amountNum ? formatMoney(amountNum) + ' SAR' : ''}`} onPress={pay} disabled={!valid} loading={loading} icon="lock-closed" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  billerHead: { alignItems: 'center', marginVertical: spacing.lg },
  icon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  billerName: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.ink, marginTop: spacing.md },
  billerAccount: { fontSize: font.size.sm, color: colors.muted, marginTop: 2 },
  label: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.muted, marginBottom: spacing.sm },
  accRow: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, marginBottom: spacing.sm,
  },
  accRowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  accName: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.ink },
  accSub: { fontSize: font.size.xs, color: colors.muted, marginTop: 2 },
  amountBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg,
  },
  amountInput: { flex: 1, fontSize: font.size.display, fontWeight: font.weight.bold, color: colors.ink, paddingVertical: spacing.lg },
  amountCur: { fontSize: font.size.lg, color: colors.muted, fontWeight: font.weight.semibold },
  error: { color: colors.danger, fontSize: font.size.xs, marginTop: spacing.sm },
});
