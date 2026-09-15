import type {
  CalorieEntry,
  Competition,
  Contact,
  HealthSource,
  Participant,
  UserProfile,
  WeightEntry,
} from '@/types';

export const demoContacts: Contact[] = [
  { id: 'alex-morgan', name: 'Alex Morgan' },
  { id: 'chris-miller', name: 'Chris Miller' },
  { id: 'jordan-davis', name: 'Jordan Davis' },
  { id: 'sam-taylor', name: 'Sam Taylor' },
  { id: 'mike-johnson', name: 'Mike Johnson' },
  { id: 'taylor-brooks', name: 'Taylor Brooks' },
  { id: 'drew-campbell', name: 'Drew Campbell' },
  { id: 'casey-parker', name: 'Casey Parker' },
];

export const createDemoUserProfile = (selectedSource: HealthSource): UserProfile => ({
  displayName: 'You',
  selectedSource,
  todayActiveCalories: 742,
  challengeActiveCalories: 4860,
  startingWeight: 194.2,
  currentWeight: 191.8,
});

export const participantFromUser = (profile: UserProfile): Participant => ({
  id: 'you',
  name: profile.displayName,
  isCurrentUser: true,
  challengeActiveCalories: profile.challengeActiveCalories,
  startingWeight: profile.startingWeight,
  currentWeight: profile.currentWeight,
});

export const blankParticipantFromUser = (profile: UserProfile): Participant => ({
  id: 'you',
  name: profile.displayName,
  isCurrentUser: true,
  challengeActiveCalories: 0,
  startingWeight: profile.startingWeight,
  currentWeight: profile.currentWeight,
});

const demoProfiles: Record<string, Omit<Participant, 'id' | 'name' | 'isCurrentUser'>> = {
  'alex-morgan': {
    challengeActiveCalories: 5480,
    startingWeight: 187.4,
    currentWeight: 184.8,
  },
  'chris-miller': {
    challengeActiveCalories: 4380,
    startingWeight: 211.6,
    currentWeight: 209.8,
  },
  'jordan-davis': {
    challengeActiveCalories: 3920,
    startingWeight: 176.2,
    currentWeight: 175.4,
  },
  'sam-taylor': {
    challengeActiveCalories: 4710,
    startingWeight: 168.5,
    currentWeight: 167.6,
  },
  'mike-johnson': {
    challengeActiveCalories: 4120,
    startingWeight: 202.8,
    currentWeight: 201.1,
  },
  'taylor-brooks': {
    challengeActiveCalories: 5090,
    startingWeight: 154.9,
    currentWeight: 153.7,
  },
  'drew-campbell': {
    challengeActiveCalories: 3650,
    startingWeight: 181.2,
    currentWeight: 180.9,
  },
  'casey-parker': {
    challengeActiveCalories: 4520,
    startingWeight: 197.5,
    currentWeight: 195.9,
  },
};

export const createDemoParticipant = (contact: Contact): Participant => ({
  id: contact.id,
  name: contact.name,
  isCurrentUser: false,
  ...demoProfiles[contact.id],
});

export const createBlankParticipant = (contact: Contact): Participant => ({
  id: contact.id,
  name: contact.name,
  isCurrentUser: false,
  challengeActiveCalories: 0,
  startingWeight: demoProfiles[contact.id]?.startingWeight ?? 0,
  currentWeight: demoProfiles[contact.id]?.currentWeight ?? 0,
});

export const createDefaultCompetition = (profile: UserProfile): Competition => ({
  id: 'default-cut-burn',
  name: '7-Day Cut & Burn',
  durationDays: 7,
  startDate: daysAgo(4),
  endDate: daysFromNow(3),
  metrics: ['calories'],
  participants: [
    {
      id: 'alex-morgan',
      name: 'Alex',
      isCurrentUser: false,
      challengeActiveCalories: 5500,
      startingWeight: 187.4,
      currentWeight: 184.6,
    },
    participantFromUser(profile),
    {
      id: 'chris-miller',
      name: 'Chris',
      isCurrentUser: false,
      challengeActiveCalories: 4300,
      startingWeight: 211.6,
      currentWeight: 209.7,
    },
    {
      id: 'jordan-davis',
      name: 'Jordan',
      isCurrentUser: false,
      challengeActiveCalories: 3850,
      startingWeight: 176.2,
      currentWeight: 175.4,
    },
  ],
});

export const createSeededCalorieEntries = (): CalorieEntry[] => [
  {
    id: 'seed-calories-default-cut-burn',
    competitionId: 'default-cut-burn',
    calories: 4860,
    createdAt: daysAgo(1),
  },
];

export const createSeededWeightEntries = (): WeightEntry[] => [
  {
    id: 'seed-weight-default-cut-burn',
    weight: 191.8,
    createdAt: daysAgo(1),
  },
];

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
