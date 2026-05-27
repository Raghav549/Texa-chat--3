import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  longtext,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

/**
 * TEXA Database Schema
 * Complete schema for ultra-secure messaging platform
 */

// ============================================================================
// AUTHENTICATION & USERS
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).unique(),
  avatar: text("avatar"), // S3 URL
  bio: text("bio"),
  status: varchar("status", { length: 255 }),
  role: mysqlEnum("role", ["user", "admin", "moderator"]).default("user").notNull(),
  publicKey: longtext("publicKey").notNull(), // X25519 public key (base64)
  publicKeyVersion: int("publicKeyVersion").default(1).notNull(),
  encryptedPrivateKey: longtext("encryptedPrivateKey"), // Encrypted locally on device
  signingPublicKey: longtext("signingPublicKey").notNull(), // Ed25519 public key
  signingPrivateKeyEncrypted: longtext("signingPrivateKeyEncrypted"), // Encrypted Ed25519
  isPhoneVerified: boolean("isPhoneVerified").default(false).notNull(),
  isBiometricEnabled: boolean("isBiometricEnabled").default(false).notNull(),
  is2FAEnabled: boolean("is2FAEnabled").default(false).notNull(),
  hideOnlineStatus: boolean("hideOnlineStatus").default(false).notNull(),
  hideReadReceipts: boolean("hideReadReceipts").default(false).notNull(),
  hideProfilePhoto: boolean("hideProfilePhoto").default(false).notNull(),
  lastSeen: timestamp("lastSeen"),
  isOnline: boolean("isOnline").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// AUTHENTICATION & SESSIONS
// ============================================================================

export const phoneOTPs = mysqlTable("phoneOTPs", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  attempts: int("attempts").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PhoneOTP = typeof phoneOTPs.$inferSelect;

export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 255 }).notNull(),
  deviceName: varchar("deviceName", { length: 255 }),
  token: longtext("token").notNull(), // JWT token
  refreshToken: longtext("refreshToken"),
  isTrusted: boolean("isTrusted").default(false).notNull(),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;

