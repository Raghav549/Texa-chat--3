/**
 * TEXA Profile Screen
 * Beautiful user profile with edit, privacy, security, and account settings
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  EditIcon,
  SettingsIcon,
  PrivacyIcon,
  SecurityIcon,
  NotificationIcon,
  EncryptionIcon,
  BiometricIcon,
  DataIcon,
  LogoutIcon,
  HelpIcon,
  AboutIcon,
} from "@/components/svg-icons-extended";
import { useColors } from "@/hooks/use-colors";

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  bio: string;
  status: "online" | "offline" | "away";
  joinedDate: string;
  encryptionEnabled: boolean;
  biometricEnabled: boolean;
}

const MOCK_USER: UserProfile = {
  id: "1",
  name: "Alice Johnson",
  phone: "+1 (555) 123-4567",
  avatar: "👩‍🦰",
  bio: "Digital nomad | Coffee enthusiast ☕ | Always connected 🌍",
  status: "online",
  joinedDate: "Joined January 2024",
  encryptionEnabled: true,
  biometricEnabled: true,
};

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
  badge?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState(MOCK_USER);
  const [editMode, setEditMode] = useState(false);

  const settings: SettingItem[] = [
    {
      id: "privacy",
      title: "Privacy Settings",
      description: "Control who can see your profile",
      icon: <PrivacyIcon size={24} color="#8B5CF6" />,
      color: "#8B5CF6",
      onPress: () => Alert.alert("Privacy Settings", "Control who can see your profile and messages"),
    },
    {
      id: "security",
      title: "Security",
      description: "Password, 2FA, and device management",
      icon: <SecurityIcon size={24} color="#EF4444" />,
      color: "#EF4444",
      onPress: () => Alert.alert("Security", "Manage password, 2FA, and connected devices"),
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage notification preferences",
      icon: <NotificationIcon size={24} color="#06B6D4" />,
      color: "#06B6D4",
      onPress: () => Alert.alert("Notifications", "Manage notification preferences and alerts"),
    },
    {
      id: "encryption",
      title: "Encryption",
      description: "End-to-end encryption settings",
      icon: <EncryptionIcon size={24} color="#22C55E" />,
      color: "#22C55E",
      badge: "E2E",
      onPress: () => Alert.alert("Encryption", "End-to-end encryption is enabled for all chats"),
    },
    {
      id: "biometric",
      title: "Biometric Security",
      description: "Face ID / Fingerprint authentication",
      icon: <BiometricIcon size={24} color="#8B5CF6" />,
      color: "#8B5CF6",
      onPress: () => Alert.alert("Biometric", "Biometric authentication is enabled"),
    },
    {
      id: "data",
      title: "Data & Storage",
      description: "Manage your data and storage usage",
      icon: <DataIcon size={24} color="#F59E0B" />,
      color: "#F59E0B",
      onPress: () => Alert.alert("Data & Storage", "Manage your data usage and storage"),
    },
    {
      id: "help",
      title: "Help & Support",
      description: "Get help and contact support",
      icon: <HelpIcon size={24} color="#6366F1" />,
      color: "#6366F1",
      onPress: () => Alert.alert("Help", "Contact support at support@texa.app"),
    },
    {
      id: "about",
      title: "About TEXA",
      description: "Version 1.0.0 • Privacy Policy",
      icon: <AboutIcon size={24} color="#14B8A6" />,
      color: "#14B8A6",
      onPress: () => Alert.alert("About", "TEXA v1.0.0 - Connect Beyond Limits"),
    },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Profile Card */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 24,
            backgroundColor: colors.primary,
          }}
        >
          {/* Top Bar */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: colors.foreground,
              }}
            >
              Profile
            </Text>

            <Pressable
              onPress={() => setEditMode(!editMode)}
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
              <EditIcon size={20} color={colors.background} />
            </Pressable>
          </View>

          {/* Profile Card */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Avatar */}
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
                borderColor: colors.background,
              }}
            >
              <Text style={{ fontSize: 48 }}>{user.avatar}</Text>
            </View>

            {/* Status Indicator */}
            <View
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: user.status === "online" ? "#22C55E" : "#9CA3AF",
                borderWidth: 3,
                borderColor: colors.surface,
              }}
            />

            {/* Name */}
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: colors.foreground,
                marginBottom: 4,
              }}
            >
              {user.name}
            </Text>

            {/* Phone */}
            <Text
              style={{
                fontSize: 13,
                color: colors.muted,
                marginBottom: 12,
              }}
            >
              {user.phone}
            </Text>

            {/* Bio */}
            <Text
              style={{
                fontSize: 13,
                color: colors.foreground,
                textAlign: "center",
                marginBottom: 12,
                fontStyle: "italic",
              }}
            >
              {user.bio}
            </Text>

            {/* Joined Date */}
            <Text
              style={{
                fontSize: 11,
                color: colors.muted,
              }}
            >
              {user.joinedDate}
            </Text>
          </View>
        </View>

        {/* Settings Sections */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
          {/* Account Settings */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.muted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 12,
              }}
            >
              Account & Security
            </Text>

            {settings.slice(0, 6).map((setting) => (
              <Pressable
                key={setting.id}
                onPress={setting.onPress}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  marginBottom: 8,
                  borderRadius: 12,
                  backgroundColor: pressed ? colors.surface : colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  gap: 12,
                })}
              >
                {/* Icon */}
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: setting.color,
                    opacity: 0.15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {setting.icon}
                </View>

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.foreground,
                    }}
                  >
                    {setting.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                      marginTop: 2,
                    }}
                  >
                    {setting.description}
                  </Text>
                </View>

                {/* Badge */}
                {setting.badge && (
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      backgroundColor: setting.color,
                      opacity: 0.2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: setting.color,
                      }}
                    >
                      {setting.badge}
                    </Text>
                  </View>
                )}

                {/* Arrow */}
                <Text style={{ fontSize: 16, color: colors.muted }}>→</Text>
              </Pressable>
            ))}
          </View>

          {/* Support & About */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.muted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 12,
              }}
            >
              Support & About
            </Text>

            {settings.slice(6).map((setting) => (
              <Pressable
                key={setting.id}
                onPress={setting.onPress}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  marginBottom: 8,
                  borderRadius: 12,
                  backgroundColor: pressed ? colors.surface : colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  gap: 12,
                })}
              >
                {/* Icon */}
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: setting.color,
                    opacity: 0.15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {setting.icon}
                </View>

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.foreground,
                    }}
                  >
                    {setting.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                      marginTop: 2,
                    }}
                  >
                    {setting.description}
                  </Text>
                </View>

                {/* Arrow */}
                <Text style={{ fontSize: 16, color: colors.muted }}>→</Text>
              </Pressable>
            ))}
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={() => {
              Alert.alert("Logout", "Are you sure you want to logout?", [
                { text: "Cancel", onPress: () => {} },
                {
                  text: "Logout",
                  onPress: () => router.replace("/auth/login"),
                },
              ]);
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: "#EF4444",
              opacity: pressed ? 0.8 : 1,
              marginBottom: 24,
            })}
          >
            <LogoutIcon size={20} color="#fff" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Logout
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
