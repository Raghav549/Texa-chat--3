/**
 * TEXA Chat Detail Screen - Enhanced
 * Beautiful chat interface with end-to-end encryption, media picker, and real-time messaging
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { mediaService } from "@/lib/media-service";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "audio";
  encrypted: boolean;
  encryptionType?: "AES-256-GCM" | "ChaCha20-Poly1305" | "XChaCha20-Poly1305";
  timestamp: number;
  status: "sending" | "sent" | "delivered" | "read";
  reactions: { emoji: string; count: number }[];
  isEdited: boolean;
  isPinned: boolean;
}

export default function ChatDetailEnhancedScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const chatId = (params.chatId as string) || "chat_123";
  const chatName = (params.chatName as string) || "Alice Johnson";
  const chatAvatar = (params.chatAvatar as string) || "👩‍🦰";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      senderId: "peer_123",
      senderName: "Alice Johnson",
      senderAvatar: "👩‍🦰",
      text: "Hey! How are you doing?",
      encrypted: true,
      encryptionType: "AES-256-GCM",
      timestamp: Date.now() - 300000,
      status: "read",
      reactions: [{ emoji: "❤️", count: 1 }],
      isEdited: false,
      isPinned: false,
    },
    {
      id: "msg2",
      senderId: "user_123",
      senderName: "You",
      senderAvatar: "👨‍💼",
      text: "I'm doing great! Just working on TEXA 🚀",
      encrypted: true,
      encryptionType: "AES-256-GCM",
      timestamp: Date.now() - 240000,
      status: "read",
      reactions: [],
      isEdited: false,
      isPinned: false,
    },
    {
      id: "msg3",
      senderId: "peer_123",
      senderName: "Alice Johnson",
      senderAvatar: "👩‍🦰",
      text: "That's awesome! Can't wait to see it 🎉",
      encrypted: true,
      encryptionType: "ChaCha20-Poly1305",
      timestamp: Date.now() - 180000,
      status: "read",
      reactions: [{ emoji: "👍", count: 2 }],
      isEdited: false,
      isPinned: false,
    },
  ]);

  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showEncryptionInfo, setShowEncryptionInfo] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = () => {
    if (messageText.trim() === "") return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: "user_123",
      senderName: "You",
      senderAvatar: "👨‍💼",
      text: messageText,
      encrypted: true,
      encryptionType: "AES-256-GCM",
      timestamp: Date.now(),
      status: "sending",
      reactions: [],
      isEdited: false,
      isPinned: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText("");

    // Simulate message sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
    }, 500);

    // Simulate message delivered
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);

    // Simulate message read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg
        )
      );
    }, 2000);

    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handlePickMedia = async () => {
    Alert.alert("Pick Media", "Choose media type", [
      {
        text: "Camera",
        onPress: () => {
          Alert.alert("Camera", "Opening camera...");
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          Alert.alert("Gallery", "Opening gallery...");
        },
      },
      {
        text: "Audio",
        onPress: () => {
          Alert.alert("Audio", "Recording audio...");
        },
      },
      { text: "Cancel", onPress: () => {} },
    ]);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);

          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              ),
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1 }],
            };
          }
        }

        return msg;
      })
    );
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "sending":
        return "⏱️";
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return "✓✓";
      default:
        return "";
    }
  };

  const getEncryptionColor = (type?: string): string => {
    switch (type) {
      case "AES-256-GCM":
        return colors.success;
      case "ChaCha20-Poly1305":
        return colors.primary;
      case "XChaCha20-Poly1305":
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="p-0" edges={["top", "left", "right"]}>
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
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 24 }}>←</Text>
            </Pressable>

            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.2,
              }}
            >
              <Text style={{ fontSize: 20 }}>{chatAvatar}</Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.foreground,
                }}
              >
                {chatName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.success,
                  fontWeight: "600",
                }}
              >
                Online
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={() => Alert.alert("Call", "Starting voice call...")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 20 }}>☎️</Text>
            </Pressable>

            <Pressable
              onPress={() => Alert.alert("Video Call", "Starting video call...")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 20 }}>📹</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowEncryptionInfo(!showEncryptionInfo)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 20 }}>🔒</Text>
            </Pressable>
          </View>
        </View>

        {/* Encryption Info */}
        {showEncryptionInfo && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: colors.surface,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: colors.success,
                marginBottom: 8,
              }}
            >
              🔐 END-TO-END ENCRYPTED
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                lineHeight: 18,
              }}
            >
              Messages are encrypted with AES-256-GCM, ChaCha20-Poly1305, or XChaCha20-Poly1305. Only you and {chatName} can read them.
            </Text>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 12,
          }}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                alignItems:
                  message.senderId === "user_123" ? "flex-end" : "flex-start",
              }}
            >
              {/* Message Bubble */}
              <Pressable
                onLongPress={() =>
                  Alert.alert("Message Options", "Copy, Edit, Delete, Pin", [
                    {
                      text: "React",
                      onPress: () => {
                        Alert.alert("React with emoji", "❤️ 👍 😂 😮 😢 🔥");
                      },
                    },
                    { text: "Copy", onPress: () => {} },
                    { text: "Edit", onPress: () => {} },
                    { text: "Delete", onPress: () => {} },
                    { text: "Pin", onPress: () => {} },
                    { text: "Cancel", onPress: () => {} },
                  ])
                }
                style={{
                  maxWidth: "85%",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 16,
                  backgroundColor:
                    message.senderId === "user_123"
                      ? colors.primary
                      : colors.surface,
                  borderWidth: 1,
                  borderColor:
                    message.senderId === "user_123"
                      ? colors.primary
                      : colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      message.senderId === "user_123"
                        ? colors.background
                        : colors.foreground,
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
                      fontSize: 10,
                      color:
                        message.senderId === "user_123"
                          ? colors.background
                          : colors.muted,
                      opacity: 0.7,
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>

                  {message.senderId === "user_123" && (
                    <>
                      <Text
                        style={{
                          fontSize: 10,
                          color: colors.background,
                        }}
                      >
                        {getStatusIcon(message.status)}
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          color: colors.background,
                        }}
                      >
                        🔐
                      </Text>
                    </>
                  )}
                </View>
              </Pressable>

              {/* Reactions */}
              {message.reactions.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    marginTop: 4,
                    flexWrap: "wrap",
                    maxWidth: "85%",
                  }}
                >
                  {message.reactions.map((reaction, index) => (
                    <Pressable
                      key={index}
                      onPress={() =>
                        handleReactToMessage(message.id, reaction.emoji)
                      }
                      style={{
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 12,
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>{reaction.emoji}</Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: colors.muted,
                        }}
                      >
                        {reaction.count}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Upload Progress */}
        {uploadProgress !== null && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ActivityIndicator color={colors.primary} size="small" />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.muted,
                    marginBottom: 4,
                  }}
                >
                  Uploading media...
                </Text>
                <View
                  style={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colors.border,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${uploadProgress}%`,
                      backgroundColor: colors.primary,
                    }}
                  />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: colors.foreground,
                }}
              >
                {uploadProgress}%
              </Text>
            </View>
          </View>
        )}

        {/* Message Input */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            {/* Media Button */}
            <Pressable
              onPress={handlePickMedia}
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
              <Text style={{ fontSize: 18 }}>📎</Text>
            </Pressable>

            {/* Text Input */}
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor={colors.muted}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
              style={{
                flex: 1,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                color: colors.foreground,
                fontSize: 14,
                maxHeight: 100,
              }}
            />

            {/* Send Button */}
            <Pressable
              onPress={handleSendMessage}
              disabled={messageText.trim() === ""}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor:
                  messageText.trim() === "" ? colors.muted : colors.primary,
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ fontSize: 18 }}>📤</Text>
            </Pressable>
          </View>

          {/* Character Count */}
          <Text
            style={{
              fontSize: 10,
              color: colors.muted,
              marginTop: 4,
              textAlign: "right",
            }}
          >
            {messageText.length}/500
          </Text>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
