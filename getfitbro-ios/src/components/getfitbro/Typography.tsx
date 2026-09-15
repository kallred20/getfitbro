import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { colors } from '@/theme/getfitbro';

export function Eyebrow({ children }: PropsWithChildren) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Title({ children, style }: PropsWithChildren<TextProps>) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Heading({ children }: PropsWithChildren) {
  return <Text style={styles.heading}>{children}</Text>;
}

export function Muted({ children }: PropsWithChildren) {
  return <Text style={styles.muted}>{children}</Text>;
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: 0,
  },
  heading: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  muted: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
});
