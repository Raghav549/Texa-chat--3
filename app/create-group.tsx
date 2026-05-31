/**
 * TEXA Create Group Screen
 * Beautiful group creation with member selection and group settings
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  EditIcon,
  CameraIconExtended,
} from "@/components/svg-icons-extended";
import { useColors } from "@/hooks/use-colors";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  selected: boolean;
}

const MOCK_CONTACTS: GroupMember[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "👩‍🦰",
    phone: "+1 (555) 123-4567",
    selected: false,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "👨‍💼",
    phone: "+1 (555) 234-5678",
    selected: false,
  },
  {
    id: "3",
    name: "Charlie Brown",
    avatar: "👨‍🎓",
    phone: "+1 (555) 345-6789",
    selected: false,
  },
  {
    id: "4",
    name: "Diana Prince",
    avatar: "👩‍🦸",
    phone: "+1 (555) 456-7890",
    selected: false,
  },
  {
    id: "5",
    name: "Eve Wilson",
    avatar: "👩‍💻",
    phone: "+1 (555) 567-8901",
    selected: false,
  },
];

export default function CreateGroupScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("👥");
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState(MOCK_CONTACTS);
  const [isLoading, setIsLoading] = useState(false);

  const selectedMembers = members.filter((m) => m.selected);
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMember = (id: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Validation Error", "Group name is required");
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert("Validation Error", "Please select at least one member");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", `Group "${groupName}" created successfully`, [
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
            Create Group
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

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Group Avatar Section */}
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
                <Text style={{ fontSize: 60, lineHeight: 60 }}>{groupAvatar}</Text>
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
              Tap to change group avatar
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
            {/* Group Name */}
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
                Group Name
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
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="Enter group name"
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

            {/* Group Description */}
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
                Description (Optional)
              </Text>
              <View
                style={{
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 80,
                  justifyContent: "flex-start",
                  paddingTop: 12,
                }}
              >
                <TextInput
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  placeholder="Add a group description..."
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={3}
                  style={{
                    fontSize: 14,
                    color: colors.foreground,
                  }}
                />
              </View>
            </View>

            {/* Selected Members Summary */}
            {selectedMembers.length > 0 && (
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
                    fontWeight: "600",
                  }}
                >
                  👥 {selectedMembers.length} member{selectedMembers.length !== 1 ? "s" : ""} selected
                </Text>
              </View>
            )}
          </View>

          {/* Members Section */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
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
              Add Members
            </Text>

            {/* Search Bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 16 }}>🔍</Text>
              <TextInput
                placeholder="Search contacts..."
                placeholderTextColor={colors.muted}
                value={search}
                onChangeText={setSearch}
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 14,
                  color: colors.foreground,
                }}
              />
            </View>

            {/* Members List */}
            <FlatList
              data={filteredMembers}
              renderItem={({ item: member }) => (
                <Pressable
                  onPress={() => toggleMember(member.id)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    marginBottom: 8,
                    borderRadius: 12,
                    backgroundColor: member.selected
                      ? colors.primary
                      : colors.surface,
                    borderWidth: 1,
                    borderColor: member.selected ? colors.primary : colors.border,
                    gap: 12,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  {/* Avatar */}
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: colors.surface,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: member.selected ? 0.5 : 1,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{member.avatar}</Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: member.selected ? colors.background : colors.foreground,
                      }}
                    >
                      {member.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: member.selected ? colors.background : colors.muted,
                        marginTop: 2,
                      }}
                    >
                      {member.phone}
                    </Text>
                  </View>

                  {/* Checkbox */}
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      backgroundColor: member.selected
                        ? colors.background
                        : colors.border,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: member.selected
                        ? colors.background
                        : colors.border,
                    }}
                  >
                    {member.selected && (
                      <Text style={{ fontSize: 14, color: colors.primary }}>✓</Text>
                    )}
                  </View>
                </Pressable>
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
              onPress={() => router.back()}
              style={({ pressed }) => ({
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
              onPress={handleCreateGroup}
              disabled={isLoading}
              style={({ pressed }) => ({
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
                {isLoading ? "Creating..." : "Create Group"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
