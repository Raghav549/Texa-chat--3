/**
 * TEXA Call Interface Screen
 * Beautiful real-time call interface with WebRTC peer connections
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { webrtcManager } from "@/lib/webrtc-manager";

const { width, height } = Dimensions.get("window");

interface CallStats {
  duration: number;
  bitrate: number;
  latency: number;
  packetLoss: number;
  jitter: number;
}

export default function CallInterfaceScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const callId = (params.callId as string) || "call_" + Date.now();
  const peerId = (params.peerId as string) || "peer_123";
  const peerName = (params.peerName as string) || "Alice Johnson";
  const peerAvatar = (params.peerAvatar as string) || "👩‍🦰";
  const callType = (params.callType as "audio" | "video") || "audio";

  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video");
  const [callDuration, setCallDuration] = useState(0);
  const [callStats, setCallStats] = useState<CallStats>({
    duration: 0,
    bitrate: 0,
    latency: 0,
    packetLoss: 0,
    jitter: 0,
  });
  const [showStats, setShowStats] = useState(false);
  const durationIntervalRef = useRef<any>(null);

  useEffect(() => {
    // Start call
    initializeCall();

    // Cleanup on unmount
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      endCall();
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Initiate call
      await webrtcManager.initiateCall(
        callId,
        peerId,
        peerName,
        peerAvatar,
        callType
      );

      // Listen for connection
      webrtcManager.on("callConnected", ({ callId: cid }) => {
        if (cid === callId) {
          setIsConnected(true);

          // Start duration timer
          durationIntervalRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
          }, 1000);

          // Start stats monitoring
          webrtcManager.startStatsMonitoring(callId, 1000);
        }
      });

      // Listen for stats updates
      webrtcManager.on("statsUpdate", (stats) => {
        if (stats.callId === callId) {
          setCallStats({
            duration: stats.duration,
            bitrate: stats.bitrate,
            latency: stats.latency * 1000, // Convert to ms
            packetLoss: stats.packetLoss,
            jitter: stats.jitter * 1000, // Convert to ms
          });
        }
      });

      // Listen for disconnection
      webrtcManager.on("callDisconnected", ({ callId: cid }) => {
        if (cid === callId) {
          setIsConnected(false);
        }
      });
    } catch (error) {
      Alert.alert("Call Error", `Failed to initialize call: ${error}`);
      router.back();
    }
  };

  const endCall = () => {
    webrtcManager.stopStatsMonitoring();
    webrtcManager.endCall(callId);

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
  };

  const handleEndCall = () => {
    Alert.alert("End Call", "Are you sure you want to end this call?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "End Call",
        onPress: () => {
          endCall();
          router.back();
        },
        style: "destructive",
      },
    ]);
  };

  const handleToggleMute = () => {
    const newState = !isMuted;
    webrtcManager.toggleAudio(callId, !newState);
    setIsMuted(newState);
  };

  const handleToggleVideo = () => {
    const newState = !isVideoEnabled;
    webrtcManager.toggleVideo(callId, newState);
    setIsVideoEnabled(newState);
  };

  const handleSwitchCamera = async () => {
    await webrtcManager.switchCamera(callId);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <ScreenContainer className="p-0" edges={["top", "left", "right", "bottom"]}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "space-between",
          paddingBottom: insets.bottom,
        }}
      >
        {/* Call Header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            alignItems: "center",
          }}
        >
          {/* Peer Avatar */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
              borderWidth: 3,
              borderColor: isConnected ? colors.success : colors.warning,
            }}
          >
            <Text style={{ fontSize: 40, lineHeight: 40 }}>{peerAvatar}</Text>
          </View>

          {/* Peer Name */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: colors.foreground,
              marginBottom: 4,
            }}
          >
            {peerName}
          </Text>

          {/* Call Status */}
          <Text
            style={{
              fontSize: 13,
              color: isConnected ? colors.success : colors.warning,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            {isConnected ? "Connected" : "Calling..."}
          </Text>

          {/* Duration */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.primary,
            }}
          >
            {formatDuration(callDuration)}
          </Text>
        </View>

        {/* Stats Panel (Optional) */}
        {showStats && isConnected && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginHorizontal: 16,
              marginVertical: 12,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: colors.muted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 8,
              }}
            >
              Call Quality
            </Text>

            <View
              style={{
                gap: 6,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.muted,
                  }}
                >
                  Bitrate:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: colors.foreground,
                  }}
                >
                  {(callStats.bitrate / 1000000).toFixed(2)} Mbps
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.muted,
                  }}
                >
                  Latency:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: colors.foreground,
                  }}
                >
                  {callStats.latency.toFixed(0)} ms
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.muted,
                  }}
                >
                  Packet Loss:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: colors.foreground,
                  }}
                >
                  {callStats.packetLoss}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.muted,
                  }}
                >
                  Jitter:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: colors.foreground,
                  }}
                >
                  {callStats.jitter.toFixed(0)} ms
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Control Buttons */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            gap: 12,
          }}
        >
          {/* Primary Controls */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            {/* Mute Button */}
            <Pressable
              onPress={handleToggleMute}
              style={({ pressed }) => ({
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: isMuted ? colors.error : colors.primary,
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ fontSize: 24 }}>
                {isMuted ? "🔇" : "🎤"}
              </Text>
            </Pressable>

            {/* Video Toggle Button (if video call) */}
            {callType === "video" && (
              <Pressable
                onPress={handleToggleVideo}
                style={({ pressed }) => ({
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: isVideoEnabled ? colors.primary : colors.error,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ fontSize: 24 }}>
                  {isVideoEnabled ? "📹" : "📹‍🚫"}
                </Text>
              </Pressable>
            )}

            {/* Speaker Button */}
            <Pressable
              onPress={() => Alert.alert("Speaker", "Toggle speaker")}
              style={({ pressed }) => ({
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ fontSize: 24 }}>🔊</Text>
            </Pressable>
          </View>

          {/* Secondary Controls */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            {/* Switch Camera Button (if video call) */}
            {callType === "video" && (
              <Pressable
                onPress={handleSwitchCamera}
                style={({ pressed }) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ fontSize: 12, fontWeight: "600" }}>
                  🔄 Switch Camera
                </Text>
              </Pressable>
            )}

            {/* Stats Button */}
            <Pressable
              onPress={() => setShowStats(!showStats)}
              style={({ pressed }) => ({
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: showStats ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: showStats ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: showStats ? colors.background : colors.foreground,
                }}
              >
                📊 Stats
              </Text>
            </Pressable>
          </View>

          {/* End Call Button */}
          <Pressable
            onPress={handleEndCall}
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.error,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.background,
              }}
            >
              ☎️ End Call
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