export const loginAlerts = mysqlTable("loginAlerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceName: varchar("deviceName", { length: 255 }),
  location: varchar("location", { length: 255 }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type LoginAlert = typeof loginAlerts.$inferSelect;

// ============================================================================
// CONTACTS & RELATIONSHIPS
// ============================================================================

export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contactUserId: int("contactUserId").notNull(),
  isFavorite: boolean("isFavorite").default(false).notNull(),
  isBlocked: boolean("isBlocked").default(false).notNull(),
  customName: varchar("customName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;

// ============================================================================
// CHATS & MESSAGING
// ============================================================================

export const chats = mysqlTable("chats", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["private", "group", "community"]).notNull(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  avatar: text("avatar"), // S3 URL
  createdBy: int("createdBy").notNull(),
  privacy: mysqlEnum("privacy", ["public", "private"]).default("private").notNull(),
  isArchived: boolean("isArchived").default(false).notNull(),
  isMuted: boolean("isMuted").default(false).notNull(),
  muteUntil: timestamp("muteUntil"),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Chat = typeof chats.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;

export const chatMembers = mysqlTable("chatMembers", {
  id: int("id").autoincrement().primaryKey(),
  chatId: int("chatId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "moderator", "member"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  leftAt: timestamp("leftAt"),
});

export type ChatMember = typeof chatMembers.$inferSelect;

export const messages = mysqlTable("messages", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  chatId: int("chatId").notNull(),
  senderId: int("senderId").notNull(),
  content: longtext("content"), // Encrypted message content
  contentEncrypted: boolean("contentEncrypted").default(true).notNull(),
  encryptionKey: longtext("encryptionKey"), // Encrypted with recipient's public key
  type: mysqlEnum("type", ["text", "image", "video", "audio", "file", "location"]).default("text").notNull(),
  mediaUrl: text("mediaUrl"), // S3 URL for media
  mediaSize: int("mediaSize"), // Size in bytes
  mediaMimeType: varchar("mediaMimeType", { length: 100 }),
  replyToId: bigint("replyToId", { mode: "number" }), // For threaded replies
  isPinned: boolean("isPinned").default(false).notNull(),
  isEdited: boolean("isEdited").default(false).notNull(),
  editedAt: timestamp("editedAt"),
  disappearsAt: timestamp("disappearsAt"), // For disappearing messages
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export const messageReadReceipts = mysqlTable("messageReadReceipts", {
  id: int("id").autoincrement().primaryKey(),
  messageId: bigint("messageId", { mode: "number" }).notNull(),
  userId: int("userId").notNull(),
  readAt: timestamp("readAt").defaultNow().notNull(),
});

export type MessageReadReceipt = typeof messageReadReceipts.$inferSelect;

export const messageReactions = mysqlTable("messageReactions", {
  id: int("id").autoincrement().primaryKey(),
  messageId: bigint("messageId", { mode: "number" }).notNull(),
  userId: int("userId").notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MessageReaction = typeof messageReactions.$inferSelect;

export const starredMessages = mysqlTable("starredMessages", {
  id: int("id").autoincrement().primaryKey(),
  messageId: bigint("messageId", { mode: "number" }).notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StarredMessage = typeof starredMessages.$inferSelect;

export const pinnedMessages = mysqlTable("pinnedMessages", {
  id: int("id").autoincrement().primaryKey(),
  chatId: int("chatId").notNull(),
  messageId: bigint("messageId", { mode: "number" }).notNull(),
  pinnedBy: int("pinnedBy").notNull(),
  pinnedAt: timestamp("pinnedAt").defaultNow().notNull(),
});

export type PinnedMessage = typeof pinnedMessages.$inferSelect;

// ============================================================================
// GROUPS & COMMUNITIES
// ============================================================================

export const groups = mysqlTable("groups", {
  id: int("id").autoincrement().primaryKey(),
  chatId: int("chatId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  avatar: text("avatar"),
  createdBy: int("createdBy").notNull(),
  privacy: mysqlEnum("privacy", ["public", "private"]).default("private").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  memberCount: int("memberCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Group = typeof groups.$inferSelect;

export const groupMembers = mysqlTable("groupMembers", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "moderator", "member"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  leftAt: timestamp("leftAt"),
});

export type GroupMember = typeof groupMembers.$inferSelect;

export const communities = mysqlTable("communities", {
  id: int("id").autoincrement().primaryKey(),
  chatId: int("chatId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  avatar: text("avatar"),
  createdBy: int("createdBy").notNull(),
  privacy: mysqlEnum("privacy", ["public", "private"]).default("private").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  memberCount: int("memberCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Community = typeof communities.$inferSelect;

export const communityMembers = mysqlTable("communityMembers", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "moderator", "member"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  leftAt: timestamp("leftAt"),
});

export type CommunityMember = typeof communityMembers.$inferSelect;

// ============================================================================
// STATUS & STORIES
// ============================================================================

export const statuses = mysqlTable("statuses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  content: longtext("content"),
  type: mysqlEnum("type", ["text", "image", "video", "audio"]).default("text").notNull(),
  mediaUrl: text("mediaUrl"),
  privacy: mysqlEnum("privacy", ["everyone", "contacts", "custom"]).default("contacts").notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  expiresAt: timestamp("expiresAt").notNull(), // 24 hours from creation
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Status = typeof statuses.$inferSelect;
export type InsertStatus = typeof statuses.$inferInsert;

export const statusViewers = mysqlTable("statusViewers", {
  id: int("id").autoincrement().primaryKey(),
  statusId: int("statusId").notNull(),
  userId: int("userId").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type StatusViewer = typeof statusViewers.$inferSelect;

export const statusReactions = mysqlTable("statusReactions", {
  id: int("id").autoincrement().primaryKey(),
  statusId: int("statusId").notNull(),
  userId: int("userId").notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StatusReaction = typeof statusReactions.$inferSelect;

// ============================================================================
// CALLS
// ============================================================================

export const calls = mysqlTable("calls", {
  id: int("id").autoincrement().primaryKey(),
  initiatorId: int("initiatorId").notNull(),
  recipientId: int("recipientId").notNull(),
  type: mysqlEnum("type", ["voice", "video"]).notNull(),
  status: mysqlEnum("status", ["ringing", "accepted", "rejected", "missed", "ended"]).default("ringing").notNull(),
  duration: int("duration").default(0), // Duration in seconds
  startedAt: timestamp("startedAt"),
  endedAt: timestamp("endedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Call = typeof calls.$inferSelect;
export type InsertCall = typeof calls.$inferInsert;

// ============================================================================
// ENCRYPTION & SECURITY
// ============================================================================

export const encryptionKeys = mysqlTable("encryptionKeys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  keyType: mysqlEnum("keyType", ["x25519", "ed25519"]).notNull(),
  publicKey: longtext("publicKey").notNull(), // Base64 encoded
  privateKeyEncrypted: longtext("privateKeyEncrypted"), // Encrypted, stored locally on device
  keyVersion: int("keyVersion").default(1).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  rotatedAt: timestamp("rotatedAt"),
});

export type EncryptionKey = typeof encryptionKeys.$inferSelect;

export const deviceFingerprints = mysqlTable("deviceFingerprints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 255 }).notNull(),
  fingerprint: varchar("fingerprint", { length: 255 }).notNull(),
  deviceName: varchar("deviceName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DeviceFingerprint = typeof deviceFingerprints.$inferSelect;

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "message",
    "call",
    "mention",
    "reaction",
    "status_view",
    "group_invite",
    "login_alert",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  relatedId: int("relatedId"), // ID of related entity (message, call, etc.)
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ============================================================================
// MEDIA & FILES
// ============================================================================

export const media = mysqlTable("media", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: int("fileSize").notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  s3Url: text("s3Url").notNull(),
  s3Key: text("s3Key").notNull(),
  isEncrypted: boolean("isEncrypted").default(true).notNull(),
  encryptionKeyId: int("encryptionKeyId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

// ============================================================================
// PRIVACY & BLOCKING
// ============================================================================

export const blockedUsers = mysqlTable("blockedUsers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  blockedUserId: int("blockedUserId").notNull(),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlockedUser = typeof blockedUsers.$inferSelect;

export const reportedUsers = mysqlTable("reportedUsers", {
  id: int("id").autoincrement().primaryKey(),
  reportedBy: int("reportedBy").notNull(),
  reportedUserId: int("reportedUserId").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "reviewing", "resolved", "dismissed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReportedUser = typeof reportedUsers.$inferSelect;

// ============================================================================
// CHAT FOLDERS & ORGANIZATION
// ============================================================================

export const chatFolders = mysqlTable("chatFolders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatFolder = typeof chatFolders.$inferSelect;

export const chatFolderItems = mysqlTable("chatFolderItems", {
  id: int("id").autoincrement().primaryKey(),
  folderId: int("folderId").notNull(),
  chatId: int("chatId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type ChatFolderItem = typeof chatFolderItems.$inferSelect;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type InsertPhoneOTP = typeof phoneOTPs.$inferInsert;
export type InsertSession = typeof sessions.$inferInsert;
export type InsertContact = typeof contacts.$inferInsert;
export type InsertChatMember = typeof chatMembers.$inferInsert;
export type InsertMessageReadReceipt = typeof messageReadReceipts.$inferInsert;
export type InsertMessageReaction = typeof messageReactions.$inferInsert;
export type InsertGroup = typeof groups.$inferInsert;
export type InsertGroupMember = typeof groupMembers.$inferInsert;
export type InsertCommunity = typeof communities.$inferInsert;
export type InsertCommunityMember = typeof communityMembers.$inferInsert;
export type InsertStatusViewer = typeof statusViewers.$inferInsert;
export type InsertStatusReaction = typeof statusReactions.$inferInsert;
export type InsertEncryptionKey = typeof encryptionKeys.$inferInsert;
export type InsertDeviceFingerprint = typeof deviceFingerprints.$inferInsert;
export type InsertBlockedUser = typeof blockedUsers.$inferInsert;
export type InsertReportedUser = typeof reportedUsers.$inferInsert;
export type InsertChatFolder = typeof chatFolders.$inferInsert;
export type InsertChatFolderItem = typeof chatFolderItems.$inferInsert;
