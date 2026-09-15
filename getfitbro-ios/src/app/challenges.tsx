import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BottomNav } from '@/components/getfitbro/BottomNav';
import { Button } from '@/components/getfitbro/Button';
import { CompetitionCard } from '@/components/getfitbro/CompetitionCard';
import { RequireAuth } from '@/components/getfitbro/RequireAuth';
import { Screen } from '@/components/getfitbro/Screen';
import { Eyebrow, Title } from '@/components/getfitbro/Typography';
import { useAppStore } from '@/state/AppStore';

export default function ChallengesScreen() {
  const { competitions } = useAppStore();
  const router = useRouter();

  return (
    <RequireAuth>
      <View style={styles.fill}>
        <Screen withNav>
          <View style={styles.header}>
            <Eyebrow>Challenges</Eyebrow>
            <Title>All Competitions</Title>
          </View>
          <View style={styles.stack}>
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                onOpen={(id) => router.push(`/competition/${id}`)}
              />
            ))}
          </View>
          <Button variant="secondary" onPress={() => router.push('/create')}>
            + New Competition
          </Button>
        </Screen>
        <BottomNav />
      </View>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  header: {
    gap: 8,
  },
  stack: {
    gap: 12,
  },
});
