import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuthStore } from '@/state/AuthStore';
import { colors, radii } from '@/theme/getfitbro';
import { Button } from './Button';
import { Screen } from './Screen';
import { Eyebrow, Muted, Title } from './Typography';

export function AuthScreen() {
  const { isConfigured, signIn, signUp } = useAuthStore();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async () => {
    setMessage('');
    if (!email.trim() || password.length < 6) {
      setMessage('Enter an email and a password with at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const error =
      mode === 'sign-in'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      setMessage(error);
      return;
    }

    if (mode === 'sign-up') {
      setMessage('Account created. Check your email if confirmation is enabled.');
    }
  };

  return (
    <Screen>
      <View style={styles.wrap}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>GFB</Text>
        </View>
        <View style={styles.header}>
          <Eyebrow>GetFitBro</Eyebrow>
          <Title>{mode === 'sign-in' ? 'Sign in' : 'Create account'}</Title>
          <Muted>Use your account to compete with friends who are also on GetFitBro.</Muted>
        </View>

        {!isConfigured ? (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Supabase is not configured yet.</Text>
            <Text style={styles.noticeText}>
              Add your project URL and anon key to `.env.local`, then restart Expo.
            </Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              autoCapitalize="none"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 6 characters"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <Button disabled={isSubmitting || !isConfigured} onPress={submit}>
            {isSubmitting ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          </Button>
          <Button
            variant="text"
            onPress={() => {
              setMessage('');
              setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
            }}>
            {mode === 'sign-in' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 32,
  },
  logo: {
    width: 78,
    height: 78,
    borderRadius: 20,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
  },
  header: {
    gap: 8,
  },
  form: {
    gap: 14,
  },
  field: {
    gap: 8,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  input: {
    minHeight: 54,
    borderRadius: radii.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 16,
  },
  message: {
    color: colors.red,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  notice: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    borderWidth: 1,
    borderRadius: radii.card,
    padding: 14,
    gap: 4,
  },
  noticeTitle: {
    color: colors.orange,
    fontSize: 14,
    fontWeight: '900',
  },
  noticeText: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
});
