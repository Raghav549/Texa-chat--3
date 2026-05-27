/**
 * SDK Compatibility Layer
 * Adapts the existing Manus OAuth SDK to work with TEXA's phone-based authentication
 * This allows TEXA to use the framework's session management while maintaining phone OTP auth
 */

import * as db from "./db";
import type { User } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

/**
 * Extended User type that includes TEXA-specific fields
 * while maintaining compatibility with the OAuth framework
 */
export type TEXAUser = User & {
  taskUid?: string;
  isCron?: boolean;
};

/**
 * Get user by session token (for TEXA phone-based sessions)
 * This replaces the OAuth getUserByOpenId pattern
 */
export async function getUserBySessionToken(token: string): Promise<User | null> {
  const session = await db.getSessionByToken(token);

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    await db.deleteSession(session.id);
    return null;
  }

  // Get user from database
  const user = await db.getUserById(session.userId);
  return user || null;
}

/**
 * Validate TEXA session from request headers
 * Looks for Authorization: Bearer <token> header
 */
export async function validateTEXASession(req: any): Promise<User | null> {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    return await getUserBySessionToken(token);
  } catch (error) {
    console.error("[TEXA Auth] Session validation error:", error);
    return null;
  }
}

/**
 * Create a TEXA user object compatible with the framework
 * Used for cron tasks and internal operations
 */
export function buildTEXAInternalUser(userId: number): TEXAUser {
  const now = new Date();
  return {
    id: userId,
    phone: "internal",
    username: "internal-service",
    email: null,
    avatar: null,
    bio: null,
    status: null,
    role: "user",
    publicKey: "",
    publicKeyVersion: 1,
    encryptedPrivateKey: null,
    signingPublicKey: "",
    signingPrivateKeyEncrypted: null,
    isPhoneVerified: true,
    isBiometricEnabled: false,
    is2FAEnabled: false,
    hideOnlineStatus: false,
    hideReadReceipts: false,
    hideProfilePhoto: false,
    lastSeen: now,
    isOnline: false,
    createdAt: now,
    updatedAt: now,
    isCron: true,
  };
}

/**
 * Logout user by invalidating all sessions
 */
export async function logoutUser(userId: number): Promise<void> {
  const sessions = await db.getUserSessions(userId);
  for (const session of sessions) {
    await db.deleteSession(session.id);
  }
}

/**
 * Logout from specific device
 */
export async function logoutFromDevice(sessionId: number): Promise<void> {
  await db.deleteSession(sessionId);
}
