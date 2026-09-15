import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/getfitbro';

const items = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/challenges', label: 'Challenges', icon: '▤' },
  { href: '/profile', label: 'Profile', icon: '◉' },
] as const;

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.nav}>
        {items.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Pressable
              key={item.href}
              accessibilityRole="button"
              onPress={() => router.replace(item.href)}
              style={({ pressed }) => [styles.item, active && styles.active, pressed && styles.pressed]}>
              <Text style={[styles.icon, active && styles.activeText]}>{item.icon}</Text>
              <Text style={[styles.label, active && styles.activeText]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'rgba(250, 250, 250, 0.94)',
  },
  nav: {
    minHeight: 64,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
  },
  item: {
    flex: 1,
    minHeight: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  active: {
    backgroundColor: colors.greenSoft,
  },
  pressed: {
    opacity: 0.75,
  },
  icon: {
    color: colors.muted,
    fontSize: 18,
    fontWeight: '900',
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  activeText: {
    color: colors.greenDark,
  },
});
