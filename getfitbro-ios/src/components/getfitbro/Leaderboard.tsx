import { StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@/theme/getfitbro';
import type { Competition } from '@/types';
import { formatScore, getLeaderboard } from '@/utils/scoring';

type Props = {
  competition: Competition;
};

export function Leaderboard({ competition }: Props) {
  const leaderboard = getLeaderboard(competition);

  return (
    <View style={styles.panel}>
      <Text style={styles.heading}>Leaderboard</Text>
      <View style={styles.rows}>
        {leaderboard.map(({ participant, score }, index) => (
          <View key={participant.id} style={[styles.row, participant.isCurrentUser && styles.you]}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{participant.name}</Text>
              <Text style={styles.detail}>
                {participant.challengeActiveCalories > 0
                  ? `${participant.challengeActiveCalories.toLocaleString()} cal`
                  : 'No calorie data yet'}
              </Text>
            </View>
            <Text style={styles.score}>{formatScore(participant)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  heading: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  rows: {
    gap: 10,
  },
  row: {
    minHeight: 60,
    borderRadius: radii.card,
    backgroundColor: colors.faint,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
  },
  you: {
    backgroundColor: colors.greenSoft,
  },
  rank: {
    color: colors.greenDark,
    width: 34,
    fontSize: 14,
    fontWeight: '900',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  detail: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  score: {
    color: colors.ink,
    minWidth: 46,
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '900',
  },
});
