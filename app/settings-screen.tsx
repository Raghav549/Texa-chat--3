/**
 * TEXA Settings Screen
 * Beautiful settings with theme, notifications, privacy, and advanced options
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  ThemeIcon,
  NotificationIcon,
  PrivacyIcon,
  EncryptionIcon,
  BiometricIcon,
  DataIcon,
} from "@/components/svg-icons-extended";
import { useColors } from "@/hooks/use-colors";

interface SettingToggle {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState<SettingToggle[]>([
    {
      id: "notifications",
      title: "Push Notifications",
      description: "Receive notifications for new messages",
      enabled: true,
      icon: <NotificationIcon size={24} color="#06B6D4" />,
      color: "#06B6D4",
    },
    {
      id: "sounds",
      title: "Message Sounds",
      description: "Play sound for incoming messages",
      enabled: true,
      icon: <NotificationIcon size={24} color="#06B6D4" />,
      color: "#06B6D4",
    },
    {
      id: "vibration",
      title: "Vibration",
      description: "Vibrate on new messages",
      enabled: true,
      icon: <NotificationIcon size={24} color="#06B6D4" />,
      color: "#06B6D4",
    },
    {
      id: "encryption",
      title: "End-to-End Encryption",
      description: "Encrypt all messages and calls",
      enabled: true,
      icon: <EncryptionIcon size={24} color="#22C55E" />,
      color: "#22C55E",
    },
    {
      id: "biometric",
      title: "Biometric Lock",
      description: "Use Face ID / Fingerprint to unlock",
      enabled: false,
      icon: <BiometricIcon size={24} color="#8B5CF6" />,
      color: "#8B5CF6",
    },
    {
      id: "autoDownload",
      title: "Auto-Download Media",
      description: "Automatically download photos and videos",
      enabled: true,
      icon: <DataIcon size={24} color="#F59E0B" />,
      color: "#F59E0B",
    },
    {
      id: "readReceipts",
      title: "Read Receipts",
      description: "Let others see when you've read messages",
      enabled: true,
      icon: <PrivacyIcon size={24} color="#8B5CF6" />,
      color: "#8B5CF6",
    },
    {
      id: "typingIndicator",
      title: "Typing Indicator",
      description: "Show when you're typing",
      enabled: true,
      icon: <PrivacyIcon size={24} color="#8B5CF6" />,
      color: "#8B5CF6",
    },
  ]);

  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
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
              fontSize: 32,
              fontWeight: "700",
              color: colors.foreground,
            }}
          >
            Settings
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

        {/* Theme Selection */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
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
            Appearance
          </Text>

          <View style={{ gap: 8 }}>
            {["light", "dark", "auto"].map((t) => (
              <Pressable
                key={t}
                onPress={() => setTheme(t as "light" | "dark" | "auto")}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor:
                    theme === t ? colors.primary : colors.surface,
                  borderWidth: 2,
                  borderColor: theme === t ? colors.primary : colors.border,
                  opacity: pressed ? 0.8 : 1,
                  gap: 12,
                })}
              >
                <ThemeIcon
                  size={24}
                  color={theme === t ? colors.background : colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color:
                        theme === t ? colors.background : colors.foreground,
                      textTransform: "capitalize",
                    }}
                  >
                    {t === "auto" ? "System" : t.charAt(0).toUpperCase() + t.slice(1)} Mode
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color:
                        theme === t
                          ? colors.background
                          : colors.muted,
                      marginTop: 2,
                    }}
                  >
                    {t === "light"
                      ? "Always light theme"
                      : t === "dark"
                      ? "Always dark theme"
                      : "Follow system settings"}
                  </Text>
                </View>
                {theme === t && (
                  <Text style={{ fontSize: 18, color: colors.background }}>
                    ✓
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notification Settings */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
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
            Notifications & Sounds
          </Text>

          {settings.slice(0, 3).map((setting) => (
            <View
              key={setting.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 12,
                marginBottom: 8,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                gap: 12,
              }}
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

              {/* Toggle */}
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          ))}
        </View>

        {/* Privacy & Security */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
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
            Privacy & Security
          </Text>

          {settings.slice(3, 6).map((setting) => (
            <View
              key={setting.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 12,
                marginBottom: 8,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                gap: 12,
              }}
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

              {/* Toggle */}
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          ))}
        </View>

        {/* Privacy Controls */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
          }}
        >
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
            Privacy Controls
          </Text>

          {settings.slice(6).map((setting) => (
            <View
              key={setting.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 12,
                marginBottom: 8,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                gap: 12,
              }}
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

              {/* Toggle */}
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
