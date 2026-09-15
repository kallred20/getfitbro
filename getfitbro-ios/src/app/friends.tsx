import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/getfitbro/Button';
import { RequireAuth } from '@/components/getfitbro/RequireAuth';
import { Screen } from '@/components/getfitbro/Screen';
import { Muted, Title } from '@/components/getfitbro/Typography';
import { demoContacts } from '@/data/demoData';
import { useAppStore } from '@/state/AppStore';
import { colors, radii } from '@/theme/getfitbro';
import type { Contact } from '@/types';

export default function FriendsScreen() {
  const { selectedContacts, setSelectedContacts } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(selectedContacts.map((contact) => contact.id)),
  );
  const router = useRouter();

  const filteredContacts = useMemo(() => {
    return demoContacts.filter((contact) =>
      contact.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [query]);

  const toggleContact = (contact: Contact) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(contact.id)) {
        next.delete(contact.id);
      } else {
        next.add(contact.id);
      }
      return next;
    });
  };

  const save = () => {
    setSelectedContacts(demoContacts.filter((contact) => selectedIds.has(contact.id)));
    router.back();
  };

  return (
    <RequireAuth>
      <Screen>
        <Button variant="text" onPress={() => router.back()}>
          Back
        </Button>
        <View style={styles.header}>
          <Title>Add Friends</Title>
          <Muted>Prototype contact picker</Muted>
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search contacts"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <View style={styles.list}>
          {filteredContacts.map((contact) => {
            const selected = selectedIds.has(contact.id);
            const initials = contact.name
              .split(' ')
              .map((part) => part[0])
              .join('');

            return (
              <Pressable
                key={contact.id}
                onPress={() => toggleContact(contact)}
                style={[styles.row, selected && styles.rowSelected]}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <Text style={styles.name}>{contact.name}</Text>
                <View style={styles.checkbox}>
                  <Text style={styles.checkboxText}>{selected ? 'x' : ''}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <Button onPress={save}>Add Selected</Button>
      </Screen>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  input: {
    minHeight: 52,
    borderRadius: radii.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 16,
  },
  list: {
    gap: 10,
  },
  row: {
    minHeight: 64,
    borderRadius: radii.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowSelected: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.green,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.faint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.greenDark,
    fontSize: 14,
    fontWeight: '900',
  },
  name: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxText: {
    color: colors.greenDark,
    fontSize: 14,
    fontWeight: '900',
  },
});
