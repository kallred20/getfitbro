import type { Competition, Metric, Participant } from '@/types';

export function scoreParticipant(participant: Participant) {
  const weight = participant.currentWeight || participant.startingWeight;
  if (weight <= 0) return 0;
  return participant.challengeActiveCalories / weight;
}

export function getLeaderboard(competition: Competition) {
  return [...competition.participants]
    .map((participant) => ({
      participant,
      score: scoreParticipant(participant),
    }))
    .sort((a, b) => b.score - a.score);
}

export function daysRemaining(endDate: string) {
  const end = new Date(endDate);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / msPerDay));
}

export function metricLabel(metric: Metric) {
  return 'Calorie Score';
}

export function formatScore(participant: Participant) {
  const score = scoreParticipant(participant);
  if (score <= 0) return 'No score yet';
  return `${score.toFixed(1)} pts`;
}
