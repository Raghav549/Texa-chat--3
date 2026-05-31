/**
 * TEXA Group Detail Screen
 * Beautiful group management with member list and settings
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  isAdmin: boolean;
}

interface GroupData {
  id: string;
  name: string;
  description: string;
  avatar: string;
  memberCount: number;
  createdAt: string;
  members: GroupMember[];
}

const MOCK_GROUP: GroupData = {
  id: "g1",
  name: "Tech Team",
  description: "Our amazing tech team working on TEXA",
  avatar: "👥",
  memberCount: 5,
  createdAt: "2024-01-15",
  members: [
    {
      id: "1",
      name: "You",
      avatar: "👩‍💼",
      phone: "+1 (555) 111-1111",
      isAdmin: true,
    },
    {
      id: "2",
      name: "Alice Johnson",
      avatar: "👩‍🦰",
      phone: "+1 (555) 123-4567",
      isAdmin: true,
    },
    {
      id: "3",
      name: "Bob Smith",
      avatar: "👨‍💼",
      phone: "+1 (555) 234-5678",
      isAdmin: false,
    },
    {
      id: "4",
      name: "Charlie Brown",
      avatar: "👨‍🎓",
      phone: "+1 (555) 345-6789",
      isAdmin: false,
    },
    {
      id: "5",
      name: "Diana Prince",
      avatar: "👩‍🦸",
      phone: "+1 (555) 456-7890",
      isAdmin: false,
    },
  ],
};

export default function GroupDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [group, setGroup] = useState<GroupData>(MOCK_GROUP);
  const [showOptions, setShowOptions] = useState<string | null>(null);

  const handleRemoveMember = (memberId: string) => {
    const member = group.members.find((m) => m.id === memberId);
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${member?.name} from the group?`,
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Remove",
          onPress: () => {
            setGroup({
              ...group,
              members: group.members.filter((m) => m.id !== memberId),
              memberCount: group.memberCount - 1,
            });
            setShowOptions(null);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleMakeAdmin = (memberId: string) => {
    setGroup({
      ...group,
      members: group.members.map((m) =>
        m.id === memberId ? { ...m, isAdmin: !m.isAdmin } : m
      ),
    });
    setShowOptions(null);
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      "Leave Group",
      `Are you sure you want to leave "${group.name}"?`,
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Leave",
          onPress: () => router.back(),
          style: "destructive",
        },
      ]
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
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 24, color: colors.foreground }}>←</Text>
          </Pressable>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.foreground,
              flex: 1,
              marginLeft: 12,
            }}
          >
            Group Info
          </Text>

          <Pressable
            onPress={() => Alert.alert("Group Settings", "Edit group details")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </Pressable>
        </View>

        {/* Group Header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
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
              marginBottom: 16,
              borderWidth: 3,
              borderColor: colors.background,
            }}
          >
            <Text style={{ fontSize: 60, lineHeight: 60 }}>{group.avatar}</Text>
          </View>

          {/* Group Info */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: colors.foreground,
              marginBottom: 4,
            }}
          >
            {group.name}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: colors.muted,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {group.description}
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 16,
              marginTop: 12,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.primary,
                }}
              >
                {group.memberCount}
              </Text>
              <Text style={{ fontSize: 11, color: colors.muted }}>
                Members
              </Text>
            </View>

            <View
              style={{
                width: 1,
                backgroundColor: colors.border,
              }}
            />

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.primary,
                }}
              >
                {group.members.filter((m) => m.isAdmin).length}
              </Text>
              <Text style={{ fontSize: 11, color: colors.muted }}>
                Admins
              </Text>
            </View>
          </View>
        </View>

        {/* Members Section */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 16,
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
            Members ({group.members.length})
          </Text>

          <FlatList
            data={group.members}
            renderItem={({ item: member }) => (
              <View
                key={member.id}
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
                {/* Avatar */}
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0.2,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{member.avatar}</Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.foreground,
                      }}
                    >
                      {member.name}
                    </Text>
                    {member.isAdmin && (
                      <View
                        style={{
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 4,
                          backgroundColor: colors.primary,
                          opacity: 0.2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: "600",
                            color: colors.primary,
                          }}
                        >
                          ADMIN
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                      marginTop: 2,
                    }}
                  >
                    {member.phone}
                  </Text>
                </View>

                {/* Options Button */}
                <Pressable
                  onPress={() =>
                    setShowOptions(showOptions === member.id ? null : member.id)
                  }
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontSize: 18 }}>⋯</Text>
                </Pressable>

                {/* Options Menu */}
                {showOptions === member.id && member.id !== "1" && (
                  <View
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 50,
                      backgroundColor: colors.surface,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: colors.border,
                      overflow: "hidden",
                      zIndex: 10,
                    }}
                  >
                    <Pressable
                      onPress={() => handleMakeAdmin(member.id)}
                      style={({ pressed }) => ({
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        backgroundColor: pressed ? colors.border : "transparent",
                      })}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.foreground,
                          fontWeight: "500",
                        }}
                      >
                        {member.isAdmin ? "Remove Admin" : "Make Admin"}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleRemoveMember(member.id)}
                      style={({ pressed }) => ({
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        backgroundColor: pressed ? colors.border : "transparent",
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      })}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.error,
                          fontWeight: "500",
                        }}
                      >
                        Remove
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Action Buttons */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            gap: 12,
          }}
        >
          <Pressable
            onPress={() => Alert.alert("Add Members", "Select members to add")}
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.primary,
              borderWidth: 2,
              borderColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.5 : 0.1,
            })}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.primary,
              }}
            >
              ➕ Add Members
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLeaveGroup}
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.error,
              borderWidth: 2,
              borderColor: colors.error,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.5 : 0.1,
            })}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.error,
              }}
            >
              🚪 Leave Group
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
