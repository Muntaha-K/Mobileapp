import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { colors, font } from '@/theme';

/**
 * Branded splash screen — soft blue-grey ground with abstract wave shapes and
 * a centered wordmark, echoing anb's light launch screen. Routes onward once
 * the app is ready.
 */
export default function Splash() {
  const { hasOnboarded, isAuthenticated } = useApp();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 750,
        easing: Easing.out(Easing.back(1.3)),
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      if (isAuthenticated) router.replace('/(tabs)');
      else if (hasOnboarded) router.replace('/login');
      else router.replace('/onboarding');
    }, 1700);
    return () => clearTimeout(t);
  }, [hasOnboarded, isAuthenticated, opacity, scale]);

  return (
    <View style={styles.fill}>
      <StatusBar style="dark" />
      {/* Soft decorative shapes */}
      <View style={styles.blobTop} />
      <View style={styles.waveBottom} />
      <View style={styles.waveBottom2} />

      <View style={styles.center}>
        <Animated.View style={{ opacity, transform: [{ scale }], alignItems: 'center' }}>
          <View style={styles.mark}>
            <View style={styles.markInner} />
          </View>
          <Text style={styles.logo}>anb</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const SHAPE = '#E1E9F4';

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mark: {
    width: 74,
    height: 74,
    borderRadius: 26,
    borderWidth: 9,
    borderColor: colors.primaryLight,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  markInner: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
  },
  logo: {
    color: colors.primaryLight,
    fontSize: 34,
    fontWeight: font.weight.heavy,
    letterSpacing: 1,
  },
  blobTop: {
    position: 'absolute',
    top: -160,
    left: -140,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: SHAPE,
  },
  waveBottom: {
    position: 'absolute',
    bottom: -220,
    right: -120,
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: SHAPE,
    opacity: 0.7,
  },
  waveBottom2: {
    position: 'absolute',
    bottom: -320,
    left: -80,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: SHAPE,
    opacity: 0.5,
  },
});
