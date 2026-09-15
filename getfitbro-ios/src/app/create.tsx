import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/getfitbro/Button';
import { RequireAuth } from '@/components/getfitbro/RequireAuth';
import { Screen } from '@/components/getfitbro/Screen';
import { Eyebrow, Heading, Title } from '@/components/getfitbro/Typography';
import { useAppStore } from '@/state/AppStore';
import { colors, radii } from '@/theme/getfitbro';

const quickStartPresets: Array<{
  name: string;
  durationDays: number;
  description: string;
}> = [
  {
    name: 'Burn Battle',
    durationDays: 7,
    description: '7 days • Calories divided by profile weight',
  },
  {
    name: 'Calorie Clash',
    durationDays: 14,
    description: '14 days • Calories divided by profile weight',
  },
  {
    name: 'Consistency Challenge',
    durationDays: 30,
    description: '30 days • Calories divided by profile weight',
  },
];

export default function CreateCompetitionScreen() {
  const [name, setName] = useState('');
  const [durationDays, setDurationDays] = useState(7);
  const [submitted, setSubmitted] = useState(false);
  const { createCompetition, selectedContacts } = useAppStore();
  const router = useRouter();

  const validation = useMemo(() => {
    if (!name.trim()) return 'Add a competition name.';
    if (!durationDays) return 'Choose a duration.';
    return '';
  }, [durationDays, name]);

  const selectPreset = (preset: (typeof quickStartPresets)[number]) => {
    setName(preset.name);
    setDurationDays(preset.durationDays);
    setSubmitted(false);
  };

  const submit = () => {
    setSubmitted(true);
    if (validation) return;
    const competition = createCompetition({
      name: name.trim(),
      durationDays,
      metrics: ['calories'],
      contacts: selectedContacts,
    });
    if (competition) router.replace(`/competition/${competition.id}`);
  };

  return (
    <RequireAuth>
      <Screen>
        <Button variant="text" onPress={() => router.back()}>
          Back
        </Button>
        <View style={styles.header}>
          <Eyebrow>Create Competition</Eyebrow>
          <Title>New Competition</Title>
        </View>

        <View style={styles.section}>
          <Heading>Quick Start</Heading>
          <View style={styles.presetGrid}>
            {quickStartPresets.map((preset) => {
              const selected = name === preset.name && durationDays === preset.durationDays;

              return (
                <Pressable
                  key={preset.name}
                  onPress={() => selectPreset(preset)}
                  style={[styles.preset, selected && styles.selectedCard]}>
                  <Text style={styles.presetTitle}>{preset.name}</Text>
                  <Text style={styles.presetDescription}>{preset.description}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Competition Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="September Challenge"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Heading>Duration</Heading>
          <View style={styles.segmented}>
            {[7, 14, 30].map((days) => (
              <Pressable
                key={days}
                onPress={() => setDurationDays(days)}
                style={[styles.segment, durationDays === days && styles.segmentSelected]}>
                <Text
                  style={[styles.segmentText, durationDays === days && styles.segmentTextSelected]}>
                  {days} Days
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Heading>Scoring</Heading>
          <View style={styles.scoringCard}>
            <Text style={styles.metricTitle}>Calorie Score</Text>
            <Text style={styles.presetDescription}>
              Burned calories are divided by the weight saved in each user profile, then shown as
              points on the leaderboard.
            </Text>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Heading>Participants</Heading>
            <Pressable onPress={() => router.push('/friends')}>
              <Text style={styles.smallAction}>+ Add Friends</Text>
            </Pressable>
          </View>
          <View style={styles.chips}>
            <Text style={styles.chip}>You</Text>
            {selectedContacts.map((contact) => (
              <Text key={contact.id} style={styles.chip}>
                {contact.name}
              </Text>
            ))}
          </View>
        </View>

        {submitted && validation ? <Text style={styles.error}>{validation}</Text> : null}
        <Button disabled={Boolean(validation)} onPress={submit}>
          Create Competition
        </Button>
      </Screen>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  section: {
    gap: 12,
  },
  presetGrid: {
    gap: 10,
  },
  preset: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 4,
  },
  selectedCard: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.green,
  },
  presetTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  presetDescription: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
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
    minHeight: 52,
    borderRadius: radii.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 16,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.faint,
    borderRadius: radii.card,
    padding: 4,
  },
  segment: {
    flex: 1,
    minHeight: 46,
    borderRadius: radii.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: colors.card,
  },
  segmentText: {
    color: colors.muted,
    fontWeight: '900',
  },
  segmentTextSelected: {
    color: colors.greenDark,
  },
  scoringCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 12,
  },
  metricTitle: {
    color: colors.ink,
    fontSize: 16,
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
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  smallAction: {
    color: colors.greenDark,
    fontSize: 14,
    fontWeight: '900',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    color: colors.greenDark,
    backgroundColor: colors.greenSoft,
    borderRadius: radii.pill,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '800',
  },
  error: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '800',
  },
});
