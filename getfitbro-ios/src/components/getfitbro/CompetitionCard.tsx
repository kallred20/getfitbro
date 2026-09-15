import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@/theme/getfitbro';
import type { Competition } from '@/types';
import { daysRemaining, getLeaderboard, metricLabel } from '@/utils/scoring';

type Props = {
  competition: Competition;
  onOpen: (id: string) => void;
};

export function CompetitionCard({ competition, onOpen }: Props) {
  const leaderboard = getLeaderboard(competition);
  const userRank = leaderboard.findIndex((entry) => entry.participant.isCurrentUser) + 1;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onOpen(competition.id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.top}>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>{competition.participants.length} participants</Text>
          <Text style={styles.title}>{competition.name}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{daysRemaining(competition.endDate)}</Text>
          <Text style={styles.statLabel}>days left</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>#{userRank || '-'}</Text>
          <Text style={styles.statLabel}>your rank</Text>
        </View>
      </View>

      <View style={styles.chips}>
        {competition.metrics.map((metric) => (
          <Text key={metric} style={styles.chip}>
            {metricLabel(metric)}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 14,
  },
  pressed: {
    opacity: 0.78,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
  },
  titleBlock: {
    flex: 1,
    gap: 5,
  },
  eyebrow: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
  },
  chevron: {
    color: colors.muted,
    fontSize: 32,
    lineHeight: 32,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.faint,
    borderRadius: radii.card,
    padding: 10,
  },
  statValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
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
});
