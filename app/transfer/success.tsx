import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/format';

export default function TransferSuccess() {
  const insets = useSafeAreaInsets();
  const { amount, toName } = useLocalSearchParams<{ amount: string; toName: string }>();
  const scale = useRef(new Animated.Value(0)).current;
  const ref = `TRX${Math.floor(100000000 + Math.random() * 899999999)}`;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <View style={[styles.fill, { paddingTop: insets.top }]}>
      <View style={styles.center}>
        <Animated.View style={[styles.check, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark" size={64} color={colors.white} />
        </Animated.View>
        <Text style={styles.title}>Transfer successful</Text>
        <Text style={styles.subtitle}>
          {formatMoney(parseFloat(amount || '0'))} SAR sent to {toName}
        </Text>

        <View style={styles.refBox}>
          <Text style={styles.refLabel}>Reference number</Text>
          <Text style={styles.refValue}>{ref}</Text>
        </View>
      </View>

      <View style={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.lg }}>
        <Button title="Share receipt" variant="secondary" icon="share-outline" onPress={() => {}} />
        <Button title="Done" onPress={() => router.replace('/(tabs)')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.surfaceAlt, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  check: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { fontSize: font.size.xxl, fontWeight: font.weight.heavy, color: colors.ink },
  subtitle: { fontSize: font.size.md, color: colors.muted, marginTop: spacing.sm, textAlign: 'center' },
  refBox: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  refLabel: { fontSize: font.size.xs, color: colors.muted },
  refValue: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.ink, marginTop: 4, letterSpacing: 1 },
});
