import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  blankParticipantFromUser,
  createBlankParticipant,
  createDefaultCompetition,
  createDemoUserProfile,
  createSeededCalorieEntries,
  createSeededWeightEntries,
} from '@/data/demoData';
import type {
  CalorieEntry,
  Competition,
  Contact,
  HealthSource,
  Metric,
  UserProfile,
  WeightEntry,
} from '@/types';
import { useAuthStore } from './AuthStore';

type StoredApp = {
  profile: UserProfile;
  competitions: Competition[];
  calorieEntries: CalorieEntry[];
  weightEntries: WeightEntry[];
};

type CreateCompetitionPayload = {
  name: string;
  durationDays: number;
  metrics: Metric[];
  contacts: Contact[];
};

type AppContextValue = {
  isReady: boolean;
  profile: UserProfile | null;
  competitions: Competition[];
  calorieEntries: CalorieEntry[];
  weightEntries: WeightEntry[];
  selectedContacts: Contact[];
  setSelectedContacts: (contacts: Contact[]) => void;
  connectDemoData: (source: HealthSource) => void;
  createCompetition: (payload: CreateCompetitionPayload) => Competition | null;
  addCalories: (competitionId: string, calories: number) => void;
  updateUserWeight: (weight: number) => void;
  resetDemo: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [calorieEntries, setCalorieEntries] = useState<CalorieEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const { user } = useAuthStore();
  const router = useRouter();
  const storageKey = storageKeyForUser(user?.id);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      setIsReady(false);
      setHasHydrated(false);
      setProfile(null);
      setCompetitions([]);
      setCalorieEntries([]);
      setWeightEntries([]);
      setSelectedContacts([]);

      if (!user?.id) {
        if (mounted) {
          setHasHydrated(true);
          setIsReady(true);
        }
        return;
      }

      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!mounted || !raw) return;

        const stored = JSON.parse(raw) as Partial<StoredApp>;
        if (stored.profile) setProfile(stored.profile);
        if (Array.isArray(stored.competitions)) {
          setCompetitions(stored.competitions.map(sanitizeCompetition));
        }
        if (Array.isArray(stored.calorieEntries)) setCalorieEntries(stored.calorieEntries);
        if (Array.isArray(stored.weightEntries)) setWeightEntries(stored.weightEntries);
      } catch {
        await AsyncStorage.removeItem(storageKey);
      } finally {
        if (mounted) {
          setHasHydrated(true);
          setTimeout(() => setIsReady(true), 900);
        }
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, [storageKey, user?.id]);

  useEffect(() => {
    if (!hasHydrated || !profile) return;

    const stored: StoredApp = {
      profile,
      competitions,
      calorieEntries,
      weightEntries,
    };

    AsyncStorage.setItem(storageKey, JSON.stringify(stored));
  }, [calorieEntries, competitions, hasHydrated, profile, weightEntries]);

  const connectDemoData = useCallback(
    (source: HealthSource) => {
      const nextProfile = createDemoUserProfile(source);
      setProfile(nextProfile);
      setCompetitions([sanitizeCompetition(createDefaultCompetition(nextProfile))]);
      setCalorieEntries(createSeededCalorieEntries());
      setWeightEntries(createSeededWeightEntries());
      router.replace('/');
    },
    [router],
  );

  const createCompetition = useCallback((payload: CreateCompetitionPayload) => {
    if (!profile) return null;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + payload.durationDays);

    const competition: Competition = {
      id: createId(),
      name: payload.name,
      durationDays: payload.durationDays,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      metrics: payload.metrics,
      participants: [blankParticipantFromUser(profile), ...payload.contacts.map(createBlankParticipant)],
    };

    setCompetitions((current) => [competition, ...current]);
    setSelectedContacts([]);
    return competition;
  }, [profile]);

  const addCalories = useCallback((competitionId: string, calories: number) => {
    const entry: CalorieEntry = {
      id: createId('calories'),
      competitionId,
      calories,
      createdAt: new Date().toISOString(),
    };

    setCalorieEntries((current) => [entry, ...current]);
    setProfile((current) =>
      current
        ? {
            ...current,
            todayActiveCalories: current.todayActiveCalories + calories,
            challengeActiveCalories: current.challengeActiveCalories + calories,
          }
        : current,
    );
    setCompetitions((current) =>
      current.map((competition) =>
        competition.id === competitionId
          ? {
              ...competition,
              participants: competition.participants.map((participant) =>
                participant.isCurrentUser
                  ? {
                      ...participant,
                      challengeActiveCalories: participant.challengeActiveCalories + calories,
                    }
                  : participant,
              ),
            }
          : competition,
      ),
    );
  }, []);

  const updateUserWeight = useCallback((weight: number) => {
    const entry: WeightEntry = {
      id: createId('weight'),
      weight,
      createdAt: new Date().toISOString(),
    };

    setWeightEntries((current) => [entry, ...current]);
    setProfile((current) =>
      current
        ? {
            ...current,
            currentWeight: weight,
          }
        : current,
    );
    setCompetitions((current) =>
      current.map((competition) => ({
        ...competition,
        participants: competition.participants.map((participant) =>
          participant.isCurrentUser
            ? {
                ...participant,
                currentWeight: weight,
                startingWeight: participant.startingWeight || weight,
              }
            : participant,
        ),
      })),
    );
  }, []);

  const resetDemo = useCallback(() => {
    AsyncStorage.removeItem(storageKey);
    setProfile(null);
    setCompetitions([]);
    setCalorieEntries([]);
    setWeightEntries([]);
    setSelectedContacts([]);
    router.replace('/');
  }, [router]);

  const value = useMemo<AppContextValue>(
    () => ({
      isReady,
      profile,
      competitions,
      calorieEntries,
      weightEntries,
      selectedContacts,
      setSelectedContacts,
      connectDemoData,
      createCompetition,
      addCalories,
      updateUserWeight,
      resetDemo,
    }),
    [
      addCalories,
      calorieEntries,
      competitions,
      connectDemoData,
      createCompetition,
      isReady,
      profile,
      resetDemo,
      selectedContacts,
      updateUserWeight,
      weightEntries,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
}

function createId(prefix = 'competition') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeCompetition(competition: Competition): Competition {
  return {
    ...competition,
    metrics: ['calories'],
  };
}

function storageKeyForUser(userId?: string) {
  return userId ? `getfitbro-demo:${userId}` : 'getfitbro-demo:anonymous';
}
