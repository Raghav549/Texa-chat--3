/**
 * TEXA Chat Detail Screen
 * Beautiful message thread with end-to-end encryption, reactions, and real-time features
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  BackIcon,
  SendIcon,
  AttachmentIcon,
  MicrophoneIcon,
  CallIcon,
  VideoCallIcon,
  MenuIcon,
  ShieldIcon,
  DoubleCheckIcon,
} from "@/components/svg-icons";
import { useColors } from "@/hooks/use-colors";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: string;
  seen: boolean;
  encrypted: boolean;
  reactions: { emoji: string; count: number }[];
  type: "text" | "image" | "audio" | "video";
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hey! How are you doing?",
    sender: "other",
    timestamp: "10:30 AM",
    seen: true,
    encrypted: true,
    reactions: [],
    type: "text",
  },
  {
    id: "2",
    text: "I'm doing great! Just finished the project",
    sender: "me",
    timestamp: "10:31 AM",
    seen: true,
    encrypted: true,
    reactions: [{ emoji: "👍", count: 1 }],
    type: "text",
  },
  {
    id: "3",
    text: "That's awesome! Can't wait to see it",
    sender: "other",
    timestamp: "10:32 AM",
    seen: true,
    encrypted: true,
    reactions: [],
    type: "text",
  },
  {
    id: "4",
    text: "Let's meet tomorrow to discuss",
    sender: "me",
    timestamp: "10:33 AM",
    seen: true,
    encrypted: true,
    reactions: [{ emoji: "😊", count: 1 }],
    type: "text",
  },
];

export default function ChatDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      text: inputText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      seen: false,
      encrypted: true,
      reactions: [],
      type: "text",
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulate typing indicator
    setTimeout(() => {
      const replyMessage: Message = {
        id: String(messages.length + 2),
        text: "That sounds perfect! 🎉",
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        seen: true,
        encrypted: true,
        reactions: [],
        type: "text",
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 2000);
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isMe = message.sender === "me";

    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: isMe ? "row-reverse" : "row",
          justifyContent: "flex-start",
        }}
      >
        {/* Message Bubble */}
        <View
          style={{
            maxWidth: "75%",
            backgroundColor: isMe ? colors.primary : colors.surface,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderTopLeftRadius: isMe ? 16 : 4,
            borderTopRightRadius: isMe ? 4 : 16,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: isMe ? colors.background : colors.foreground,
              lineHeight: 20,
            }}
          >
            {message.text}
          </Text>

          {/* Message Footer */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 4,
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: isMe
                  ? colors.background + "99"
                  : colors.muted,
              }}
            >
              {message.timestamp}
            </Text>
            {isMe && (
              <>
                {message.encrypted && (
                  <ShieldIcon
                    size={12}
                    color={colors.background + "99"}
                  />
                )}
                {message.seen && (
                  <DoubleCheckIcon
                    size={12}
                    color={colors.background + "99"}
                  />
                )}
              </>
            )}
          </View>
        </View>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              marginHorizontal: 8,
              alignItems: "flex-end",
            }}
          >
            {message.reactions.map((reaction, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 12 }}>
                  {reaction.emoji} {reaction.count}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="p-0">
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Pressable onPress={() => router.back()}>
              <BackIcon size={24} color={colors.foreground} />
            </Pressable>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.foreground,
                }}
              >
                Alice Johnson
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                }}
              >
                Active now
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              style={({ pressed }) => ({
                padding: 8,
                borderRadius: 8,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <CallIcon size={20} color={colors.primary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => ({
                padding: 8,
                borderRadius: 8,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <VideoCallIcon size={20} color={colors.primary} />
            </Pressable>
            <Pressable
              onPress={() => setShowMenu(!showMenu)}
              style={({ pressed }) => ({
                padding: 8,
                borderRadius: 8,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <MenuIcon size={20} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            {/* Attachment Button */}
            <Pressable
              style={({ pressed }) => ({
                padding: 8,
                borderRadius: 8,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <AttachmentIcon size={20} color={colors.primary} />
            </Pressable>

            {/* Text Input */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <TextInput
                placeholder="Type a message..."
                placeholderTextColor={colors.muted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: colors.foreground,
                  maxHeight: 100,
                }}
              />
            </View>

            {/* Send/Mic Button */}
            <Pressable
              onPress={inputText.trim() ? handleSend : undefined}
              style={({ pressed }) => ({
                padding: 8,
                borderRadius: 20,
                backgroundColor: inputText.trim()
                  ? colors.primary
                  : colors.surface,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              {inputText.trim() ? (
                <SendIcon size={20} color={colors.background} />
              ) : (
                <MicrophoneIcon size={20} color={colors.primary} />
              )}
            </Pressable>
          </View>

          {/* Encryption Info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
            }}
          >
            <ShieldIcon size={14} color={colors.primary} />
            <Text
              style={{
                fontSize: 11,
                color: colors.muted,
              }}
            >
              Messages are end-to-end encrypted
            </Text>
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
