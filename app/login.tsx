import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { colors, font, radius, spacing } from '@/theme';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'];

export default function Login() {
  const insets = useSafeAreaInsets();
  const { login, loginBiometric, user } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (code.length === 4) {
      const ok = login(code);
      if (ok) {
        router.replace('/(tabs)');
      } else {
        setError(true);
        Vibration.vibrate(200);
        setTimeout(() => {
          setCode('');
          setError(false);
        }, 600);
      }
    }
  }, [code, login]);

  const onKey = (k: string) => {
    if (k === 'del') return setCode((c) => c.slice(0, -1));
    if (k === 'bio') {
      loginBiometric();
      return router.replace('/(tabs)');
    }
    setCode((c) => (c.length < 4 ? c + k : c));
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.fill}>
      <StatusBar style="light" />
      <View style={{ paddingTop: insets.top + spacing.xxxl, alignItems: 'center' }}>
        <Text style={styles.brand}>anb</Text>
        <Text style={styles.welcome}>Welcome back, {user.firstName}</Text>
        <Text style={styles.hint}>Enter your 4-digit passcode</Text>

        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                code.length > i && styles.dotFilled,
                error && styles.dotError,
              ]}
            />
          ))}
        </View>
        <Text style={styles.demo}>Demo passcode: 1234 · or use biometrics</Text>
      </View>

      <View style={[styles.keypad, { paddingBottom: insets.bottom + spacing.xl }]}>
        {KEYS.map((k) => (
          <Pressable
            key={k}
            onPress={() => onKey(k)}
            style={({ pressed }) => [styles.key, pressed && k.length === 1 && styles.keyPressed]}
          >
            {k === 'del' ? (
              <Ionicons name="backspace-outline" size={26} color={colors.white} />
            ) : k === 'bio' ? (
              <Ionicons name="finger-print" size={30} color={colors.white} />
            ) : (
              <Text style={styles.keyText}>{k}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'space-between' },
  brand: { color: colors.white, fontSize: 40, fontWeight: font.weight.heavy },
  welcome: { color: colors.white, fontSize: font.size.xl, fontWeight: font.weight.bold, marginTop: spacing.xl },
  hint: { color: 'rgba(255,255,255,0.8)', fontSize: font.size.md, marginTop: spacing.xs },
  dots: { flexDirection: 'row', marginTop: spacing.xxxl },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    marginHorizontal: spacing.md,
  },
  dotFilled: { backgroundColor: colors.white },
  dotError: { borderColor: '#FFB4B4', backgroundColor: '#FFB4B4' },
  demo: { color: 'rgba(255,255,255,0.65)', fontSize: font.size.xs, marginTop: spacing.xl },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xxxl,
    justifyContent: 'space-between',
  },
  key: {
    width: '30%',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
    borderRadius: radius.lg,
  },
  keyPressed: { backgroundColor: 'rgba(255,255,255,0.14)' },
  keyText: { color: colors.white, fontSize: 30, fontWeight: font.weight.medium },
});
