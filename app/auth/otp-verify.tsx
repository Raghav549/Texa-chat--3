/**
 * TEXA OTP Verification Screen
 * Beautiful OTP input with animated verification
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { BackIcon, CheckIcon } from "@/components/svg-icons";
import { useColors } from "@/hooks/use-colors";

export default function OTPVerifyScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Timer for resend
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            setCanResend(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      alert("Please enter a 6-digit code");
      return;
    }

    setLoading(true);

    // Animate verification
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate verification
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 1000);
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setOtp("");
    // Resend OTP logic
  };

  const renderOTPInput = () => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            style={{
              width: 50,
              height: 60,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderWidth: 2,
              borderColor:
                otp[index] ? colors.primary : colors.border,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                color: colors.foreground,
              }}
            >
              {otp[index] || ""}
            </Text>
          </View>
        ))}
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
            paddingTop: 16,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              marginBottom: 16,
            })}
          >
            <BackIcon size={24} color={colors.foreground} />
          </Pressable>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: colors.foreground,
              marginBottom: 8,
            }}
          >
            Verify Code
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>
            We sent a code to {params.phone}
          </Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40 }}>
          {/* OTP Input */}
          <Animated.View
            style={{
              marginBottom: 32,
              transform: [{ scale: scaleAnim }],
            }}
          >
            {renderOTPInput()}
          </Animated.View>

          {/* Hidden TextInput for keyboard */}
          <TextInput
            value={otp}
            onChangeText={(text) => {
              if (text.length <= 6 && /^\d*$/.test(text)) {
                setOtp(text);
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
            style={{
              position: "absolute",
              opacity: 0,
              width: 0,
              height: 0,
            }}
            autoFocus
          />

          {/* Timer */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            {!canResend ? (
              <Text style={{ fontSize: 14, color: colors.muted }}>
                Resend code in{" "}
                <Text style={{ fontWeight: "600", color: colors.primary }}>
                  {timer}s
                </Text>
              </Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.primary,
                    fontWeight: "600",
                  }}
                >
                  Resend Code
                </Text>
              </Pressable>
            )}
          </View>

          {/* Info */}
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: colors.primary + "15",
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.foreground,
                lineHeight: 18,
              }}
            >
              Enter the 6-digit code we sent to your phone. It will expire in 10 minutes.
            </Text>
          </View>
        </View>

        {/* Verify Button */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Pressable
            onPress={handleVerify}
            disabled={otp.length !== 6 || loading}
            style={({ pressed }) => ({
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor:
                otp.length !== 6 || loading ? colors.border : colors.primary,
              opacity: pressed ? 0.9 : 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            })}
          >
            {loading && <CheckIcon size={20} color={colors.background} />}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.background,
              }}
            >
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
