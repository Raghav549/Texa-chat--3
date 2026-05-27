import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number");
const usernameSchema = z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/, "Invalid username");
const messageContentSchema = z.string().min(1).max(4096);

// ============================================================================
// AUTHENTICATION PROCEDURES
// ============================================================================

export const appRouter = router({
  auth: router({
    // Send OTP to phone number
    sendOtp: publicProcedure
      .input(z.object({ phone: phoneSchema }))
      .mutation(async ({ input }) => {
        const { phone } = input;
        
        // Check if user exists
        const user = await db.getUserByPhone(phone);
        
        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        // Store OTP in database
        await db.createPhoneOTP(phone, otp, expiresAt);
        
        // TODO: Send OTP via SMS service (Twilio, AWS SNS, etc.)
        console.log(`[OTP] Phone: ${phone}, OTP: ${otp}`);
        
        return {
          success: true,
          message: "OTP sent to phone number",
          // For development only - remove in production
          otp: process.env.NODE_ENV === "development" ? otp : undefined,
        };
      }),

    // Verify OTP and create/login user
    verifyOtp: publicProcedure
      .input(z.object({
        phone: phoneSchema,
        otp: z.string().length(6),
      }))
      .mutation(async ({ input }) => {
        const { phone, otp } = input;
        
        // Get stored OTP
        const storedOtp = await db.getPhoneOTP(phone);
        
        if (!storedOtp) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "OTP expired or not found",
          });
        }
        
        if (storedOtp.otp !== otp) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid OTP",
          });
        }
        
        // Check if user exists
        let user = await db.getUserByPhone(phone);
        
        if (!user) {
          // Create new user with temporary username
          const tempUsername = `user_${crypto.randomBytes(4).toString("hex")}`;
          const publicKey = crypto.randomBytes(32).toString("base64");
          const signingPublicKey = crypto.randomBytes(32).toString("base64");
          
          const userId = await db.createUser({
            phone,
            username: tempUsername,
            publicKey,
            signingPublicKey,
            isPhoneVerified: true,
          });
          
          user = await db.getUserById(userId);
        } else {
          // Update last seen
          await db.updateUser(user.id, { lastSeen: new Date() });
        }
        
        // Delete OTP
        await db.deletePhoneOTP(phone);
        
        // Create session
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        
        await db.createSession({
          userId: user!.id,
          deviceId: crypto.randomBytes(16).toString("hex"),
          token,
          expiresAt,
        });
        
        return {
          success: true,
          user: user!,
          token,
          requiresUsernameSetup: !user!.username || user!.username.startsWith("user_"),
        };
      }),

    // Setup username after registration
    setupUsername: protectedProcedure
      .input(z.object({
        username: usernameSchema,
        avatar: z.string().url().optional(),
        bio: z.string().max(255).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { username, avatar, bio } = input;
        
        // Check if username is available
        const existing = await db.getUserByUsername(username);
        if (existing && existing.id !== ctx.user!.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already taken",
          });
        }
        
        await db.updateUser(ctx.user!.id, {
          username,
          avatar,
          bio,
        });
        
        return { success: true };
      }),

    // Get current user
    me: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),

    // Logout
    logout: protectedProcedure.mutation(async ({ ctx }) => {
      // TODO: Invalidate session
      return { success: true };
    }),
  }),

  // ============================================================================
  // USER PROCEDURES
  // ============================================================================

  users: router({
    // Get user profile
    getProfile: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const user = await db.getUserById(input.userId);
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }
        return user;
      }),

    // Search users
    search: protectedProcedure
      .input(z.object({ query: z.string().min(1).max(100) }))
      .query(async ({ input }) => {
        return db.searchUsers(input.query, 20);
      }),

    // Update profile
    updateProfile: protectedProcedure
      .input(z.object({
        username: usernameSchema.optional(),
        avatar: z.string().url().optional(),
        bio: z.string().max(255).optional(),
        status: z.string().max(255).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUser(ctx.user!.id, input);
        return { success: true };
      }),

    // Update privacy settings
    updatePrivacy: protectedProcedure
      .input(z.object({
        hideOnlineStatus: z.boolean().optional(),
        hideReadReceipts: z.boolean().optional(),
        hideProfilePhoto: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUser(ctx.user!.id, input);
        return { success: true };
      }),
  }),

  // ============================================================================
  // CONTACTS PROCEDURES
  // ============================================================================

  contacts: router({
    // Get contacts
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserContacts(ctx.user!.id);
    }),

    // Add contact
    add: protectedProcedure
      .input(z.object({ contactUserId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user!.id === input.contactUserId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot add yourself",
          });
        }
        
        const contactId = await db.addContact(ctx.user!.id, input.contactUserId);
        return { success: true, contactId };
      }),

    // Block contact
    block: protectedProcedure
      .input(z.object({ contactUserId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.blockContact(ctx.user!.id, input.contactUserId);
        return { success: true };
      }),

    // Remove contact
    remove: protectedProcedure
      .input(z.object({ contactUserId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeContact(ctx.user!.id, input.contactUserId);
        return { success: true };
      }),
  }),

  // ============================================================================
  // CHAT PROCEDURES
  // ============================================================================

  chats: router({
    // Get user chats
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserChats(ctx.user!.id);
    }),

    // Get chat details
    get: protectedProcedure
      .input(z.object({ chatId: z.number() }))
      .query(async ({ input }) => {
        return db.getChatById(input.chatId);
      }),

    // Create chat (private or group)
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["private", "group"]),
        name: z.string().max(255).optional(),
        memberIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        const chatId = await db.createChat({
          type: input.type,
          name: input.name,
          createdBy: ctx.user!.id,
        });
        
        // Add members
        for (const memberId of input.memberIds) {
          await db.addChatMember({
            chatId,
            userId: memberId,
            role: memberId === ctx.user!.id ? "admin" : "member",
          });
        }
        
        return { success: true, chatId };
      }),

    // Archive chat
    archive: protectedProcedure
      .input(z.object({ chatId: z.number() }))
      .mutation(async ({ input }) => {
        await db.archiveChat(input.chatId);
        return { success: true };
      }),

    // Mute chat
    mute: protectedProcedure
      .input(z.object({
        chatId: z.number(),
        muteUntil: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.muteChat(input.chatId, input.muteUntil);
        return { success: true };
      }),
  }),

  // ============================================================================
  // MESSAGE PROCEDURES
  // ============================================================================

  messages: router({
    // Get messages for chat
    list: protectedProcedure
      .input(z.object({
        chatId: z.number(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.getMessages(input.chatId, input.limit, input.offset);
      }),

    // Send message
    send: protectedProcedure
      .input(z.object({
        chatId: z.number(),
        content: messageContentSchema,
        type: z.enum(["text", "image", "video", "audio", "file"]).default("text"),
        mediaUrl: z.string().url().optional(),
        replyToId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const messageId = await db.sendMessage({
          chatId: input.chatId,
          senderId: ctx.user!.id,
          content: input.content,
          type: input.type,
          mediaUrl: input.mediaUrl,
          replyToId: input.replyToId,
        });
        
        return { success: true, messageId };
      }),

    // Edit message
    edit: protectedProcedure
      .input(z.object({
        messageId: z.number(),
        content: messageContentSchema,
      }))
      .mutation(async ({ input }) => {
        await db.updateMessage(input.messageId, input.content);
        return { success: true };
      }),

    // Delete message
    delete: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMessage(input.messageId);
        return { success: true };
      }),

    // Mark as read
    markAsRead: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markMessageAsRead(input.messageId, 0); // TODO: Use ctx.user.id
        return { success: true };
      }),

    // Add reaction
    react: protectedProcedure
      .input(z.object({
        messageId: z.number(),
        emoji: z.string().length(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.addMessageReaction(input.messageId, ctx.user!.id, input.emoji);
        return { success: true };
      }),

    // Pin message
    pin: protectedProcedure
      .input(z.object({ chatId: z.number(), messageId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.pinMessage(input.chatId, input.messageId, ctx.user!.id);
        return { success: true };
      }),

    // Star message
    star: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.starMessage(input.messageId, ctx.user!.id);
        return { success: true };
      }),
  }),

  // ============================================================================
  // STATUS PROCEDURES
  // ============================================================================

  status: router({
    // Create status
    create: protectedProcedure
      .input(z.object({
        content: z.string().max(500),
        type: z.enum(["text", "image", "video", "audio"]).default("text"),
        mediaUrl: z.string().url().optional(),
        privacy: z.enum(["everyone", "contacts", "custom"]).default("contacts"),
      }))
      .mutation(async ({ ctx, input }) => {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        const statusId = await db.createStatus({
          userId: ctx.user!.id,
          content: input.content,
          type: input.type,
          mediaUrl: input.mediaUrl,
          privacy: input.privacy,
          expiresAt,
        });
        
        return { success: true, statusId };
      }),

    // Get friends' statuses
    getFriends: protectedProcedure.query(async ({ ctx }) => {
      const contacts = await db.getUserContacts(ctx.user!.id);
      const contactIds = contacts.map(c => c.contactUserId);
      return db.getFriendsStatuses(contactIds);
    }),

    // Mark status as viewed
    view: protectedProcedure
      .input(z.object({ statusId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markStatusViewed(input.statusId, ctx.user!.id);
        return { success: true };
      }),
  }),

  // ============================================================================
  // CALL PROCEDURES
  // ============================================================================

  calls: router({
    // Get call history
    history: protectedProcedure.query(async ({ ctx }) => {
      return db.getCallHistory(ctx.user!.id);
    }),

    // Initiate call
    initiate: protectedProcedure
      .input(z.object({
        recipientId: z.number(),
        type: z.enum(["voice", "video"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const callId = await db.createCall({
          initiatorId: ctx.user!.id,
          recipientId: input.recipientId,
          type: input.type,
        });
        
        return { success: true, callId };
      }),

    // Update call status
    updateStatus: protectedProcedure
      .input(z.object({
        callId: z.number(),
        status: z.enum(["accepted", "rejected", "ended", "missed"]),
        duration: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateCallStatus(input.callId, input.status, input.duration);
        return { success: true };
      }),
  }),

  // ============================================================================
  // NOTIFICATION PROCEDURES
  // ============================================================================

  notifications: router({
    // Get notifications
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserNotifications(ctx.user!.id);
    }),

    // Mark as read
    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.notificationId);
        return { success: true };
      }),
  }),

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  health: publicProcedure.query(() => ({
    status: "ok",
    timestamp: new Date(),
  })),
});

export type AppRouter = typeof appRouter;
