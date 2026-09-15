import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/getfitbro';

export function Splash() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>GFB</Text>
      </View>
      <Text style={styles.name}>GetFitBro</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  logo: {
    width: 94,
    height: 94,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.greenDark,
    fontSize: 28,
    fontWeight: '900',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
});
