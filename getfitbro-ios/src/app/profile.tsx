import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BottomNav } from '@/components/getfitbro/BottomNav';
import { Button } from '@/components/getfitbro/Button';
import { RequireAuth } from '@/components/getfitbro/RequireAuth';
import { Screen } from '@/components/getfitbro/Screen';
import { Eyebrow, Heading, Muted, Title } from '@/components/getfitbro/Typography';
import { useAppStore } from '@/state/AppStore';
import { useAuthStore } from '@/state/AuthStore';
import { colors, radii } from '@/theme/getfitbro';

export default function ProfileScreen() {
  const { profile, resetDemo, updateUserWeight } = useAppStore();
  const { user, signOut } = useAuthStore();
  const [weight, setWeight] = useState(() => (profile?.currentWeight ? profile.currentWeight.toFixed(1) : ''));
  const [message, setMessage] = useState('');
  const router = useRouter();

  if (!profile) {
    return (
      <RequireAuth>
        <Screen>
          <View style={styles.header}>
            <Eyebrow>Profile</Eyebrow>
            <Title>Finish setup</Title>
            <Muted>Connect demo health data before editing profile settings.</Muted>
          </View>
          <Button onPress={() => router.replace('/')}>Go Home</Button>
          <Button variant="secondary" onPress={signOut}>Sign Out</Button>
        </Screen>
      </RequireAuth>
    );
  }

  const saveWeight = () => {
    const nextWeight = Number(weight);
    if (!Number.isFinite(nextWeight) || nextWeight <= 0) {
      setMessage('Enter your current weight.');
      return;
    }
    updateUserWeight(Math.round(nextWeight * 10) / 10);
    setMessage('Weight saved.');
  };

  return (
    <RequireAuth>
      <View style={styles.fill}>
        <Screen withNav>
        <View style={styles.header}>
          <Eyebrow>Profile</Eyebrow>
          <Title>You</Title>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>Y</Text>
          </View>
          <View style={styles.profileInfo}>
            <Heading>Health Data</Heading>
            <Text style={styles.status}>Connected - Demo Mode</Text>
            <Muted>{user?.email}</Muted>
            <Muted>Selected source: {profile.selectedSource}</Muted>
          </View>
        </View>

        <View style={styles.panel}>
          <Eyebrow>Settings</Eyebrow>
          <Text style={styles.label}>Current weight</Text>
          <TextInput
            value={weight}
            onChangeText={(value) => {
              setWeight(value);
              setMessage('');
            }}
            keyboardType="decimal-pad"
            placeholder="191.8"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <Muted>Used to divide your calorie total into leaderboard points.</Muted>
          {message ? <Text style={message === 'Weight saved.' ? styles.success : styles.error}>{message}</Text> : null}
          <Button variant="secondary" onPress={saveWeight}>
            Save Weight
          </Button>
        </View>

        <View style={styles.panel}>
          <Eyebrow>Prototype Mode</Eyebrow>
          <Muted>
            This build uses sample health data to demonstrate the experience. A production mobile
            version would request permission from Apple Health or Health Connect.
          </Muted>
        </View>

        <Button variant="danger" onPress={resetDemo}>
          Reset Demo
        </Button>
        <Button variant="secondary" onPress={signOut}>
          Sign Out
        </Button>
        </Screen>
        <BottomNav />
      </View>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  header: {
    gap: 8,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.greenDark,
    fontSize: 24,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  status: {
    color: colors.greenDark,
    fontSize: 15,
    fontWeight: '900',
  },
  panel: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 10,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  input: {
    minHeight: 52,
    borderRadius: radii.card,
    backgroundColor: colors.faint,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  success: {
    color: colors.greenDark,
    fontSize: 14,
    fontWeight: '800',
  },
  error: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '800',
  },
});
