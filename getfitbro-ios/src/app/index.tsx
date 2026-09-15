import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomNav } from '@/components/getfitbro/BottomNav';
import { AuthScreen } from '@/components/getfitbro/AuthScreen';
import { Button } from '@/components/getfitbro/Button';
import { CompetitionCard } from '@/components/getfitbro/CompetitionCard';
import { Screen } from '@/components/getfitbro/Screen';
import { Splash } from '@/components/getfitbro/Splash';
import { Eyebrow, Heading, Muted, Title } from '@/components/getfitbro/Typography';
import { useAppStore } from '@/state/AppStore';
import { useAuthStore } from '@/state/AuthStore';
import { colors, radii } from '@/theme/getfitbro';
import type { HealthSource } from '@/types';

export default function HomeScreen() {
  const { isReady, profile, competitions, connectDemoData } = useAppStore();
  const { isReady: isAuthReady, session } = useAuthStore();
  const router = useRouter();

  if (!isReady || !isAuthReady) return <Splash />;
  if (!session) return <AuthScreen />;
  if (!profile) return <Welcome onConnect={connectDemoData} />;

  return (
    <View style={styles.fill}>
      <Screen withNav>
        <View style={styles.header}>
          <Eyebrow>GetFitBro</Eyebrow>
          <Title>Ready for some friendly competition?</Title>
        </View>

        <View style={styles.sectionHeading}>
          <Heading>Active Competitions</Heading>
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

        <Button onPress={() => router.push('/create')}>+ New Competition</Button>

        <View style={styles.panel}>
          <Heading>How GetFitBro works</Heading>
          <Text style={styles.step}>1. Create a competition</Text>
          <Text style={styles.step}>2. Add your friends</Text>
          <Text style={styles.step}>3. Let your health data track the score</Text>
        </View>
      </Screen>
      <BottomNav />
    </View>
  );
}

function Welcome({ onConnect }: { onConnect: (source: HealthSource) => void }) {
  const [step, setStep] = useState<'intro' | 'source'>('intro');
  const [selectedSource, setSelectedSource] = useState<HealthSource>('Apple Health');

  if (step === 'source') {
    return (
      <Screen>
        <View style={styles.welcome}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>GFB</Text>
          </View>
          <Eyebrow>Simulated connection</Eyebrow>
          <Title style={styles.center}>Connect health data</Title>
          <Muted>
            For this classroom prototype, sample health data will be used to demonstrate the
            competition experience.
          </Muted>
          <View style={styles.sourceGrid}>
            {(['Apple Health', 'Health Connect'] as const).map((source) => (
              <Pressable
                key={source}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedSource === source }}
                onPress={() => setSelectedSource(source)}
                style={[
                  styles.sourceCard,
                  selectedSource === source && styles.sourceCardSelected,
                ]}>
                <Text style={styles.sourceBadge}>{source === 'Apple Health' ? 'AH' : 'HC'}</Text>
                <Text style={styles.sourceName}>{source}</Text>
              </Pressable>
            ))}
          </View>
          <Button onPress={() => onConnect(selectedSource)}>Continue with Demo Data</Button>
          <Button variant="text" onPress={() => setStep('intro')}>
            Back
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.welcome}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>GFB</Text>
        </View>
        <Eyebrow>GetFitBro</Eyebrow>
        <Title style={styles.center}>Compete together.{'\n'}Get healthier together.</Title>
        <Muted>Turn the health data you're already tracking into friendly competitions with your friends.</Muted>
        <Button onPress={() => setStep('source')}>Connect Health Data</Button>
        <Text style={styles.helper}>
          GetFitBro is designed to connect with Apple Health on iPhone and Health Connect on
          Android.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  header: {
    gap: 8,
  },
  sectionHeading: {
    marginTop: 4,
  },
  stack: {
    gap: 12,
  },
  panel: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
  },
  step: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  welcome: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
    paddingVertical: 36,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  center: {
    textAlign: 'center',
  },
  helper: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
  },
  sourceGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  sourceCard: {
    flex: 1,
    minHeight: 118,
    borderRadius: radii.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    justifyContent: 'center',
    gap: 10,
  },
  sourceCardSelected: {
    borderColor: colors.green,
    backgroundColor: colors.greenSoft,
  },
  sourceBadge: {
    alignSelf: 'flex-start',
    color: colors.greenDark,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 6,
    fontWeight: '900',
  },
  sourceName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
});
