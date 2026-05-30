/**
 * TEXA Status/Stories Screen
 * Beautiful stories with 24-hour validation, view counts, and reactions
 */

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  PlusIcon,
  CameraIcon,
  StoryIcon,
} from "@/components/svg-icons";
import { useColors } from "@/hooks/use-colors";

interface Story {
  id: string;
  name: string;
  avatar: string;
  stories: {
    id: string;
    image: string;
    text?: string;
    timestamp: string;
    views: number;
    reactions: { emoji: string; count: number }[];
    seen: boolean;
  }[];
  hasUnseenStories: boolean;
  isOnline: boolean;
}

const MOCK_STORIES: Story[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "👩‍🦰",
    hasUnseenStories: true,
    isOnline: true,
    stories: [
      {
        id: "1-1",
        image: "🌅",
        text: "Beautiful morning!",
        timestamp: "2 hours ago",
        views: 24,
        reactions: [
          { emoji: "❤️", count: 12 },
          { emoji: "😍", count: 8 },
        ],
        seen: false,
      },
      {
        id: "1-2",
        image: "☕",
        text: "Coffee time ☕",
        timestamp: "1 hour ago",
        views: 18,
        reactions: [{ emoji: "👍", count: 5 }],
        seen: false,
      },
    ],
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "👨‍💼",
    hasUnseenStories: false,
    isOnline: false,
    stories: [
      {
        id: "2-1",
        image: "💼",
        text: "Working on a new project",
        timestamp: "5 hours ago",
        views: 42,
        reactions: [{ emoji: "🚀", count: 15 }],
        seen: true,
      },
    ],
  },
  {
    id: "3",
    name: "Design Team",
    avatar: "👥",
    hasUnseenStories: true,
    isOnline: true,
    stories: [
      {
        id: "3-1",
        image: "🎨",
        text: "New design mockups ready!",
        timestamp: "30 min ago",
        views: 8,
        reactions: [{ emoji: "🔥", count: 3 }],
        seen: false,
      },
    ],
  },
];

export default function StatusScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [stories, setStories] = useState(MOCK_STORIES);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const renderStoryPreview = ({ item: story }: { item: Story }) => {
    const latestStory = story.stories[story.stories.length - 1];

    return (
      <Pressable
        onPress={() => setSelectedStory(story)}
        style={({ pressed }) => ({
          marginRight: 12,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View
          style={{
            width: 80,
            height: 120,
            borderRadius: 12,
            backgroundColor: colors.surface,
            justifyContent: "flex-end",
            overflow: "hidden",
            borderWidth: story.hasUnseenStories ? 2 : 1,
            borderColor: story.hasUnseenStories
              ? colors.primary
              : colors.border,
          }}
        >
          {/* Story Image/Emoji */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 40, lineHeight: 40 }}>{latestStory.image}</Text>
          </View>

          {/* Gradient Overlay */}
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 8,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 4,
                borderWidth: 2,
                borderColor: story.hasUnseenStories
                  ? colors.primary
                  : colors.border,
              }}
            >
              <Text style={{ fontSize: 16 }}>{story.avatar}</Text>
            </View>

            {/* Name */}
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: "#fff",
              }}
              numberOfLines={1}
            >
              {story.name}
            </Text>

            {/* Time */}
            <Text
              style={{
                fontSize: 9,
                color: "#ccc",
              }}
            >
              {latestStory.timestamp}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (selectedStory) {
    const currentStory = selectedStory.stories[0];

    return (
      <ScreenContainer className="p-0 bg-black">
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "space-between",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#333",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.surface,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>{selectedStory.avatar}</Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  {selectedStory.name}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: "#999",
                  }}
                >
                  {currentStory.timestamp}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setSelectedStory(null)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 24, color: "#fff" }}>✕</Text>
            </Pressable>
          </View>

          {/* Story Content */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 80, lineHeight: 80 }}>{currentStory.image}</Text>
            {currentStory.text && (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#fff",
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                {currentStory.text}
              </Text>
            )}
          </View>

          {/* Story Info */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: "#333",
            }}
          >
            {/* Views */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 12, color: "#999" }}>
                👁️ {currentStory.views} views
              </Text>
            </View>

            {/* Reactions */}
            {currentStory.reactions.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {currentStory.reactions.map((reaction, index) => (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: "#333",
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {reaction.emoji} {reaction.count}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Pressable
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ fontSize: 12, color: "#fff", fontWeight: "600" }}>
                  React
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: "#333",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ fontSize: 12, color: "#fff", fontWeight: "600" }}>
                  Reply
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
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
          Status
        </Text>

        <Pressable
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
          <PlusIcon size={20} color={colors.background} />
        </Pressable>
      </View>

      {/* Add Your Story */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: colors.primary,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <CameraIcon size={20} color={colors.primary} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.primary,
              marginLeft: 8,
            }}
          >
            Add Your Story
          </Text>
        </Pressable>
      </View>

      {/* Stories List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        {stories.map((story) => (
          <View key={story.id}>
            {renderStoryPreview({ item: story })}
          </View>
        ))}
      </ScrollView>

      {/* Stories Details */}
      <FlatList
        data={stories}
        renderItem={({ item: story }) => (
          <Pressable
            onPress={() => setSelectedStory(story)}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: pressed ? colors.surface : colors.background,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            })}
          >
            {/* Avatar */}
            <View
              style={{
                position: "relative",
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 28 }}>{story.avatar}</Text>
              {story.hasUnseenStories && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: colors.primary,
                    borderWidth: 2,
                    borderColor: colors.background,
                  }}
                />
              )}
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.foreground,
                }}
              >
                {story.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  marginTop: 2,
                }}
              >
                {story.stories.length} stor{story.stories.length !== 1 ? "ies" : "y"} • {story.stories[0].timestamp}
              </Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
