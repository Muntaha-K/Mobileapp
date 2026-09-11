import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/state/AppContext';
import { colors, font, radius, spacing } from '@/theme';

type Lang = 'ar' | 'en';

const T = {
  ar: {
    welcome: 'مرحباً',
    name: 'Mun K',
    password: 'كلمة المرور',
    changeUser: 'تغيير المستخدم',
    forgot: 'نسيت بيانات الدخول؟',
    login: 'تسجيل الدخول',
    quick: 'الدخول السريع',
    joinPre: 'الانضمام الى anb؟ ',
    joinLink: 'سجل الأن',
    toggle: 'English',
    demo: 'للتجربة: أدخل أي كلمة مرور',
  },
  en: {
    welcome: 'Welcome',
    name: 'Mun K',
    password: 'Password',
    changeUser: 'Change user',
    forgot: 'Forgot login details?',
    login: 'Login',
    quick: 'Quick login',
    joinPre: 'New to anb? ',
    joinLink: 'Register now',
    toggle: 'العربية',
    demo: 'Demo: enter any password',
  },
};

export default function Login() {
  const insets = useSafeAreaInsets();
  const { loginBiometric } = useApp();
  const [lang, setLang] = useState<Lang>('ar');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const t = T[lang];
  const rtl = lang === 'ar';
  const canLogin = password.trim().length > 0;

  const submit = () => {
    if (!canLogin) return;
    loginBiometric();
    router.replace('/(tabs)');
  };
  const quick = () => {
    loginBiometric();
    router.replace('/(tabs)');
  };

  // Direction-aware row helper
  const row = (extra?: object) => [
    styles.row,
    { flexDirection: (rtl ? 'row-reverse' : 'row') as 'row' | 'row-reverse' },
    extra,
  ];
  const textAlign = rtl ? ('right' as const) : ('left' as const);

  return (
    <View style={styles.fill}>
      <StatusBar style="dark" />
      {/* Decorative shapes */}
      <View style={styles.blobTop} />
      <View style={styles.waveBottom} />

      {/* Top bar */}
      <View style={[styles.topBar, row(), { paddingTop: insets.top + spacing.sm }]}>
        <View style={[styles.topGroup, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <Pressable onPress={() => setLang(rtl ? 'en' : 'ar')} hitSlop={8}>
            <Text style={styles.link}>{t.toggle}</Text>
          </Pressable>
          <Ionicons name="headset-outline" size={22} color={colors.primary} style={{ marginHorizontal: spacing.md }} />
        </View>
        <Ionicons name="menu" size={26} color={colors.primary} />
      </View>

      <View style={styles.body}>
        {/* Wordmark */}
        <Text style={styles.wordmark}>anb</Text>

        {/* Greeting */}
        <Text style={[styles.welcome, { textAlign }]}>{t.welcome}</Text>
        <Text style={[styles.name, { textAlign }]}>{t.name}</Text>

        {/* Password field */}
        <View style={[styles.field, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t.password}
            placeholderTextColor={colors.faint}
            secureTextEntry={!show}
            style={[styles.input, { textAlign }]}
            onSubmitEditing={submit}
          />
          <Pressable onPress={() => setShow((s) => !s)} hitSlop={8}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.primary} />
          </Pressable>
        </View>

        {/* Links row */}
        <View style={row({ marginTop: spacing.lg })}>
          <Text style={styles.link}>{t.changeUser}</Text>
          <Text style={styles.link}>{t.forgot}</Text>
        </View>

        {/* Login button */}
        <Pressable
          onPress={submit}
          disabled={!canLogin}
          style={[styles.loginBtn, !canLogin && styles.loginBtnDisabled]}
        >
          <Text style={[styles.loginText, !canLogin && styles.loginTextDisabled]}>{t.login}</Text>
        </Pressable>

        {/* Quick login */}
        <Pressable onPress={quick} style={styles.quick} hitSlop={8}>
          <Text style={styles.quickText}>{t.quick}</Text>
        </Pressable>

        <Text style={[styles.demo, { textAlign: 'center' }]}>{t.demo}</Text>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Text style={styles.footerText}>
          {t.joinPre}
          <Text style={styles.footerLink}>{t.joinLink}</Text>
        </Text>
      </View>
    </View>
  );
}

const SHAPE = '#E1E9F4';

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  blobTop: {
    position: 'absolute',
    top: -170,
    right: -130,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: SHAPE,
    opacity: 0.8,
  },
  waveBottom: {
    position: 'absolute',
    bottom: -260,
    left: -110,
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: SHAPE,
    opacity: 0.55,
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  topGroup: { alignItems: 'center' },
  row: { alignItems: 'center', justifyContent: 'space-between' },
  body: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', marginTop: -spacing.xxxl },
  wordmark: {
    color: colors.primary,
    fontSize: 44,
    fontWeight: font.weight.heavy,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: spacing.xxl,
  },
  welcome: { fontSize: font.size.xl, color: colors.body, fontWeight: font.weight.medium },
  name: { fontSize: font.size.xxl, color: colors.ink, fontWeight: font.weight.heavy, marginTop: 2, marginBottom: spacing.xxl },
  field: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 62,
    ...({
      shadowColor: '#0B3D8A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 3,
    }),
  },
  input: { flex: 1, fontSize: font.size.lg, color: colors.ink, marginHorizontal: spacing.md },
  link: { color: colors.primary, fontSize: font.size.md, fontWeight: font.weight.semibold },
  loginBtn: {
    height: 58,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginBtnDisabled: { backgroundColor: colors.primarySoft },
  loginText: { color: colors.white, fontSize: font.size.lg, fontWeight: font.weight.bold },
  loginTextDisabled: { color: colors.primaryLight },
  quick: { alignItems: 'center', marginTop: spacing.xl },
  quickText: { color: colors.primary, fontSize: font.size.lg, fontWeight: font.weight.bold },
  demo: { color: colors.faint, fontSize: font.size.xs, marginTop: spacing.xl },
  footer: { alignItems: 'center', paddingTop: spacing.md },
  footerText: { color: colors.body, fontSize: font.size.md },
  footerLink: { color: colors.primary, fontWeight: font.weight.bold },
});
