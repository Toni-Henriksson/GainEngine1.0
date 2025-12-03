import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { View } from 'react-native';
import { themeColors } from './constants/colors';

export default function RootLayout() {
  // In a real app, you'd load custom fonts like 'Satoshi' or 'Inter' here
  const [loaded] = useFonts({
    // 'Satoshi': require('../assets/fonts/Satoshi-Variable.ttf'),
  });

  return (
    <>
      <StatusBar style="light" backgroundColor={themeColors.BACKGROUND} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: themeColors.BACKGROUND } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </>
  );
}