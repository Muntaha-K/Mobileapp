import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, shadow, spacing } from '@/theme';

/* ------------------------------------------------------------------ Text */

type TypographyVariant =
  | 'hero'
  | 'display'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'label'
  | 'caption';

const variantStyle: Record<TypographyVariant, object> = {
  hero: { fontSize: font.size.hero, fontWeight: font.weight.heavy, color: colors.ink },
  display: { fontSize: font.size.display, fontWeight: font.weight.bold, color: colors.ink },
  title: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.ink },
  subtitle: { fontSize: font.size.lg, fontWeight: font.weight.semibold, color: colors.ink },
  body: { fontSize: font.size.md, fontWeight: font.weight.regular, color: colors.body },
  label: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.muted },
  caption: { fontSize: font.size.xs, fontWeight: font.weight.medium, color: colors.faint },
};

export function Txt({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}: TextProps & { variant?: TypographyVariant; color?: string }) {
  return (
    <Text {...rest} style={[variantStyle[variant], color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

/* ------------------------------------------------------------------ Card */

export function Surface({
  style,
  children,
  padded = true,
  ...rest
}: ViewProps & { padded?: boolean }) {
  return (
    <View
      {...rest}
      style={[styles.surface, padded && { padding: spacing.lg }, style]}
    >
      {children}
    </View>
  );
}

/* ---------------------------------------------------------------- Button */

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
  fullWidth = true,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';
  const isSecondary = variant === 'secondary';

  const bg = isPrimary
    ? colors.primary
    : isDanger
    ? colors.danger
    : isSecondary
    ? colors.primarySoft
    : 'transparent';
  const fg = isPrimary || isDanger ? colors.white : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg },
        isGhost && { backgroundColor: 'transparent' },
        fullWidth && { alignSelf: 'stretch' },
        (disabled || loading) && { opacity: 0.5 },
        pressed && !disabled && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.buttonInner}>
          {icon ? (
            <Ionicons name={icon} size={18} color={fg} style={{ marginRight: 8 }} />
          ) : null}
          <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

/* ------------------------------------------------------------- IconbadgeTile */

export function IconTile({
  name,
  color = colors.primary,
  bg = colors.primarySoft,
  size = 44,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color?: string;
  bg?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 3,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={name} size={size * 0.5} color={color} />
    </View>
  );
}

/* --------------------------------------------------------------- Avatar */

export function Avatar({
  initials,
  size = 44,
  color = colors.primary,
}: {
  initials: string;
  size?: number;
  color?: string;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: colors.white, fontWeight: font.weight.bold, fontSize: size * 0.36 }}>
        {initials.toUpperCase()}
      </Text>
    </View>
  );
}

/* ---------------------------------------------------------------- Badge */

export function Badge({
  label,
  color = colors.primary,
  bg = colors.primarySoft,
}: {
  label: string;
  color?: string;
  bg?: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={{ color, fontSize: font.size.xs, fontWeight: font.weight.semibold }}>
        {label}
      </Text>
    </View>
  );
}

/* --------------------------------------------------------- SectionHeader */

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* --------------------------------------------------------------- Divider */

export function Divider({ inset = 0 }: { inset?: number }) {
  return <View style={[styles.divider, { marginLeft: inset }]} />;
}

/* ----------------------------------------------------------- EmptyState */

export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.empty}>
      <IconTile name={icon} size={64} />
      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>{title}</Text>
      {subtitle ? (
        <Text style={{ color: colors.muted, marginTop: 4, textAlign: 'center' }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  button: {
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  buttonInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: font.size.md, fontWeight: font.weight.bold },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.ink,
  },
  sectionAction: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.primary,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl * 1.5 },
});
