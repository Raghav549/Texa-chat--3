/**
 * TEXA Real-time Events Handler
 * Manages Socket.IO connections for real-time messaging, presence, and notifications
 */

import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import * as db from "./db";
import { validateTEXASession } from "./sdk-compat";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface UserSocket {
  userId: number;
  socketId: string;
  deviceId: string;
  isOnline: boolean;
}

interface TypingIndicator {
  chatId: number;
  userId: number;
  username: string;
}

// ============================================================================
// SOCKET.IO SETUP
// ============================================================================

let io: SocketIOServer | null = null;
const userSockets = new Map<number, UserSocket[]>(); // userId -> [sockets]
const typingUsers = new Map<number, Set<number>>(); // chatId -> Set<userId>

export function initializeSocketIO(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  // Middleware: authenticate socket connection
  io.use(async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      // Validate session
      const user = await validateTEXASession({
        headers: { authorization: `Bearer ${token}` },
      });

      if (!user) {
        return next(new Error("Invalid session"));
      }

      socket.data.userId = user.id;
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  // Connection handler
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    const user = socket.data.user;

    console.log(`[Socket.IO] User ${userId} connected: ${socket.id}`);

    // Register user socket
    if (!userSockets.has(userId)) {
      userSockets.set(userId, []);
    }
    userSockets.get(userId)!.push({
      userId,
      socketId: socket.id,
      deviceId: socket.handshake.auth.deviceId || "unknown",
      isOnline: true,
    });

    // Mark user as online
    db.updateUser(userId, { isOnline: true, lastSeen: new Date() });

    // Broadcast user online status
    io!.emit("user:online", { userId, username: user.username });

    // ========================================================================
    // MESSAGE EVENTS
    // ========================================================================

    socket.on("message:send", async (data: any) => {
      try {
        const { chatId, content, type, mediaUrl, replyToId } = data;

        // Send message to database
        const messageId = await db.sendMessage({
          chatId,
          senderId: userId,
          content,
          type: type || "text",
          mediaUrl,
          replyToId,
        });

        // Broadcast message to chat members
        io!.to(`chat:${chatId}`).emit("message:new", {
          id: messageId,
          chatId,
          senderId: userId,
          senderName: user.username,
          content,
          type,
          mediaUrl,
          replyToId,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("[Socket.IO] Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("message:edit", async (data: any) => {
      try {
        const { messageId, content } = data;
        await db.updateMessage(messageId, content);

        io!.emit("message:edited", { messageId, content, editedAt: new Date() });
      } catch (error) {
        console.error("[Socket.IO] Error editing message:", error);
      }
    });

    socket.on("message:delete", async (data: any) => {
      try {
        const { messageId } = data;
        await db.deleteMessage(messageId);

        io!.emit("message:deleted", { messageId });
      } catch (error) {
        console.error("[Socket.IO] Error deleting message:", error);
      }
    });

    socket.on("message:react", async (data: any) => {
      try {
        const { messageId, emoji } = data;
        await db.addMessageReaction(messageId, userId, emoji);

        io!.emit("message:reaction", { messageId, userId, emoji });
      } catch (error) {
        console.error("[Socket.IO] Error reacting to message:", error);
      }
    });

    socket.on("message:read", async (data: any) => {
      try {
        const { messageId } = data;
        await db.markMessageAsRead(messageId, userId);

        io!.emit("message:read", { messageId, userId, readAt: new Date() });
      } catch (error) {
        console.error("[Socket.IO] Error marking message as read:", error);
      }
    });

    // ========================================================================
    // TYPING INDICATORS
    // ========================================================================

    socket.on("user:typing", (data: any) => {
      const { chatId } = data;

      if (!typingUsers.has(chatId)) {
        typingUsers.set(chatId, new Set());
      }
      typingUsers.get(chatId)!.add(userId);

      io!.to(`chat:${chatId}`).emit("user:typing", {
        chatId,
        userId,
        username: user.username,
      });

      // Auto-clear after 3 seconds
      setTimeout(() => {
        const typingSet = typingUsers.get(chatId);
        if (typingSet) {
          typingSet.delete(userId);
          if (typingSet.size === 0) {
            typingUsers.delete(chatId);
          }
        }
        io!.to(`chat:${chatId}`).emit("user:stopped-typing", { userId });
      }, 3000);
    });

    socket.on("user:stopped-typing", (data: any) => {
      const { chatId } = data;
      const typingSet = typingUsers.get(chatId);
      if (typingSet) {
        typingSet.delete(userId);
      }

      io!.to(`chat:${chatId}`).emit("user:stopped-typing", { userId });
    });

    // ========================================================================
    // CHAT EVENTS
    // ========================================================================

    socket.on("chat:join", (data: any) => {
      const { chatId } = data;
      socket.join(`chat:${chatId}`);
      console.log(`[Socket.IO] User ${userId} joined chat ${chatId}`);
    });

    socket.on("chat:leave", (data: any) => {
      const { chatId } = data;
      socket.leave(`chat:${chatId}`);
      console.log(`[Socket.IO] User ${userId} left chat ${chatId}`);
    });

    // ========================================================================
    // CALL EVENTS
    // ========================================================================

    socket.on("call:initiate", async (data: any) => {
      try {
        const { recipientId, type } = data;

        // Create call record
        const callId = await db.createCall({
          initiatorId: userId,
          recipientId,
          type,
        });

        // Get recipient sockets
        const recipientSockets = userSockets.get(recipientId) || [];

        // Send call notification to recipient
        for (const recipientSocket of recipientSockets) {
          io!.to(recipientSocket.socketId).emit("call:incoming", {
            callId,
            initiatorId: userId,
            initiatorName: user.username,
            type,
          });
        }
      } catch (error) {
        console.error("[Socket.IO] Error initiating call:", error);
      }
    });

    socket.on("call:accept", async (data: any) => {
      try {
        const { callId } = data;
        await db.updateCallStatus(callId, "accepted");

        io!.emit("call:accepted", { callId, acceptedBy: userId });
      } catch (error) {
        console.error("[Socket.IO] Error accepting call:", error);
      }
    });

    socket.on("call:reject", async (data: any) => {
      try {
        const { callId } = data;
        await db.updateCallStatus(callId, "rejected");

        io!.emit("call:rejected", { callId, rejectedBy: userId });
      } catch (error) {
        console.error("[Socket.IO] Error rejecting call:", error);
      }
    });

    socket.on("call:end", async (data: any) => {
      try {
        const { callId, duration } = data;
        await db.updateCallStatus(callId, "ended", duration);

        io!.emit("call:ended", { callId, duration });
      } catch (error) {
        console.error("[Socket.IO] Error ending call:", error);
      }
    });

    // ========================================================================
    // PRESENCE EVENTS
    // ========================================================================

    socket.on("presence:update", (data: any) => {
      const { status } = data;
      io!.emit("user:presence", { userId, status });
    });

    // ========================================================================
    // NOTIFICATION EVENTS
    // ========================================================================

    socket.on("notification:create", async (data: any) => {
      try {
        const { recipientId, type, title, content } = data;

        // Create notification
        await db.createNotification({
          userId: recipientId,
          type,
          title,
          content,
        });

        // Send to recipient
        const recipientSockets = userSockets.get(recipientId) || [];
        for (const recipientSocket of recipientSockets) {
          io!.to(recipientSocket.socketId).emit("notification:new", {
            type,
            title,
            content,
          });
        }
      } catch (error) {
        console.error("[Socket.IO] Error creating notification:", error);
      }
    });

    // ========================================================================
    // DISCONNECT HANDLER
    // ========================================================================

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] User ${userId} disconnected: ${socket.id}`);

      // Remove user socket
      const userSocketList = userSockets.get(userId);
      if (userSocketList) {
        const index = userSocketList.findIndex((s) => s.socketId === socket.id);
        if (index > -1) {
          userSocketList.splice(index, 1);
        }

        // If no more sockets, mark as offline
        if (userSocketList.length === 0) {
          userSockets.delete(userId);
          db.updateUser(userId, { isOnline: false });
          io!.emit("user:offline", { userId });
        }
      }
    });
  });

  return io;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

export function getUserSockets(userId: number): UserSocket[] {
  return userSockets.get(userId) || [];
}

export function isUserOnline(userId: number): boolean {
  return userSockets.has(userId) && userSockets.get(userId)!.length > 0;
}

export function broadcastToChat(chatId: number, event: string, data: any): void {
  if (io) {
    io.to(`chat:${chatId}`).emit(event, data);
  }
}

export function sendToUser(userId: number, event: string, data: any): void {
  if (io) {
    const sockets = userSockets.get(userId) || [];
    for (const socket of sockets) {
      io.to(socket.socketId).emit(event, data);
    }
  }
}
