import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/getfitbro/Button';
import { Leaderboard } from '@/components/getfitbro/Leaderboard';
import { RequireAuth } from '@/components/getfitbro/RequireAuth';
import { Screen } from '@/components/getfitbro/Screen';
import { Eyebrow, Heading, Muted, Title } from '@/components/getfitbro/Typography';
import { useAppStore } from '@/state/AppStore';
import { colors, radii } from '@/theme/getfitbro';
import type { Competition } from '@/types';
import { daysRemaining, formatScore, metricLabel, scoreParticipant } from '@/utils/scoring';

export default function CompetitionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { competitions } = useAppStore();
  const router = useRouter();
  const competition = competitions.find((item) => item.id === id);

  if (!competition) {
    return (
      <RequireAuth>
        <Screen>
          <Button variant="text" onPress={() => router.replace('/challenges')}>
            Back
          </Button>
          <Title>Competition not found</Title>
        </Screen>
      </RequireAuth>
    );
  }

  const user = competition.participants.find((participant) => participant.isCurrentUser);

  return (
    <RequireAuth>
      <Screen>
        <Button variant="text" onPress={() => router.back()}>
          Back
        </Button>
        <View style={styles.header}>
          <Eyebrow>{daysRemaining(competition.endDate)} days remaining</Eyebrow>
          <Title>{competition.name}</Title>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{competition.participants.length} participants</Text>
            {competition.metrics.map((metric) => (
              <Text key={metric} style={styles.meta}>
                {metricLabel(metric)}
              </Text>
            ))}
          </View>
        </View>

        {user ? (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <Eyebrow>Your progress</Eyebrow>
                <Heading>You</Heading>
              </View>
              <Text style={styles.scorePill}>{scoreParticipant(user).toFixed(1)} pts</Text>
            </View>
            <StatLine
              label="Challenge calories"
              value={
                user.challengeActiveCalories > 0
                  ? user.challengeActiveCalories.toLocaleString()
                  : 'No data yet'
              }
            />
            <StatLine label="Score" value={formatScore(user)} />
            <EntryButtons competition={competition} />
          </View>
        ) : null}

        <Leaderboard competition={competition} />

        <View style={styles.panel}>
          <Heading>How scoring works</Heading>
          <Muted>{scoringCopy(competition)}</Muted>
        </View>

        <Text style={styles.privacy}>
          Your full health history stays private. GetFitBro is designed to share competition
          progress, not your complete health record.
        </Text>
      </Screen>
    </RequireAuth>
  );
}

function EntryButtons({ competition }: { competition: Competition }) {
  const router = useRouter();
  return (
    <View style={styles.entryButtons}>
      <Button variant="secondary" onPress={() => router.push(`/calories/${competition.id}`)}>
        Add Calories
      </Button>
    </View>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statLine}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function scoringCopy(_competition: Competition) {
  return 'Leaderboard score is total active calories divided by the weight saved in each user profile.';
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  meta: {
    color: colors.muted,
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '800',
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  scorePill: {
    color: '#FFFFFF',
    backgroundColor: colors.green,
    borderRadius: radii.pill,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 14,
    fontWeight: '900',
  },
  statLine: {
    minHeight: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  statLabel: {
    color: colors.muted,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  statValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  entryButtons: {
    gap: 10,
    marginTop: 4,
  },
  panel: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    gap: 8,
  },
  privacy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
