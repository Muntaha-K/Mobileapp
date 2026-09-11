import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { colors, font, shadow } from '@/theme';

function TabIcon({
  name,
  color,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={24} color={color} />
      {focused ? (
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: colors.primary,
            marginTop: 3,
          }}
        />
      ) : (
        <View style={{ height: 8 }} />
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.faint,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: font.weight.semibold, marginTop: -2 },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          ...shadow.soft,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'wallet' : 'wallet-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: 'Transfer',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'card' : 'card-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'grid' : 'grid-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
