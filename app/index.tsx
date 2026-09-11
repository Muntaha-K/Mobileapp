import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { colors, font } from '@/theme';

/** Branded splash screen that routes onward once the app is ready. */
export default function Splash() {
  const { hasOnboarded, isAuthenticated } = useApp();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      if (isAuthenticated) router.replace('/(tabs)');
      else if (hasOnboarded) router.replace('/login');
      else router.replace('/onboarding');
    }, 1600);
    return () => clearTimeout(t);
  }, [hasOnboarded, isAuthenticated, opacity, scale]);

  return (
    <View style={styles.fill}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.fill}
      >
        <View style={styles.center}>
          <Animated.View style={{ opacity, transform: [{ scale }] }}>
            <Text style={styles.logo}>anb</Text>
            <Text style={styles.tag}>simulation</Text>
          </Animated.View>
        </View>
        <Animated.Text style={[styles.footer, { opacity }]}>
          Arab National Bank · demo experience
        </Animated.Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { color: colors.white, fontSize: 64, fontWeight: font.weight.heavy, letterSpacing: 1, textAlign: 'center' },
  tag: { color: 'rgba(255,255,255,0.85)', fontSize: font.size.lg, letterSpacing: 6, textAlign: 'center', marginTop: 4 },
  footer: { color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginBottom: 48, fontSize: font.size.sm },
});
