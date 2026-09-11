import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, shadow, spacing } from '@/theme';
import { maskNumber } from '@/utils/format';
import type { Card } from '@/data/types';

const networkLabel: Record<Card['type'], string> = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  mada: 'mada',
};

/** A realistic payment-card visual used across the app. */
export function BankCard({
  card,
  onPress,
  width,
  showFull = false,
}: {
  card: Card;
  onPress?: () => void;
  width?: number;
  showFull?: boolean;
}) {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={[styles.shadow, width ? { width } : undefined]}>
      <LinearGradient
        colors={card.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.brand}>anb</Text>
            <Text style={styles.label}>{card.kind === 'credit' ? 'Credit' : 'Debit'}</Text>
          </View>
          {card.frozen ? (
            <View style={styles.frozen}>
              <Ionicons name="snow-outline" size={13} color={colors.white} />
              <Text style={styles.frozenText}>Frozen</Text>
            </View>
          ) : (
            <Ionicons name="wifi" size={22} color="rgba(255,255,255,0.85)" style={{ transform: [{ rotate: '90deg' }] }} />
          )}
        </View>

        <View style={styles.chip} />

        <Text style={styles.number}>
          {showFull ? card.number : maskNumber(card.number)}
        </Text>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.smallLabel}>CARD HOLDER</Text>
            <Text style={styles.value}>{card.holder}</Text>
          </View>
          <View>
            <Text style={styles.smallLabel}>EXPIRES</Text>
            <Text style={styles.value}>{card.expiry}</Text>
          </View>
          <Text style={styles.network}>{networkLabel[card.type]}</Text>
        </View>
      </LinearGradient>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  shadow: { ...shadow.floating, borderRadius: radius.xl },
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    aspectRatio: 1.586, // ISO/IEC 7810 ID-1 ratio
    justifyContent: 'space-between',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { color: colors.white, fontSize: 26, fontWeight: font.weight.heavy, letterSpacing: 0.5 },
  label: { color: 'rgba(255,255,255,0.85)', fontSize: font.size.xs, marginTop: 2, letterSpacing: 1 },
  chip: {
    width: 42,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  number: {
    color: colors.white,
    fontSize: font.size.xl,
    fontWeight: font.weight.semibold,
    letterSpacing: 2,
  },
  bottomRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  smallLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 9, letterSpacing: 1 },
  value: { color: colors.white, fontSize: font.size.sm, fontWeight: font.weight.semibold, marginTop: 2 },
  network: { color: colors.white, fontSize: font.size.md, fontWeight: font.weight.heavy, fontStyle: 'italic' },
  frozen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  frozenText: { color: colors.white, fontSize: font.size.xs, marginLeft: 4, fontWeight: font.weight.semibold },
});
