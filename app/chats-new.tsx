/**
 * TEXA Chats Screen - Redesigned
 * Beautiful chat list with real-time indicators and search
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  Animated,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  SearchIcon,
  PlusIcon,
  MessageIcon,
  DoubleCheckIcon,
} from "@/components/svg-icons";
import { useColors } from "@/hooks/use-colors";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  isTyping: boolean;
  isSeen: boolean;
}

const MOCK_CHATS: Chat[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "👩‍🦰",
    lastMessage: "That sounds great! Let's meet tomorrow",
    timestamp: "2 min",
    unread: 2,
    isOnline: true,
    isTyping: false,
    isSeen: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "👨‍💼",
    lastMessage: "Thanks for the update",
    timestamp: "1 hour",
    unread: 0,
    isOnline: false,
    isTyping: false,
    isSeen: true,
  },
  {
    id: "3",
    name: "Design Team",
    avatar: "👥",
    lastMessage: "Sarah: Can you review the mockups?",
    timestamp: "3 hours",
    unread: 5,
    isOnline: true,
    isTyping: true,
    isSeen: false,
  },
  {
    id: "4",
    name: "Mom",
    avatar: "👩",
    lastMessage: "Don't forget to call me",
    timestamp: "Yesterday",
    unread: 0,
    isOnline: false,
    isTyping: false,
    isSeen: true,
  },
];

export default function ChatsScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [chats, setChats] = useState(MOCK_CHATS);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const renderChatItem = ({ item: chat }: { item: Chat }) => (
    <Pressable
      onPress={() => handleChatPress(chat.id)}
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: pressed ? colors.surface : colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      })}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* Avatar */}
        <View
          style={{
            position: "relative",
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 32 }}>{chat.avatar}</Text>

          {/* Online Indicator */}
          {chat.isOnline && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#22C55E",
                borderWidth: 2,
                borderColor: colors.background,
              }}
            />
          )}
        </View>

        {/* Chat Info */}
        <View style={{ flex: 1, justifyContent: "center" }}>
          {/* Name and Time */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.foreground,
              }}
              numberOfLines={1}
            >
              {chat.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                marginLeft: 8,
              }}
            >
              {chat.timestamp}
            </Text>
          </View>

          {/* Last Message */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            {chat.isSeen && (
              <DoubleCheckIcon size={14} color={colors.primary} />
            )}
            <Text
              style={{
                fontSize: 13,
                color: chat.unread > 0 ? colors.foreground : colors.muted,
                fontWeight: chat.unread > 0 ? "500" : "400",
                flex: 1,
              }}
              numberOfLines={1}
            >
              {chat.isTyping ? (
                <Text style={{ fontStyle: "italic", color: colors.primary }}>
                  typing...
                </Text>
              ) : (
                chat.lastMessage
              )}
            </Text>

            {/* Unread Badge */}
            {chat.unread > 0 && (
              <View
                style={{
                  minWidth: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: colors.background,
                  }}
                >
                  {chat.unread > 99 ? "99+" : chat.unread}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );

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
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: colors.foreground,
            }}
          >
            Chats
          </Text>
          <Pressable
            onPress={() => router.push("/new-chat")}
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
            placeholder="Search chats..."
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

      {/* Chat List */}
      {filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
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
          <MessageIcon size={64} color={colors.muted} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.foreground,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            No chats found
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Start a new conversation to begin messaging
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
