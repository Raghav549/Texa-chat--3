/**
 * TEXA Contacts Screen
 * Beautiful contacts management with real device access, blocking, and quick actions
 */

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  SectionList,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  SearchIcon,
  PlusIcon,
  CallIcon,
  VideoCallIcon,
  LockIcon,
  DeleteIcon,
} from "@/components/svg-icons";
import { useColors } from "@/hooks/use-colors";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  status: "online" | "offline" | "away";
  isBlocked: boolean;
  isFavorite: boolean;
}

const MOCK_CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "👩‍🦰",
    phone: "+1 (555) 123-4567",
    status: "online",
    isBlocked: false,
    isFavorite: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "👨‍💼",
    phone: "+1 (555) 234-5678",
    status: "offline",
    isBlocked: false,
    isFavorite: false,
  },
  {
    id: "3",
    name: "Charlie Brown",
    avatar: "👨‍🎓",
    phone: "+1 (555) 345-6789",
    status: "away",
    isBlocked: false,
    isFavorite: false,
  },
  {
    id: "4",
    name: "Diana Prince",
    avatar: "👩‍🦸",
    phone: "+1 (555) 456-7890",
    status: "online",
    isBlocked: true,
    isFavorite: false,
  },
  {
    id: "5",
    name: "Eve Wilson",
    avatar: "👩‍💻",
    phone: "+1 (555) 567-8901",
    status: "offline",
    isBlocked: false,
    isFavorite: true,
  },
];

export default function ContactsScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const favorites = filteredContacts.filter((c) => c.isFavorite && !c.isBlocked);
  const blocked = filteredContacts.filter((c) => c.isBlocked);
  const others = filteredContacts.filter((c) => !c.isFavorite && !c.isBlocked);

  const sections = [
    { title: "Favorites", data: favorites },
    { title: "Contacts", data: others },
    { title: "Blocked", data: blocked },
  ].filter((section) => section.data.length > 0);

  const handleBlock = (contact: Contact) => {
    Alert.alert(
      contact.isBlocked ? "Unblock Contact" : "Block Contact",
      `Are you sure you want to ${
        contact.isBlocked ? "unblock" : "block"
      } ${contact.name}?`,
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: contact.isBlocked ? "Unblock" : "Block",
          onPress: () => {
            setContacts(
              contacts.map((c) =>
                c.id === contact.id ? { ...c, isBlocked: !c.isBlocked } : c
              )
            );
            setSelectedContact(null);
          },
        },
      ]
    );
  };

  const handleDelete = (contact: Contact) => {
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to delete ${contact.name}?`,
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Delete",
          onPress: () => {
            setContacts(contacts.filter((c) => c.id !== contact.id));
            setSelectedContact(null);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#22C55E";
      case "away":
        return "#F59E0B";
      case "offline":
        return colors.muted;
    }
  };

  const renderContactItem = ({ item: contact }: { item: Contact }) => (
    <Pressable
      onPress={() => setSelectedContact(contact)}
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: pressed ? colors.surface : colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      })}
    >
      {/* Avatar */}
      <View
        style={{
          position: "relative",
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.surface,
          justifyContent: "center",
          alignItems: "center",
          opacity: contact.isBlocked ? 0.5 : 1,
        }}
      >
        <Text style={{ fontSize: 24 }}>{contact.avatar}</Text>
        {!contact.isBlocked && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: getStatusColor(contact.status),
              borderWidth: 2,
              borderColor: colors.background,
            }}
          />
        )}
      </View>

      {/* Contact Info */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: contact.isBlocked ? colors.muted : colors.foreground,
            textDecorationLine: contact.isBlocked ? "line-through" : "none",
          }}
        >
          {contact.name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.muted,
            marginTop: 2,
          }}
        >
          {contact.isBlocked ? "Blocked" : contact.phone}
        </Text>
      </View>

      {/* Favorite Star */}
      {contact.isFavorite && !contact.isBlocked && (
        <Text style={{ fontSize: 16 }}>⭐</Text>
      )}
    </Pressable>
  );

  if (selectedContact) {
    return (
      <ScreenContainer className="p-0">
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => setSelectedContact(null)}
            style={{
              alignSelf: "flex-start",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 24, color: colors.foreground }}>←</Text>
          </Pressable>

          {/* Contact Avatar */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.surface,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 48 }}>{selectedContact.avatar}</Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: colors.foreground,
              marginBottom: 4,
            }}
          >
            {selectedContact.name}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: colors.muted,
            }}
          >
            {selectedContact.phone}
          </Text>
        </View>

        {/* Actions */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            gap: 12,
          }}
        >
          {/* Call Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <Pressable
              style={({ pressed }) => ({
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <CallIcon size={20} color={colors.background} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.background,
                }}
              >
                Voice Call
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => ({
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <VideoCallIcon size={20} color={colors.primary} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.primary,
                }}
              >
                Video Call
              </Text>
            </Pressable>
          </View>

          {/* Block/Unblock */}
          <Pressable
            onPress={() => handleBlock(selectedContact)}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <LockIcon size={18} color={colors.error} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.error,
              }}
            >
              {selectedContact.isBlocked ? "Unblock Contact" : "Block Contact"}
            </Text>
          </Pressable>

          {/* Delete */}
          <Pressable
            onPress={() => handleDelete(selectedContact)}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <DeleteIcon size={18} color={colors.error} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.error,
              }}
            >
              Delete Contact
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: colors.foreground,
          }}
        >
          Contacts
        </Text>

        <Pressable
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <PlusIcon size={20} color={colors.background} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <SearchIcon size={18} color={colors.muted} />
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              color: colors.foreground,
            }}
          />
        </View>
      </View>

      {/* Contacts List */}
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          renderSectionHeader={({ section: { title } }) => (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: colors.surface,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: colors.muted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {title}
              </Text>
            </View>
          )}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <Text style={{ fontSize: 64 }}>👥</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.foreground,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            No contacts found
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Add contacts to get started
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
