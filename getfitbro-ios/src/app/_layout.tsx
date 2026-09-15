import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AppProvider } from '@/state/AppStore';
import { AuthProvider } from '@/state/AuthStore';

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="challenges" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="create" />
          <Stack.Screen name="friends" />
          <Stack.Screen name="competition/[id]" />
          <Stack.Screen name="calories/[id]" />
        </Stack>
      </AppProvider>
    </AuthProvider>
  );
}
