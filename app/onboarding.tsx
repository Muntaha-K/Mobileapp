import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { Button } from '@/components/ui';
import { colors, font, radius, spacing } from '@/theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'phone-portrait-outline' as const,
    title: 'Banking in your pocket',
    body: 'Manage your accounts, cards and transfers anytime with the anb simulation experience.',
  },
  {
    icon: 'swap-horizontal-outline' as const,
    title: 'Transfer in seconds',
    body: 'Send money locally and internationally to your beneficiaries with just a few taps.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Secure by design',
    body: 'Protect access with a passcode and biometric login. Freeze cards instantly if needed.',
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  const next = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      finish();
    }
  };
  const finish = () => {
    completeOnboarding();
    router.replace('/login');
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.fill}>
      <StatusBar style="light" />
      <View style={{ paddingTop: insets.top + spacing.md, alignItems: 'center' }}>
        <Text style={styles.brand}>anb</Text>
      </View>

      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={64} color={colors.white} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing.xl }}>
        <View style={styles.card}>
          <Button
            title={index === slides.length - 1 ? 'Get Started' : 'Next'}
            onPress={next}
            variant="primary"
          />
          <Text onPress={finish} style={styles.skip}>
            {index === slides.length - 1 ? ' ' : 'Skip'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  brand: { color: colors.white, fontSize: 30, fontWeight: font.weight.heavy },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxxl },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  title: { color: colors.white, fontSize: font.size.xxl, fontWeight: font.weight.bold, textAlign: 'center' },
  body: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: font.size.md,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.xl },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginHorizontal: 4,
  },
  dotActive: { width: 22, backgroundColor: colors.white },
  card: { backgroundColor: 'transparent' },
  skip: { color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: spacing.md, fontWeight: font.weight.semibold, minHeight: 20 },
});
