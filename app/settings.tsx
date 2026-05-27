import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

interface Settings {
  notifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  autoDownload: boolean;
  saveToGallery: boolean;
}

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: true,
    autoDownload: true,
    saveToGallery: false,
  });

  const toggleSetting = (key: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    // TODO: Save settings to API
  };

  const SettingRow = ({
    label,
    description,
    value,
    onToggle,
  }: {
    label: string;
    description?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View
      className="flex-row justify-between items-center px-4 py-3 border-b border-border"
    >
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{label}</Text>
        {description && (
          <Text className="text-muted text-sm mt-1">{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
      />
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
        </View>

        {/* Notifications Section */}
        <View className="py-4">
          <Text className="px-4 text-lg font-bold text-foreground mb-2">
            Notifications
          </Text>
          <SettingRow
            label="Enable Notifications"
            description="Receive message and call notifications"
            value={settings.notifications}
            onToggle={() => toggleSetting("notifications")}
          />
          <SettingRow
            label="Sound"
            description="Play notification sound"
            value={settings.soundEnabled}
            onToggle={() => toggleSetting("soundEnabled")}
          />
          <SettingRow
            label="Vibration"
            description="Vibrate on new messages"
            value={settings.vibrationEnabled}
            onToggle={() => toggleSetting("vibrationEnabled")}
          />
        </View>

        {/* Display Section */}
        <View className="py-4 border-t border-border">
          <Text className="px-4 text-lg font-bold text-foreground mb-2">
            Display
          </Text>
          <SettingRow
            label="Dark Mode"
            description="Use dark theme"
            value={settings.darkMode}
            onToggle={() => toggleSetting("darkMode")}
          />
        </View>

        {/* Media Section */}
        <View className="py-4 border-t border-border">
          <Text className="px-4 text-lg font-bold text-foreground mb-2">
            Media
          </Text>
          <SettingRow
            label="Auto Download"
            description="Automatically download media"
            value={settings.autoDownload}
            onToggle={() => toggleSetting("autoDownload")}
          />
          <SettingRow
            label="Save to Gallery"
            description="Save received photos to gallery"
            value={settings.saveToGallery}
            onToggle={() => toggleSetting("saveToGallery")}
          />
        </View>

        {/* Storage Section */}
        <View className="py-4 border-t border-border">
          <Text className="px-4 text-lg font-bold text-foreground mb-2">
            Storage
          </Text>
          <Pressable
            className="flex-row justify-between items-center px-4 py-3 border-b border-border"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View>
              <Text className="text-foreground font-semibold">
                Clear Cache
              </Text>
              <Text className="text-muted text-sm mt-1">
                Free up storage space
              </Text>
            </View>
            <Text className="text-primary">→</Text>
          </Pressable>

          <Pressable
            className="flex-row justify-between items-center px-4 py-3 border-b border-border"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View>
              <Text className="text-foreground font-semibold">
                Manage Storage
              </Text>
              <Text className="text-muted text-sm mt-1">
                View storage usage
              </Text>
            </View>
            <Text className="text-primary">→</Text>
          </Pressable>
        </View>

        {/* About Section */}
        <View className="py-4 border-t border-border">
          <Text className="px-4 text-lg font-bold text-foreground mb-2">
            About
          </Text>
          <Pressable
            className="flex-row justify-between items-center px-4 py-3 border-b border-border"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View>
              <Text className="text-foreground font-semibold">
                About TEXA
              </Text>
              <Text className="text-muted text-sm mt-1">
                Version 1.0.0
              </Text>
            </View>
            <Text className="text-primary">→</Text>
          </Pressable>

          <Pressable
            className="flex-row justify-between items-center px-4 py-3 border-b border-border"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View>
              <Text className="text-foreground font-semibold">
                Privacy Policy
              </Text>
              <Text className="text-muted text-sm mt-1">
                Read our privacy policy
              </Text>
            </View>
            <Text className="text-primary">→</Text>
          </Pressable>

          <Pressable
            className="flex-row justify-between items-center px-4 py-3"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View>
              <Text className="text-foreground font-semibold">
                Terms of Service
              </Text>
              <Text className="text-muted text-sm mt-1">
                Read our terms
              </Text>
            </View>
            <Text className="text-primary">→</Text>
          </Pressable>
        </View>

        {/* Danger Zone */}
        <View className="py-4 border-t border-border px-4 mb-6">
          <Pressable
            className="px-4 py-3 rounded-lg items-center"
            style={({ pressed }) => [
              { backgroundColor: colors.error },
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {
              // TODO: Logout
              router.push("/");
            }}
          >
            <Text className="text-white font-semibold">Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
