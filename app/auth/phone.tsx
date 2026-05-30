/**
 * TEXA Phone Input Screen
 * Beautiful phone number entry with country selection
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { BackIcon } from "@/components/svg-icons";
import { useColors } from "@/hooks/use-colors";

const COUNTRIES = [
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
];

export default function PhoneScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const [loading, setLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;

  const handleContinue = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push({
        pathname: "/auth/login",
        params: { phone: `${countryCode}${phone}` },
      });
    }, 500);
  };

  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    setShowCountries(false);
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
            Enter Your Phone
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>
            We'll send you a verification code
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Country Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: colors.muted,
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Country
            </Text>
            <Pressable
              onPress={() => setShowCountries(!showCountries)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 16, color: colors.foreground }}>
                {COUNTRIES.find((c) => c.code === countryCode)?.flag}{" "}
                {COUNTRIES.find((c) => c.code === countryCode)?.name}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                {countryCode}
              </Text>
            </Pressable>

            {/* Country Dropdown */}
            {showCountries && (
              <View
                style={{
                  marginTop: 8,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  overflow: "hidden",
                }}
              >
                {COUNTRIES.map((country, index) => (
                  <Pressable
                    key={country.code}
                    onPress={() => handleCountrySelect(country.code)}
                    style={({ pressed }) => ({
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderBottomWidth: index < COUNTRIES.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                      backgroundColor: pressed ? colors.background : colors.surface,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    })}
                  >
                    <Text style={{ fontSize: 14, color: colors.foreground }}>
                      {country.flag} {country.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      {country.code}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Phone Input */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: colors.muted,
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Phone Number
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.foreground,
                  marginRight: 8,
                }}
              >
                {countryCode}
              </Text>
              <TextInput
                placeholder="1234567890"
                placeholderTextColor={colors.muted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={15}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: colors.foreground,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                marginTop: 8,
              }}
            >
              {phone.length}/15 digits
            </Text>
          </View>

          {/* Info Box */}
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: colors.primary + "15",
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.foreground,
                lineHeight: 18,
              }}
            >
              Your phone number will be used to create your account and send verification codes. We never share your number.
            </Text>
          </View>
        </ScrollView>

        {/* Continue Button */}
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
            onPress={handleContinue}
            disabled={!phone || loading}
            style={({ pressed }) => ({
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor:
                !phone || loading ? colors.border : colors.primary,
              opacity: pressed ? 0.9 : 1,
              alignItems: "center",
            })}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.background,
              }}
            >
              {loading ? "Sending..." : "Continue"}
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
