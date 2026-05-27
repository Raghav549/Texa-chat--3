import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

type AuthStep = "phone" | "otp" | "profile";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // TODO: Send OTP via API
      // await trpc.auth.sendOTP.mutate({ phone });
      
      setStep("otp");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // TODO: Verify OTP via API
      // const response = await trpc.auth.verifyOTP.mutate({ phone, otp });
      
      // If user exists, go to chats
      // Otherwise, go to profile setup
      setStep("profile");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // TODO: Create profile via API
      // await trpc.auth.createProfile.mutate({ phone, otp, username });
      
      // Navigate to main app
      router.replace("/(tabs)/chats");
    } catch (err) {
      setError("Failed to create profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScreenContainer className="justify-center p-6">
        {/* Logo */}
        <View className="items-center mb-8">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-5xl">💬</Text>
          </View>
          <Text className="text-3xl font-bold text-foreground">TEXA</Text>
          <Text className="text-muted mt-2">Connect Beyond Limits</Text>
        </View>

        {/* Phone Step */}
        {step === "phone" && (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Enter Your Phone Number
            </Text>
            <TextInput
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={colors.muted}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setError("");
              }}
              keyboardType="phone-pad"
              className="px-4 py-3 rounded-lg text-foreground border border-border"
              style={{ borderColor: colors.border }}
            />
            {error && (
              <Text className="text-error text-sm">{error}</Text>
            )}
            <Pressable
              onPress={handleSendOTP}
              disabled={loading}
              className="px-6 py-3 rounded-lg items-center mt-4"
              style={({ pressed }) => [
                { backgroundColor: colors.primary },
                { opacity: pressed || loading ? 0.8 : 1 },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Send OTP</Text>
              )}
            </Pressable>
          </View>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Enter OTP
            </Text>
            <Text className="text-muted text-sm">
              We've sent a 6-digit code to {phone}
            </Text>
            <TextInput
              placeholder="000000"
              placeholderTextColor={colors.muted}
              value={otp}
              onChangeText={(text) => {
                setOtp(text.replace(/[^0-9]/g, "").slice(0, 6));
                setError("");
              }}
              keyboardType="number-pad"
              maxLength={6}
              className="px-4 py-3 rounded-lg text-foreground border border-border text-center text-2xl tracking-widest"
              style={{ borderColor: colors.border }}
            />
            {error && (
              <Text className="text-error text-sm">{error}</Text>
            )}
            <Pressable
              onPress={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="px-6 py-3 rounded-lg items-center mt-4"
              style={({ pressed }) => [
                { backgroundColor: otp.length === 6 ? colors.primary : colors.border },
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Verify OTP</Text>
              )}
            </Pressable>

            <Pressable onPress={() => setStep("phone")}>
              <Text className="text-primary text-center font-semibold">
                Change Phone Number
              </Text>
            </Pressable>
          </View>
        )}

        {/* Profile Setup Step */}
        {step === "profile" && (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Create Your Profile
            </Text>
            <TextInput
              placeholder="Choose a username"
              placeholderTextColor={colors.muted}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setError("");
              }}
              className="px-4 py-3 rounded-lg text-foreground border border-border"
              style={{ borderColor: colors.border }}
            />
            {error && (
              <Text className="text-error text-sm">{error}</Text>
            )}
            <Pressable
              onPress={handleCreateProfile}
              disabled={loading}
              className="px-6 py-3 rounded-lg items-center mt-4"
              style={({ pressed }) => [
                { backgroundColor: colors.primary },
                { opacity: pressed || loading ? 0.8 : 1 },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Create Profile</Text>
              )}
            </Pressable>
          </View>
        )}

        {/* Footer */}
        <Text className="text-muted text-xs text-center mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
