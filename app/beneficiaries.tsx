import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { AppHeader } from '@/components/AppHeader';
import { Avatar, Button, EmptyState } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';
import { initials } from '@/utils/format';
import type { BeneficiaryChannel } from '@/data/types';

export default function Beneficiaries() {
  const insets = useSafeAreaInsets();
  const { beneficiaries, addBeneficiary, removeBeneficiary } = useApp();
  const [tab, setTab] = useState<BeneficiaryChannel>('local');
  const [modal, setModal] = useState(false);

  const list = beneficiaries.filter((b) => b.channel === tab);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title="Beneficiaries"
        right={
          <Pressable onPress={() => setModal(true)} hitSlop={8}>
            <Ionicons name="add" size={26} color={colors.primary} />
          </Pressable>
        }
      />

      <View style={styles.tabs}>
        {(['local', 'international'] as BeneficiaryChannel[]).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'local' ? 'Local' : 'International'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <EmptyState icon="people-outline" title="No beneficiaries yet" subtitle="Add someone to start sending money." />
        ) : (
          list.map((b) => (
            <View key={b.id} style={styles.row}>
              <Avatar initials={initials(b.name)} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.name}>{b.name}</Text>
                  {b.favorite ? <Ionicons name="star" size={14} color={colors.accent} style={{ marginLeft: 6 }} /> : null}
                </View>
                <Text style={styles.sub}>{b.bank}</Text>
                <Text style={styles.iban}>{b.iban}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: spacing.sm }}>
                <Pressable
                  onPress={() => router.push({ pathname: '/transfer/new', params: { beneficiaryId: b.id, type: b.channel === 'international' ? 'intl' : 'local' } })}
                  style={styles.sendBtn}
                >
                  <Ionicons name="paper-plane-outline" size={16} color={colors.white} />
                  <Text style={styles.sendText}>Send</Text>
                </Pressable>
                <Pressable onPress={() => removeBeneficiary(b.id)} hitSlop={6}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <AddBeneficiaryModal
        visible={modal}
        channel={tab}
        onClose={() => setModal(false)}
        onAdd={(b) => {
          addBeneficiary(b);
          setModal(false);
        }}
        bottomInset={insets.bottom}
      />
    </View>
  );
}

function AddBeneficiaryModal({
  visible, channel, onClose, onAdd, bottomInset,
}: {
  visible: boolean;
  channel: BeneficiaryChannel;
  onClose: () => void;
  onAdd: (b: { name: string; bank: string; iban: string; channel: BeneficiaryChannel; nickname?: string }) => void;
  bottomInset: number;
}) {
  const [name, setName] = useState('');
  const [bank, setBank] = useState('');
  const [iban, setIban] = useState('');

  const valid = name.trim() && bank.trim() && iban.trim().length >= 8;

  const submit = () => {
    if (!valid) return;
    onAdd({ name: name.trim(), bank: bank.trim(), iban: iban.trim().toUpperCase(), channel });
    setName(''); setBank(''); setIban('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: bottomInset + spacing.xl }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>New {channel} beneficiary</Text>

          <Text style={styles.fieldLabel}>Full name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="e.g. Mohammed Ali" placeholderTextColor={colors.faint} style={styles.input} />

          <Text style={styles.fieldLabel}>Bank</Text>
          <TextInput value={bank} onChangeText={setBank} placeholder="e.g. Al Rajhi Bank" placeholderTextColor={colors.faint} style={styles.input} />

          <Text style={styles.fieldLabel}>IBAN</Text>
          <TextInput
            value={iban}
            onChangeText={setIban}
            placeholder={channel === 'local' ? 'SA00 0000 …' : 'Country IBAN'}
            placeholderTextColor={colors.faint}
            autoCapitalize="characters"
            style={styles.input}
          />

          <View style={{ height: spacing.lg }} />
          <Button title="Add beneficiary" onPress={submit} disabled={!valid} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.md, padding: 4, borderWidth: 1, borderColor: colors.line },
  tab: { flex: 1, paddingVertical: spacing.sm + 2, alignItems: 'center', borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: font.size.sm, color: colors.body, fontWeight: font.weight.semibold },
  tabTextActive: { color: colors.white },
  row: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.line,
  },
  name: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.ink },
  sub: { fontSize: font.size.sm, color: colors.muted, marginTop: 2 },
  iban: { fontSize: font.size.xs, color: colors.faint, marginTop: 2 },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary,
    paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill,
  },
  sendText: { color: colors.white, fontSize: font.size.xs, fontWeight: font.weight.semibold, marginLeft: 4 },
  remove: { color: colors.danger, fontSize: font.size.xs, fontWeight: font.weight.medium },
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, padding: spacing.xl },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.line, alignSelf: 'center', marginBottom: spacing.lg },
  sheetTitle: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.ink, marginBottom: spacing.lg },
  fieldLabel: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.muted, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, fontSize: font.size.md, color: colors.ink, borderWidth: 1, borderColor: colors.line,
  },
});
