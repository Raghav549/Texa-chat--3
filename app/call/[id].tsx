import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";

type CallState = "incoming" | "outgoing" | "connected" | "ended";

export default function CallScreen() {
  const colors = useColors();
  const { id, type } = useLocalSearchParams();
  const [callState, setCallState] = useState<CallState>("outgoing");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(type === "video");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (callState === "connected") {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAccept = () => {
    setCallState("connected");
  };

  const handleReject = () => {
    setCallState("ended");
  };

  const handleEndCall = () => {
    setCallState("ended");
  };

  if (callState === "ended") {
    return (
      <ScreenContainer className="items-center justify-center">
        <View className="items-center gap-4">
          <Text className="text-3xl">📞</Text>
          <Text className="text-2xl font-bold text-foreground">Call Ended</Text>
          <Text className="text-muted">Duration: {formatDuration(duration)}</Text>
          <Pressable
            className="mt-6 px-6 py-3 rounded-lg items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={() => {
              // Navigate back
            }}
          >
            <Text className="text-white font-semibold">Back to Chats</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="items-center justify-between p-0">
      {/* Video Area */}
      {type === "video" && (
        <View className="w-full h-1/2 bg-black items-center justify-center">
          {isVideoOn ? (
            <Text className="text-white text-6xl">📹</Text>
          ) : (
            <View className="items-center gap-2">
              <Text className="text-white text-6xl">🎥</Text>
              <Text className="text-white">Camera Off</Text>
            </View>
          )}
        </View>
      )}

      {/* Call Info */}
      <View className="flex-1 items-center justify-center gap-4">
        <View className="w-24 h-24 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary }}>
          <Text className="text-white text-5xl">👤</Text>
        </View>

        <Text className="text-2xl font-bold text-foreground">Alice Johnson</Text>

        {callState === "connected" && (
          <Text className="text-3xl font-bold text-primary">
            {formatDuration(duration)}
          </Text>
        )}

        {callState === "incoming" && (
          <Text className="text-lg text-muted">Incoming {type} call...</Text>
        )}

        {callState === "outgoing" && (
          <ActivityIndicator size="large" color={colors.primary} />
        )}
      </View>

      {/* Controls */}
      <View className="w-full px-4 py-6 gap-4">
        {callState === "incoming" && (
          <View className="flex-row justify-center gap-8">
            <Pressable
              onPress={handleReject}
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.error }}
            >
              <Text className="text-white text-3xl">❌</Text>
            </Pressable>
            <Pressable
              onPress={handleAccept}
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.success }}
            >
              <Text className="text-white text-3xl">✓</Text>
            </Pressable>
          </View>
        )}

        {callState === "connected" && (
          <View className="flex-row justify-center gap-4">
            <Pressable
              onPress={() => setIsMuted(!isMuted)}
              className="w-14 h-14 rounded-full items-center justify-center"
              style={{
                backgroundColor: isMuted ? colors.error : colors.surface,
              }}
            >
              <Text className="text-2xl">{isMuted ? "🔇" : "🔊"}</Text>
            </Pressable>

            {type === "video" && (
              <Pressable
                onPress={() => setIsVideoOn(!isVideoOn)}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{
                  backgroundColor: isVideoOn ? colors.surface : colors.error,
                }}
              >
                <Text className="text-2xl">{isVideoOn ? "📹" : "🎥"}</Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleEndCall}
              className="w-14 h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.error }}
            >
              <Text className="text-2xl">📞</Text>
            </Pressable>
          </View>
        )}

        {callState === "outgoing" && (
          <Pressable
            onPress={handleReject}
            className="px-6 py-3 rounded-lg items-center"
            style={{ backgroundColor: colors.error }}
          >
            <Text className="text-white font-semibold">Cancel Call</Text>
          </Pressable>
        )}
      </View>
    </ScreenContainer>
  );
}
