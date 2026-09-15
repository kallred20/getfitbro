import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/getfitbro/Button';
import { RequireAuth } from '@/components/getfitbro/RequireAuth';
import { Screen } from '@/components/getfitbro/Screen';
import { Eyebrow, Muted, Title } from '@/components/getfitbro/Typography';
import { useAppStore } from '@/state/AppStore';
import { colors, radii } from '@/theme/getfitbro';

export default function AddCaloriesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { competitions, addCalories } = useAppStore();
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const competition = competitions.find((item) => item.id === id);
  const calories = Number(value);
  const error = !Number.isFinite(calories) || calories <= 0 ? 'Enter active calories.' : '';

  const save = () => {
    setSubmitted(true);
    if (error || !id) return;
    addCalories(id, Math.round(calories));
    router.back();
  };

  return (
    <RequireAuth>
      <Screen>
        <Button variant="text" onPress={() => router.back()}>
          Back
        </Button>
        <View style={styles.header}>
          <Eyebrow>Manual Entry</Eyebrow>
          <Title>Add Calories</Title>
          <Muted>{competition?.name ?? 'Competition'}</Muted>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Active Calories</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            keyboardType="number-pad"
            placeholder="450"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>
        {submitted && error ? <Text style={styles.error}>{error}</Text> : null}
        <Button onPress={save}>Save Calories</Button>
      </Screen>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
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
    minHeight: 58,
    borderRadius: radii.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  error: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '800',
  },
});
