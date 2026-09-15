export type Metric = 'calories';

export type HealthSource = 'Apple Health' | 'Health Connect';

export type UserProfile = {
  displayName: string;
  selectedSource: HealthSource;
  todayActiveCalories: number;
  challengeActiveCalories: number;
  startingWeight: number;
  currentWeight: number;
};

export type Participant = {
  id: string;
  name: string;
  isCurrentUser: boolean;
  challengeActiveCalories: number;
  startingWeight: number;
  currentWeight: number;
};

export type Competition = {
  id: string;
  name: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  metrics: Metric[];
  participants: Participant[];
};

export type Contact = {
  id: string;
  name: string;
};

export type CalorieEntry = {
  id: string;
  competitionId: string;
  calories: number;
  createdAt: string;
};

export type WeightEntry = {
  id: string;
  weight: number;
  createdAt: string;
};
