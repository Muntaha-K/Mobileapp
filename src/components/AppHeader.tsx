import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, font, spacing } from '@/theme';

/** A simple stack-style header used on secondary screens. */
export function AppHeader({
  title,
  subtitle,
  right,
  onBack,
  light = false,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  light?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const fg = light ? colors.white : colors.ink;
  const handleBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(tabs)')));

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      <Pressable onPress={handleBack} hitSlop={12} style={styles.iconBtn}>
        <Ionicons name="chevron-back" size={26} color={fg} />
      </Pressable>
      <View style={styles.center}>
        <Text numberOfLines={1} style={[styles.title, { color: fg }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: light ? 'rgba(255,255,255,0.8)' : colors.muted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center' },
  right: { minWidth: 40, alignItems: 'flex-end' },
  title: { fontSize: font.size.lg, fontWeight: font.weight.bold },
  subtitle: { fontSize: font.size.xs, marginTop: 1 },
});
