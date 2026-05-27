import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Contact {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  status?: string;
  isOnline: boolean;
}

export default function ContactsScreen() {
  const colors = useColors();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      // TODO: Fetch contacts from API
      // const response = await trpc.contacts.list.query();
      
      // Mock data
      setContacts([
        {
          id: 1,
          name: "Alice Johnson",
          phone: "+1234567890",
          status: "Available",
          isOnline: true,
        },
        {
          id: 2,
          name: "Bob Smith",
          phone: "+0987654321",
          status: "In a meeting",
          isOnline: false,
        },
        {
          id: 3,
          name: "Carol Davis",
          phone: "+1122334455",
          status: "Working",
          isOnline: true,
        },
      ]);
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const renderContactItem = ({ item }: { item: Contact }) => (
    <Pressable
      className="flex-row items-center px-4 py-3 border-b border-border"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {/* Avatar with Online Indicator */}
      <View className="relative mr-3">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-bold text-lg">
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        {item.isOnline && (
          <View
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: colors.success, borderColor: colors.background }}
          />
        )}
      </View>

      {/* Contact Info */}
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{item.name}</Text>
        <Text className="text-muted text-sm">{item.phone}</Text>
        {item.status && (
          <Text className="text-muted text-xs mt-1">{item.status}</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <Pressable
          className="w-10 h-10 rounded-full items-center justify-center"
          style={({ pressed }) => [
            { backgroundColor: colors.primary },
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text className="text-white">💬</Text>
        </Pressable>
        <Pressable
          className="w-10 h-10 rounded-full items-center justify-center"
          style={({ pressed }) => [
            { backgroundColor: colors.surface },
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text>📞</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-3xl font-bold text-foreground mb-4">Contacts</Text>

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
      </View>

      {/* Contacts List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredContacts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted text-center">
            {searchQuery ? "No contacts found" : "No contacts yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
        />
      )}

      {/* Floating Action Button */}
      <Pressable
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
        style={({ pressed }) => [
          { backgroundColor: colors.primary },
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text className="text-white text-2xl">+</Text>
      </Pressable>
    </ScreenContainer>
  );
}
