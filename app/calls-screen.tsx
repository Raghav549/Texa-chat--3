/**
 * TEXA Calls Screen
 * Beautiful call interface with WebRTC, call history, and quality indicators
 */

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Animated,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  CallIcon,
  VideoCallIcon,
  BackIcon,
  MicrophoneIcon,
  CameraIcon,
} from "@/components/svg-icons";
import { useColors } from "@/hooks/use-colors";

interface CallRecord {
  id: string;
  name: string;
  avatar: string;
  type: "incoming" | "outgoing" | "missed";
  callType: "voice" | "video";
  duration: string;
  timestamp: string;
  quality: "excellent" | "good" | "fair" | "poor";
}

const MOCK_CALLS: CallRecord[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "👩‍🦰",
    type: "incoming",
    callType: "video",
    duration: "12:34",
    timestamp: "Today 2:30 PM",
    quality: "excellent",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "👨‍💼",
    type: "outgoing",
    callType: "voice",
    duration: "5:12",
    timestamp: "Yesterday 10:15 AM",
    quality: "good",
  },
  {
    id: "3",
    name: "Mom",
    avatar: "👩",
    type: "missed",
    callType: "voice",
    duration: "0:00",
    timestamp: "Yesterday 9:45 AM",
    quality: "excellent",
  },
  {
    id: "4",
    name: "Design Team",
    avatar: "👥",
    type: "incoming",
    callType: "video",
    duration: "45:23",
    timestamp: "2 days ago",
    quality: "fair",
  },
];

export default function CallsScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<"history" | "active">("history");
  const [isInCall, setIsInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState("00:45");

  const renderCallRecord = ({ item: call }: { item: CallRecord }) => {
    const getCallIcon = () => {
      if (call.type === "missed") {
        return "❌";
      }
      return call.type === "incoming" ? "📥" : "📤";
    };

    const getQualityColor = () => {
      switch (call.quality) {
        case "excellent":
          return colors.success;
        case "good":
          return "#3B82F6";
        case "fair":
          return "#F59E0B";
        case "poor":
          return colors.error;
      }
    };

    return (
      <Pressable
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
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24 }}>{call.avatar}</Text>
        </View>

        {/* Call Info */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: colors.foreground,
              }}
            >
              {call.name}
            </Text>
            <Text style={{ fontSize: 12 }}>{getCallIcon()}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
              }}
            >
              {call.callType === "video" ? "📹 Video" : "🎤 Voice"} •{" "}
              {call.duration}
            </Text>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: getQualityColor(),
              }}
            />
          </View>
        </View>

        {/* Timestamp and Action */}
        <View style={{ alignItems: "flex-end", gap: 8 }}>
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
            }}
          >
            {call.timestamp}
          </Text>
          <Pressable
            style={({ pressed }) => ({
              padding: 6,
              borderRadius: 6,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            {call.callType === "video" ? (
              <VideoCallIcon size={18} color={colors.primary} />
            ) : (
              <CallIcon size={18} color={colors.primary} />
            )}
          </Pressable>
        </View>
      </Pressable>
    );
  };

  if (isInCall) {
    return (
      <ScreenContainer className="p-0 bg-black">
        {/* Active Call Screen */}
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "space-between",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          {/* Video Area */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#1a1a1a",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text style={{ fontSize: 64, lineHeight: 120 }}>👩‍🦰</Text>
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Alice Johnson
            </Text>

            <Text
              style={{
                fontSize: 32,
                fontWeight: "600",
                color: colors.primary,
                fontVariant: ["tabular-nums"],
              }}
            >
              {callDuration}
            </Text>
          </View>

          {/* Controls */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 24,
              gap: 16,
            }}
          >
            {/* Quality Indicator */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.success,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: "#999",
                }}
              >
                Excellent connection
              </Text>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 24,
              }}
            >
              {/* Microphone Toggle */}
              <Pressable
                onPress={() => setAudioEnabled(!audioEnabled)}
                style={({ pressed }) => ({
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: audioEnabled ? colors.surface : colors.error,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <MicrophoneIcon
                  size={24}
                  color={audioEnabled ? colors.primary : "#fff"}
                />
              </Pressable>

              {/* Video Toggle */}
              <Pressable
                onPress={() => setVideoEnabled(!videoEnabled)}
                style={({ pressed }) => ({
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: videoEnabled ? colors.surface : colors.error,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <CameraIcon
                  size={24}
                  color={videoEnabled ? colors.primary : "#fff"}
                />
              </Pressable>

              {/* End Call */}
              <Pressable
                onPress={() => setIsInCall(false)}
                style={({ pressed }) => ({
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.error,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ fontSize: 28 }}>📞</Text>
              </Pressable>
            </View>
          </View>
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
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: colors.foreground,
          }}
        >
          Calls
        </Text>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable
          onPress={() => setActiveTab("history")}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderBottomWidth: activeTab === "history" ? 2 : 0,
            borderBottomColor: colors.primary,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: activeTab === "history" ? "600" : "500",
              color:
                activeTab === "history" ? colors.primary : colors.muted,
            }}
          >
            History
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("active")}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderBottomWidth: activeTab === "active" ? 2 : 0,
            borderBottomColor: colors.primary,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: activeTab === "active" ? "600" : "500",
              color:
                activeTab === "active" ? colors.primary : colors.muted,
            }}
          >
            Active
          </Text>
        </Pressable>
      </View>

      {/* Call History List */}
      {activeTab === "history" && (
        <FlatList
          data={MOCK_CALLS}
          renderItem={renderCallRecord}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Active Calls */}
      {activeTab === "active" && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <CallIcon size={64} color={colors.muted} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.foreground,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            No active calls
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Start a call to see it here
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
