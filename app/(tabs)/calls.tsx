import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Call {
  id: number;
  contactName: string;
  contactId: number;
  type: "voice" | "video";
  direction: "incoming" | "outgoing";
  duration?: number;
  timestamp: Date;
  status: "missed" | "completed" | "declined";
}

export default function CallsScreen() {
  const colors = useColors();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCallHistory();
  }, []);

  const loadCallHistory = async () => {
    try {
      setLoading(true);
      // TODO: Fetch call history from API
      // const response = await trpc.calls.history.query();
      
      // Mock data
      setCalls([
        {
          id: 1,
          contactName: "Alice Johnson",
          contactId: 1,
          type: "video",
          direction: "incoming",
          duration: 1200,
          timestamp: new Date(Date.now() - 3600000),
          status: "completed",
        },
        {
          id: 2,
          contactName: "Bob Smith",
          contactId: 2,
          type: "voice",
          direction: "outgoing",
          timestamp: new Date(Date.now() - 7200000),
          status: "missed",
        },
      ]);
    } catch (error) {
      console.error("Error loading calls:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getCallIcon = (call: Call) => {
    if (call.direction === "incoming") {
      return call.status === "missed" ? "📥❌" : "📥";
    }
    return "📤";
  };

  const renderCallItem = ({ item }: { item: Call }) => (
    <Pressable
      className="flex-row items-center px-4 py-3 border-b border-border"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {/* Avatar */}
      <View
        className="w-12 h-12 rounded-full mr-3 items-center justify-center"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-xl">{getCallIcon(item)}</Text>
      </View>

      {/* Call Info */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-foreground font-semibold">{item.contactName}</Text>
          <Text className="text-muted text-xs">
            {item.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-muted text-sm">
            {item.type === "video" ? "📹 Video" : "📞 Voice"}
          </Text>
          {item.duration && (
            <Text className="text-muted text-sm ml-2">
              • {formatDuration(item.duration)}
            </Text>
          )}
          {item.status === "missed" && (
            <Text className="text-error text-sm ml-2">• Missed</Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <Pressable
          className="w-10 h-10 rounded-full items-center justify-center"
          style={({ pressed }) => [
            { backgroundColor: colors.primary },
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text className="text-white">📞</Text>
        </Pressable>
        <Pressable
          className="w-10 h-10 rounded-full items-center justify-center"
          style={({ pressed }) => [
            { backgroundColor: colors.surface },
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text>ℹ️</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-3xl font-bold text-foreground">Calls</Text>
      </View>

      {/* Calls List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : calls.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted text-center">No call history</Text>
        </View>
      ) : (
        <FlatList
          data={calls}
          renderItem={renderCallItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
        />
      )}
    </ScreenContainer>
  );
}
