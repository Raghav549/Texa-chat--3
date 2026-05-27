import { eq, and, or, desc, asc, gte, lte, like, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users,
  contacts,
  chats,
  chatMembers,
  messages,
  messageReadReceipts,
  messageReactions,
  groups,
  groupMembers,
  communities,
  communityMembers,
  statuses,
  statusViewers,
  calls,
  encryptionKeys,
  notifications,
  media,
  blockedUsers,
  phoneOTPs,
  sessions,
  loginAlerts,
  starredMessages,
  pinnedMessages,
  chatFolders,
  chatFolderItems,
  type InsertUser,
  type InsertChat,
  type InsertMessage,
  type InsertStatus,
  type InsertCall,
  type InsertNotification,
  type InsertPhoneOTP,
  type InsertSession,
  type InsertContact,
  type InsertChatMember,
  type InsertGroup,
  type InsertGroupMember,
  type InsertCommunity,
  type InsertCommunityMember,
  type InsertEncryptionKey,
  type InsertMedia,
  type InsertBlockedUser,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function createUser(data: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(users).values(data);
  return result[0]?.insertId || 0;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByPhone(phone: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUser(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function searchUsers(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(users)
    .where(or(
      like(users.username, `%${query}%`),
      like(users.bio, `%${query}%`)
    ))
    .limit(limit);
}

// ============================================================================
// AUTHENTICATION OPERATIONS
// ============================================================================

export async function createPhoneOTP(phone: string, otp: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(phoneOTPs).values({ phone, otp, expiresAt });
  return result[0]?.insertId || 0;
}

export async function getPhoneOTP(phone: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(phoneOTPs)
    .where(and(eq(phoneOTPs.phone, phone), gte(phoneOTPs.expiresAt, new Date())))
    .orderBy(desc(phoneOTPs.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function deletePhoneOTP(phone: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(phoneOTPs).where(eq(phoneOTPs.phone, phone));
}

export async function createSession(data: InsertSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(sessions).values(data);
  return result[0]?.insertId || 0;
}

export async function getSessionByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(sessions)
    .where(and(eq(sessions.token, token), gte(sessions.expiresAt, new Date())))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserSessions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(sessions)
    .where(and(eq(sessions.userId, userId), gte(sessions.expiresAt, new Date())))
    .orderBy(desc(sessions.lastActivity));
}

export async function deleteSession(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function createLoginAlert(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(loginAlerts).values(data);
  return result[0]?.insertId || 0;
}

// ============================================================================
// CONTACT OPERATIONS
// ============================================================================

export async function addContact(userId: number, contactUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contacts).values({ userId, contactUserId });
  return result[0]?.insertId || 0;
}

export async function getUserContacts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(contacts)
    .where(and(eq(contacts.userId, userId), eq(contacts.isBlocked, false)))
    .orderBy(desc(contacts.createdAt));
}

export async function blockContact(userId: number, contactUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contacts)
    .set({ isBlocked: true })
    .where(and(eq(contacts.userId, userId), eq(contacts.contactUserId, contactUserId)));
}

export async function removeContact(userId: number, contactUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(contacts)
    .where(and(eq(contacts.userId, userId), eq(contacts.contactUserId, contactUserId)));
}

// ============================================================================
// CHAT OPERATIONS
// ============================================================================

export async function createChat(data: InsertChat) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(chats).values(data);
  return result[0]?.insertId || 0;
}

export async function getChatById(chatId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(chats).where(eq(chats.id, chatId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserChats(userId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(chats)
    .innerJoin(chatMembers, eq(chats.id, chatMembers.chatId))
    .where(and(eq(chatMembers.userId, userId), eq(chats.isArchived, false)))
    .orderBy(desc(chats.lastMessageAt))
    .limit(limit)
    .offset(offset);
}

export async function updateChat(chatId: number, data: Partial<InsertChat>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(chats).set(data).where(eq(chats.id, chatId));
}

export async function archiveChat(chatId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(chats).set({ isArchived: true }).where(eq(chats.id, chatId));
}

export async function muteChat(chatId: number, muteUntil?: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(chats).set({ isMuted: true, muteUntil }).where(eq(chats.id, chatId));
}

export async function addChatMember(data: InsertChatMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(chatMembers).values(data);
  return result[0]?.insertId || 0;
}

export async function getChatMembers(chatId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(chatMembers)
    .where(eq(chatMembers.chatId, chatId))
    .orderBy(desc(chatMembers.joinedAt));
}

export async function removeChatMember(chatId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(chatMembers)
    .where(and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, userId)));
}

// ============================================================================
// MESSAGE OPERATIONS
// ============================================================================

export async function sendMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(messages).values(data);
  return result[0]?.insertId || 0;
}

export async function getMessages(chatId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getMessageById(messageId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateMessage(messageId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(messages)
    .set({ content, isEdited: true, editedAt: new Date() })
    .where(eq(messages.id, messageId));
}

export async function deleteMessage(messageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(messages).where(eq(messages.id, messageId));
}

export async function markMessageAsRead(messageId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(messageReadReceipts)
    .where(and(eq(messageReadReceipts.messageId, messageId), eq(messageReadReceipts.userId, userId)))
    .limit(1);
  
  if (existing.length === 0) {
    await db.insert(messageReadReceipts).values({ messageId, userId });
  }
}

export async function getMessageReadReceipts(messageId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(messageReadReceipts)
    .where(eq(messageReadReceipts.messageId, messageId));
}

export async function addMessageReaction(messageId: number, userId: number, emoji: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(messageReactions)
    .where(and(
      eq(messageReactions.messageId, messageId),
      eq(messageReactions.userId, userId),
      eq(messageReactions.emoji, emoji)
    ))
    .limit(1);
  
  if (existing.length === 0) {
    const result = await db.insert(messageReactions).values({ messageId, userId, emoji });
    return result[0]?.insertId || 0;
  }
}

export async function removeMessageReaction(messageId: number, userId: number, emoji: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(messageReactions)
    .where(and(
      eq(messageReactions.messageId, messageId),
      eq(messageReactions.userId, userId),
      eq(messageReactions.emoji, emoji)
    ));
}

export async function getMessageReactions(messageId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(messageReactions)
    .where(eq(messageReactions.messageId, messageId));
}

export async function pinMessage(chatId: number, messageId: number, pinnedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(messages).set({ isPinned: true }).where(eq(messages.id, messageId));
  const result = await db.insert(pinnedMessages).values({ chatId, messageId, pinnedBy });
  return result[0]?.insertId || 0;
}

export async function getPinnedMessages(chatId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(pinnedMessages)
    .where(eq(pinnedMessages.chatId, chatId))
    .orderBy(desc(pinnedMessages.pinnedAt));
}

export async function starMessage(messageId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(starredMessages)
    .where(and(eq(starredMessages.messageId, messageId), eq(starredMessages.userId, userId)))
    .limit(1);
  
  if (existing.length === 0) {
    const result = await db.insert(starredMessages).values({ messageId, userId });
    return result[0]?.insertId || 0;
  }
}

export async function getStarredMessages(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(starredMessages)
    .where(eq(starredMessages.userId, userId))
    .orderBy(desc(starredMessages.createdAt));
}

// ============================================================================
// GROUP OPERATIONS
// ============================================================================

export async function createGroup(data: InsertGroup) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(groups).values(data);
  return result[0]?.insertId || 0;
}

export async function getGroupById(groupId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserGroups(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(groups)
    .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
    .where(eq(groupMembers.userId, userId))
    .orderBy(desc(groups.createdAt));
}

export async function addGroupMember(data: InsertGroupMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(groupMembers).values(data);
  return result[0]?.insertId || 0;
}

export async function getGroupMembers(groupId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(groupMembers)
    .where(eq(groupMembers.groupId, groupId))
    .orderBy(desc(groupMembers.joinedAt));
}

export async function removeGroupMember(groupId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(groupMembers)
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)));
}

// ============================================================================
// STATUS OPERATIONS
// ============================================================================

export async function createStatus(data: InsertStatus) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(statuses).values(data);
  return result[0]?.insertId || 0;
}

export async function getUserStatuses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(statuses)
    .where(and(eq(statuses.userId, userId), gte(statuses.expiresAt, new Date())))
    .orderBy(desc(statuses.createdAt));
}

