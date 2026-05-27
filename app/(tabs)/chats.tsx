import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface Chat {
  id: number;
  name: string;
  type: "private" | "group";
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  avatar?: string;
  members: number;
}

export default function ChatsScreen() {
  const colors = useColors();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // TODO: Fetch chats from API
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      // TODO: Call API to get chats
      // const response = await trpc.chats.list.query();
      // setChats(response);
      
      // Mock data for now
      setChats([
        {
          id: 1,
          name: "Alice Johnson",
          type: "private",
          lastMessage: "See you tomorrow!",
          lastMessageTime: new Date(),
          unreadCount: 2,
          members: 2,
        },
        {
          id: 2,
          name: "Project Team",
          type: "group",
          lastMessage: "Meeting at 3 PM",
          lastMessageTime: new Date(Date.now() - 3600000),
          unreadCount: 0,
          members: 5,
        },
      ]);
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: Chat }) => (
    <Pressable
      className="flex-row items-center px-4 py-3 border-b border-border"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {/* Avatar */}
      <View
        className="w-12 h-12 rounded-full mr-3"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-center text-white font-bold text-lg leading-12">
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Chat Info */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-foreground font-semibold">{item.name}</Text>
          <Text className="text-muted text-xs">
            {item.lastMessageTime
              ? new Date(item.lastMessageTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
        </View>
        <Text className="text-muted text-sm" numberOfLines={1}>
          {item.lastMessage || "No messages yet"}
        </Text>
      </View>

      {/* Unread Badge */}
      {item.unreadCount > 0 && (
        <View
          className="w-6 h-6 rounded-full items-center justify-center ml-2"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white text-xs font-bold">{item.unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-3xl font-bold text-foreground mb-4">Chats</Text>

        {/* Search Bar */}
        <View
          className="flex-row items-center px-3 py-2 rounded-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-muted mr-2">🔍</Text>
          <TextInput
            placeholder="Search chats..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-foreground"
          />
        </View>
      </View>

      {/* Chats List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredChats.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted text-center">
            {searchQuery ? "No chats found" : "No chats yet. Start a conversation!"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
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
        <Text className="text-white text-2xl">✏️</Text>
      </Pressable>
    </ScreenContainer>
  );
}
