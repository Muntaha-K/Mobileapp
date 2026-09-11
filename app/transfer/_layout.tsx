import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function TransferLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surfaceAlt },
      }}
    >
      <Stack.Screen name="new" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="success" options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack>
  );
}
