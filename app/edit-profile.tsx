/**
 * TEXA Edit Profile Screen
 * Beautiful profile editing with form inputs and validation
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { EditIcon, CameraIconExtended } from "@/components/svg-icons-extended";
import { useColors } from "@/hooks/use-colors";

interface ProfileForm {
  name: string;
  phone: string;
  bio: string;
  avatar: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<ProfileForm>({
    name: "Alice Johnson",
    phone: "+1 (555) 123-4567",
    bio: "Digital nomad | Coffee enthusiast ☕ | Always connected 🌍",
    avatar: "👩‍🦰",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Validation Error", "Name is required");
      return;
    }

    if (!form.phone.trim()) {
      Alert.alert("Validation Error", "Phone number is required");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="p-0">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: colors.foreground,
              }}
            >
              Edit Profile
            </Text>

            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 24, color: colors.foreground }}>✕</Text>
            </Pressable>
          </View>

          {/* Avatar Section */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 24,
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View
              style={{
                position: "relative",
                marginBottom: 16,
              }}
            >
              {/* Avatar */}
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 3,
                  borderColor: colors.background,
                }}
              >
                <Text style={{ fontSize: 60 }}>{form.avatar}</Text>
              </View>

              {/* Edit Button */}
              <Pressable
                style={({ pressed }) => ({
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 3,
                  borderColor: colors.background,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <CameraIconExtended size={18} color={colors.background} />
              </Pressable>
            </View>

            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                textAlign: "center",
              }}
            >
              Tap to change avatar
            </Text>
          </View>

          {/* Form Fields */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 24,
              gap: 20,
            }}
          >
            {/* Name Field */}
            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: colors.foreground,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Full Name
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  gap: 8,
                }}
              >
                <EditIcon size={18} color={colors.muted} />
                <TextInput
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.muted}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    fontSize: 14,
                    color: colors.foreground,
                  }}
                />
              </View>
            </View>

            {/* Phone Field */}
            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: colors.foreground,
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
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 16, color: colors.muted }}>📱</Text>
                <TextInput
                  value={form.phone}
                  onChangeText={(text) => setForm({ ...form, phone: text })}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.muted}
                  keyboardType="phone-pad"
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    fontSize: 14,
                    color: colors.foreground,
                  }}
                />
              </View>
            </View>

            {/* Bio Field */}
            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: colors.foreground,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Bio
              </Text>
              <View
                style={{
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 100,
                  justifyContent: "flex-start",
                  paddingTop: 12,
                }}
              >
                <TextInput
                  value={form.bio}
                  onChangeText={(text) => setForm({ ...form, bio: text })}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={4}
                  style={{
                    fontSize: 14,
                    color: colors.foreground,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.muted,
                  marginTop: 6,
                }}
              >
                {form.bio.length}/150 characters
              </Text>
            </View>

            {/* Info Box */}
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.primary,
                opacity: 0.1,
                borderLeftWidth: 3,
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
                💡 <Text style={{ fontWeight: "600" }}>Tip:</Text> Keep your profile information up to date so
                friends can find you easily.
              </Text>
            </View>

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginTop: 12,
              }}
            >
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                  }}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={isLoading}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed || isLoading ? 0.8 : 1,
                })}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.background,
                  }}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
