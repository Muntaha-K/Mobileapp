import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

/**
 * Standard screen wrapper. Handles safe-area padding and an optional
 * scroll container so individual screens stay focused on content.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  background = colors.surfaceAlt,
  contentStyle,
  edgesTop = false,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
  edgesTop?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const pad = {
    paddingHorizontal: padded ? spacing.lg : 0,
    paddingTop: edgesTop ? insets.top + spacing.sm : spacing.sm,
    paddingBottom: insets.bottom + spacing.xxxl,
  };

  if (scroll) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: background }}
        contentContainerStyle={[pad, contentStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <View style={[styles.flex, { backgroundColor: background }, pad, contentStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
