import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

interface Contact {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  isSelected: boolean;
}

export default function NewChatScreen() {
  const colors = useColors();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Alice Johnson", phone: "+1234567890", isSelected: false },
    { id: 2, name: "Bob Smith", phone: "+0987654321", isSelected: false },
    { id: 3, name: "Carol Davis", phone: "+1122334455", isSelected: false },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const toggleContact = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleCreateChat = async () => {
    if (selectedContacts.length === 0) return;

    try {
      setLoading(true);
      // TODO: Create chat via API
      // const response = await trpc.chats.create.mutate({
      //   participantIds: selectedContacts,
      // });
      
      // Navigate to chat
      router.push(`/chat/1`);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <Pressable
      onPress={() => toggleContact(item.id)}
      className="flex-row items-center px-4 py-3 border-b border-border"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {/* Checkbox */}
      <View
        className="w-6 h-6 rounded border-2 mr-3 items-center justify-center"
        style={{
          borderColor: selectedContacts.includes(item.id)
            ? colors.primary
            : colors.border,
          backgroundColor: selectedContacts.includes(item.id)
            ? colors.primary
            : "transparent",
        }}
      >
        {selectedContacts.includes(item.id) && (
          <Text className="text-white font-bold">✓</Text>
        )}
      </View>

      {/* Avatar */}
      <View
        className="w-12 h-12 rounded-full mr-3 items-center justify-center"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-lg font-bold text-foreground">
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Contact Info */}
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{item.name}</Text>
        <Text className="text-muted text-sm">{item.phone}</Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-3xl font-bold text-foreground mb-4">New Chat</Text>

        {/* Search Bar */}
        <View
          className="flex-row items-center px-3 py-2 rounded-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-muted mr-2">🔍</Text>
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-foreground"
          />
        </View>

        {/* Selected Contacts */}
        {selectedContacts.length > 0 && (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {selectedContacts.map((id) => {
              const contact = contacts.find((c) => c.id === id);
              return (
                <View
                  key={id}
                  className="flex-row items-center gap-2 px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white text-sm">{contact?.name}</Text>
                  <Pressable onPress={() => toggleContact(id)}>
                    <Text className="text-white font-bold">×</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
      />

      {/* Create Button */}
      <View className="px-4 py-4 border-t border-border">
        <Pressable
          onPress={handleCreateChat}
          disabled={selectedContacts.length === 0 || loading}
          className="px-6 py-3 rounded-lg items-center"
          style={({ pressed }) => [
            {
              backgroundColor:
                selectedContacts.length === 0 ? colors.border : colors.primary,
            },
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">
              Create Chat ({selectedContacts.length})
            </Text>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
