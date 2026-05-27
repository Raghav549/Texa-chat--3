import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Switch, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface UserProfile {
  id: number;
  username: string;
  phone: string;
  email?: string;
  avatar?: string;
  bio?: string;
  status?: string;
}

interface PrivacySettings {
  hideOnlineStatus: boolean;
  hideReadReceipts: boolean;
  hideProfilePhoto: boolean;
}

export default function ProfileScreen() {
  const colors = useColors();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    hideOnlineStatus: false,
    hideReadReceipts: false,
    hideProfilePhoto: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // TODO: Fetch user profile from API
      // const response = await trpc.auth.me.query();
      
      // Mock data
      setUser({
        id: 1,
        username: "johndoe",
        phone: "+1234567890",
        email: "john@example.com",
        bio: "Software developer | Coffee enthusiast ☕",
        status: "Available",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyChange = (key: keyof PrivacySettings) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    // TODO: Update privacy settings on API
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-3xl font-bold text-foreground">Profile</Text>
        </View>

        {/* Profile Section */}
        <View className="px-4 py-6 border-b border-border">
          <View className="items-center mb-4">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white text-4xl font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">{user?.username}</Text>
            {user?.status && (
              <Text className="text-muted text-sm mt-1">{user.status}</Text>
            )}
          </View>

          <View className="gap-3">
            <View className="flex-row justify-between items-center px-3 py-2 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <Text className="text-muted">Phone</Text>
              <Text className="text-foreground font-semibold">{user?.phone}</Text>
            </View>
            {user?.email && (
              <View className="flex-row justify-between items-center px-3 py-2 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="text-muted">Email</Text>
                <Text className="text-foreground font-semibold">{user.email}</Text>
              </View>
            )}
            {user?.bio && (
              <View className="px-3 py-2 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="text-muted text-sm mb-1">Bio</Text>
                <Text className="text-foreground">{user.bio}</Text>
              </View>
            )}
          </View>

          <Pressable
            className="mt-4 px-4 py-3 rounded-lg items-center"
            style={({ pressed }) => [
              { backgroundColor: colors.primary },
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text className="text-white font-semibold">Edit Profile</Text>
          </Pressable>
        </View>

        {/* Privacy Settings */}
        <View className="px-4 py-6 border-b border-border">
          <Text className="text-lg font-bold text-foreground mb-4">Privacy</Text>

          <View className="gap-3">
            <View className="flex-row justify-between items-center px-3 py-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Hide Online Status</Text>
                <Text className="text-muted text-sm">Others won't see when you're online</Text>
              </View>
              <Switch
                value={privacy.hideOnlineStatus}
                onValueChange={() => handlePrivacyChange("hideOnlineStatus")}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View className="flex-row justify-between items-center px-3 py-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Hide Read Receipts</Text>
                <Text className="text-muted text-sm">Others won't see if you've read their messages</Text>
              </View>
              <Switch
                value={privacy.hideReadReceipts}
                onValueChange={() => handlePrivacyChange("hideReadReceipts")}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View className="flex-row justify-between items-center px-3 py-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Hide Profile Photo</Text>
                <Text className="text-muted text-sm">Only show to contacts</Text>
              </View>
              <Switch
                value={privacy.hideProfilePhoto}
                onValueChange={() => handlePrivacyChange("hideProfilePhoto")}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Security Settings */}
        <View className="px-4 py-6 border-b border-border">
          <Text className="text-lg font-bold text-foreground mb-4">Security</Text>

          <View className="gap-3">
            <Pressable
              className="flex-row justify-between items-center px-3 py-3 rounded-lg"
              style={({ pressed }) => [
                { backgroundColor: colors.surface },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text className="text-foreground font-semibold">Enable Biometric</Text>
              <Text className="text-primary">→</Text>
            </Pressable>

            <Pressable
              className="flex-row justify-between items-center px-3 py-3 rounded-lg"
              style={({ pressed }) => [
                { backgroundColor: colors.surface },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text className="text-foreground font-semibold">Two-Factor Authentication</Text>
              <Text className="text-primary">→</Text>
            </Pressable>

            <Pressable
              className="flex-row justify-between items-center px-3 py-3 rounded-lg"
              style={({ pressed }) => [
                { backgroundColor: colors.surface },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text className="text-foreground font-semibold">Active Sessions</Text>
              <Text className="text-primary">→</Text>
            </Pressable>
          </View>
        </View>

        {/* About & Support */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold text-foreground mb-4">About</Text>

          <View className="gap-3">
            <Pressable
              className="flex-row justify-between items-center px-3 py-3 rounded-lg"
              style={({ pressed }) => [
                { backgroundColor: colors.surface },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text className="text-foreground font-semibold">Help & Support</Text>
              <Text className="text-primary">→</Text>
            </Pressable>

            <Pressable
              className="flex-row justify-between items-center px-3 py-3 rounded-lg"
              style={({ pressed }) => [
                { backgroundColor: colors.surface },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text className="text-foreground font-semibold">About TEXA</Text>
              <Text className="text-primary">→</Text>
            </Pressable>

            <Pressable
              className="flex-row justify-between items-center px-3 py-3 rounded-lg"
              style={({ pressed }) => [
                { backgroundColor: colors.surface },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text className="text-foreground font-semibold">Logout</Text>
              <Text className="text-error">→</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