export async function getFriendsStatuses(userIds: number[]) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(statuses)
    .where(and(inArray(statuses.userId, userIds), gte(statuses.expiresAt, new Date())))
    .orderBy(desc(statuses.createdAt));
}

export async function markStatusViewed(statusId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(statusViewers)
    .where(and(eq(statusViewers.statusId, statusId), eq(statusViewers.userId, userId)))
    .limit(1);
  
  if (existing.length === 0) {
    await db.insert(statusViewers).values({ statusId, userId });
  }
}

export async function getStatusViewers(statusId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(statusViewers)
    .where(eq(statusViewers.statusId, statusId))
    .orderBy(desc(statusViewers.viewedAt));
}

// ============================================================================
// CALL OPERATIONS
// ============================================================================

export async function createCall(data: InsertCall) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(calls).values(data);
  return result[0]?.insertId || 0;
}

export async function getCallHistory(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(calls)
    .where(or(eq(calls.initiatorId, userId), eq(calls.recipientId, userId)))
    .orderBy(desc(calls.createdAt))
    .limit(limit);
}

export async function updateCallStatus(callId: number, status: string, duration?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status, endedAt: new Date() };
  if (duration !== undefined) updateData.duration = duration;
  
  await db.update(calls).set(updateData).where(eq(calls.id, callId));
}

// ============================================================================
// NOTIFICATION OPERATIONS
// ============================================================================

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(notifications).values(data);
  return result[0]?.insertId || 0;
}

export async function getUserNotifications(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notifications.id, notificationId));
}

// ============================================================================
// ENCRYPTION OPERATIONS
// ============================================================================

export async function createEncryptionKey(data: InsertEncryptionKey) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(encryptionKeys).values(data);
  return result[0]?.insertId || 0;
}

export async function getUserEncryptionKeys(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(encryptionKeys)
    .where(eq(encryptionKeys.userId, userId))
    .orderBy(desc(encryptionKeys.createdAt));
}

// ============================================================================
// MEDIA OPERATIONS
// ============================================================================

export async function uploadMedia(data: InsertMedia) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(media).values(data);
  return result[0]?.insertId || 0;
}

export async function getUserMedia(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(media)
    .where(eq(media.userId, userId))
    .orderBy(desc(media.createdAt))
    .limit(limit);
}

// ============================================================================
// BLOCKING OPERATIONS
// ============================================================================

export async function blockUser(userId: number, blockedUserId: number, reason?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blockedUsers).values({ userId, blockedUserId, reason });
  return result[0]?.insertId || 0;
}

export async function getBlockedUsers(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(blockedUsers)
    .where(eq(blockedUsers.userId, userId))
    .orderBy(desc(blockedUsers.createdAt));
}

export async function unblockUser(userId: number, blockedUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blockedUsers)
    .where(and(eq(blockedUsers.userId, userId), eq(blockedUsers.blockedUserId, blockedUserId)));
}
