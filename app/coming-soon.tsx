import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { Button, EmptyState } from '@/components/ui';
import { spacing } from '@/theme';

export default function ComingSoon() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Coming soon" />
      <View style={{ flex: 1, justifyContent: 'center', padding: spacing.xl }}>
        <EmptyState
          icon="construct-outline"
          title="This feature is on the way"
          subtitle="This part of the anb simulation isn't wired up yet — the rest of the app is fully interactive."
        />
        <View style={{ height: spacing.xl }} />
        <Button title="Back to home" onPress={() => router.replace('/(tabs)')} />
      </View>
    </View>
  );
}
