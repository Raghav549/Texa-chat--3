import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file";
  mediaUrl?: string;
  createdAt: Date;
  isEdited: boolean;
  reactions: { emoji: string; count: number }[];
}

export default function ChatDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, [id]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // TODO: Fetch messages from API
      // const response = await trpc.messages.list.query({ chatId: Number(id) });
      
      // Mock data
      setMessages([
        {
          id: 1,
          senderId: 1,
          senderName: "Alice",
          content: "Hey! How are you?",
          type: "text",
          createdAt: new Date(Date.now() - 300000),
          isEdited: false,
          reactions: [],
        },
        {
          id: 2,
          senderId: 2,
          senderName: "You",
          content: "I'm doing great! How about you?",
          type: "text",
          createdAt: new Date(Date.now() - 240000),
          isEdited: false,
          reactions: [{ emoji: "👍", count: 1 }],
        },
      ]);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      // TODO: Send message via API
      // await trpc.messages.send.mutate({
      //   chatId: Number(id),
      //   content: inputText,
      // });

      // Add to local state
      const newMessage: Message = {
        id: messages.length + 1,
        senderId: 2,
        senderName: "You",
        content: inputText,
        type: "text",
        createdAt: new Date(),
        isEdited: false,
        reactions: [],
      };

      setMessages([...messages, newMessage]);
      setInputText("");
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isOwn = item.senderId === 2;

    return (
      <View
        className={`flex-row mb-3 ${isOwn ? "justify-end" : "justify-start"} px-4`}
      >
        <Pressable
          className={`max-w-xs px-3 py-2 rounded-lg ${
            isOwn
              ? "bg-primary rounded-br-none"
              : "bg-surface rounded-bl-none"
          }`}
        >
          {!isOwn && (
            <Text className="text-muted text-xs font-semibold mb-1">
              {item.senderName}
            </Text>
          )}
          <Text className={isOwn ? "text-white" : "text-foreground"}>
            {item.content}
          </Text>
          {item.isEdited && (
            <Text className={`text-xs mt-1 ${isOwn ? "text-white/70" : "text-muted"}`}>
              (edited)
            </Text>
          )}
          {item.reactions.length > 0 && (
            <View className="flex-row gap-1 mt-2">
              {item.reactions.map((reaction, idx) => (
                <View
                  key={idx}
                  className="bg-surface px-2 py-1 rounded-full flex-row items-center gap-1"
                >
                  <Text>{reaction.emoji}</Text>
                  <Text className="text-muted text-xs">{reaction.count}</Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScreenContainer className="p-0 justify-between">
        {/* Header */}
        <View className="px-4 py-3 border-b border-border">
          <Text className="text-lg font-bold text-foreground">Alice Johnson</Text>
          <Text className="text-muted text-sm">Online</Text>
        </View>

        {/* Messages List */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id.toString()}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            className="flex-1"
          />
        )}

        {/* Input Area */}
        <View className="px-4 py-3 border-t border-border flex-row items-center gap-2">
          <Pressable
            className="w-10 h-10 rounded-full items-center justify-center"
            style={({ pressed }) => [
              { backgroundColor: colors.surface },
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text>➕</Text>
          </Pressable>

          <View
            className="flex-1 flex-row items-center px-3 py-2 rounded-full"
            style={{ backgroundColor: colors.surface }}
          >
            <TextInput
              placeholder="Message..."
              placeholderTextColor={colors.muted}
              value={inputText}
              onChangeText={setInputText}
              className="flex-1 text-foreground"
              multiline
              maxLength={4096}
            />
          </View>

          <Pressable
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={({ pressed }) => [
              { backgroundColor: inputText.trim() ? colors.primary : colors.border },
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text className="text-white text-lg">➤</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
