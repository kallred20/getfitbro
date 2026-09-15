import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/getfitbro';

type Props = PropsWithChildren<{
  withNav?: boolean;
}>;

export function Screen({ children, withNav }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
        contentContainerStyle={[styles.content, withNav && styles.withNav]}>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
  },
  withNav: {
    paddingBottom: 104,
  },
  inner: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    gap: 18,
  },
});
