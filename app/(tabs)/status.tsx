import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Status {
  id: number;
  userId: number;
  username: string;
  content: string;
  type: "text" | "image" | "video";
  mediaUrl?: string;
  createdAt: Date;
  expiresAt: Date;
  viewedBy: number;
  isViewed: boolean;
}

export default function StatusScreen() {
  const colors = useColors();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      setLoading(true);
      // TODO: Fetch statuses from API
      // const response = await trpc.status.getFriends.query();
      
      // Mock data
      setStatuses([
        {
          id: 1,
          userId: 1,
          username: "Alice Johnson",
          content: "Having a great day! ☀️",
          type: "text",
          createdAt: new Date(Date.now() - 3600000),
          expiresAt: new Date(Date.now() + 82800000),
          viewedBy: 5,
          isViewed: true,
        },
        {
          id: 2,
          userId: 2,
          username: "Bob Smith",
          content: "Coffee time ☕",
          type: "text",
          createdAt: new Date(Date.now() - 7200000),
          expiresAt: new Date(Date.now() + 79200000),
          viewedBy: 12,
          isViewed: false,
        },
      ]);
    } catch (error) {
      console.error("Error loading statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusItem = ({ item }: { item: Status }) => (
    <Pressable
      className="flex-row items-center px-4 py-3 mb-3 rounded-lg"
      style={({ pressed }) => [
        { backgroundColor: colors.surface },
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      {/* Avatar with Indicator */}
      <View className="relative mr-3">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-bold text-lg">
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        {!item.isViewed && (
          <View
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        )}
      </View>

      {/* Status Info */}
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{item.username}</Text>
        <Text className="text-muted text-sm" numberOfLines={1}>
          {item.content}
        </Text>
        <Text className="text-muted text-xs mt-1">
          {item.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* View Count */}
      <View className="items-center">
        <Text className="text-muted text-sm">{item.viewedBy}</Text>
        <Text className="text-muted text-xs">viewed</Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-3xl font-bold text-foreground mb-2">Status</Text>
        <Text className="text-muted">Updates from your contacts</Text>
      </View>

      {/* My Status Section */}
      <Pressable
        className="flex-row items-center px-4 py-3 mb-4 rounded-lg border-2"
        style={({ pressed }) => [
          { borderColor: colors.primary },
          { backgroundColor: colors.surface },
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white text-xl">+</Text>
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-semibold">Add Status</Text>
          <Text className="text-muted text-sm">Share what's on your mind</Text>
        </View>
      </Pressable>

      {/* Statuses List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : statuses.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted text-center">
            No statuses yet. Add one to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={statuses}
          renderItem={renderStatusItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        />
      )}
    </ScreenContainer>
  );
}
