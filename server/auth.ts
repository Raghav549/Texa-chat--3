import * as db from "./db";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

/**
 * TEXA Authentication Service
 * Handles phone OTP, user registration, session management, and encryption keys
 */

// ============================================================================
// OTP MANAGEMENT
// ============================================================================

export async function sendPhoneOTP(phone: string): Promise<{ otp: string; expiresAt: Date }> {
  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP in database
  await db.createPhoneOTP(phone, otp, expiresAt);

  // TODO: Send OTP via SMS service (Twilio, AWS SNS, etc.)
  console.log(`[OTP] Phone: ${phone}, OTP: ${otp}`);

  return { otp, expiresAt };
}

export async function verifyPhoneOTP(phone: string, otp: string): Promise<boolean> {
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

  // Delete OTP after verification
  await db.deletePhoneOTP(phone);

  return true;
}

// ============================================================================
// USER REGISTRATION & LOGIN
// ============================================================================

export async function registerOrLoginUser(phone: string) {
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
      role: "user",
    });

    user = await db.getUserById(userId);
  } else {
    // Update last seen
    await db.updateUser(user.id, { lastSeen: new Date(), isOnline: true });
  }

  return user!;
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export async function createSession(userId: number, deviceId: string, deviceName?: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const sessionId = await db.createSession({
    userId,
    deviceId,
    deviceName,
    token,
    expiresAt,
  });

  return { sessionId, token, expiresAt };
}

export async function validateSession(token: string) {
  const session = await db.getSessionByToken(token);

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired session",
    });
  }

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    await db.deleteSession(session.id);
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Session expired",
    });
  }

  return session;
}

export async function invalidateSession(sessionId: number) {
  await db.deleteSession(sessionId);
}

export async function invalidateAllUserSessions(userId: number) {
  const sessions = await db.getUserSessions(userId);
  for (const session of sessions) {
    await db.deleteSession(session.id);
  }
}

// ============================================================================
// DEVICE MANAGEMENT
// ============================================================================

export async function recordLoginAlert(
  userId: number,
  deviceName: string,
  location?: string,
  ipAddress?: string
) {
  await db.createLoginAlert({
    userId,
    deviceName,
    location,
    ipAddress,
  });
}

export async function markDeviceTrusted(sessionId: number) {
  // TODO: Update session to mark as trusted
}

// ============================================================================
// ENCRYPTION KEY MANAGEMENT
// ============================================================================

export async function generateEncryptionKeys() {
  // Generate X25519 key pair for key exchange
  const x25519PublicKey = crypto.randomBytes(32).toString("base64");
  const x25519PrivateKeyEncrypted = crypto.randomBytes(32).toString("base64");

  // Generate Ed25519 key pair for signatures
  const ed25519PublicKey = crypto.randomBytes(32).toString("base64");
  const ed25519PrivateKeyEncrypted = crypto.randomBytes(32).toString("base64");

  return {
    x25519: {
      publicKey: x25519PublicKey,
      privateKeyEncrypted: x25519PrivateKeyEncrypted,
    },
    ed25519: {
      publicKey: ed25519PublicKey,
      privateKeyEncrypted: ed25519PrivateKeyEncrypted,
    },
  };
}

export async function storeEncryptionKeys(userId: number, keys: any) {
  // Store X25519 keys
  await db.createEncryptionKey({
    userId,
    keyType: "x25519",
    publicKey: keys.x25519.publicKey,
    privateKeyEncrypted: keys.x25519.privateKeyEncrypted,
    keyVersion: 1,
    isActive: true,
  });

  // Store Ed25519 keys
  await db.createEncryptionKey({
    userId,
    keyType: "ed25519",
    publicKey: keys.ed25519.publicKey,
    privateKeyEncrypted: keys.ed25519.privateKeyEncrypted,
    keyVersion: 1,
    isActive: true,
  });
}

export async function getUserEncryptionKeys(userId: number) {
  const keys = await db.getUserEncryptionKeys(userId);
  return {
    x25519: keys.find((k) => k.keyType === "x25519"),
    ed25519: keys.find((k) => k.keyType === "ed25519"),
  };
}

// ============================================================================
// BIOMETRIC SETUP
// ============================================================================

export async function enableBiometric(userId: number) {
  await db.updateUser(userId, { isBiometricEnabled: true });
}

export async function disableBiometric(userId: number) {
  await db.updateUser(userId, { isBiometricEnabled: false });
}

// ============================================================================
// 2FA SETUP
// ============================================================================

export async function enable2FA(userId: number) {
  await db.updateUser(userId, { is2FAEnabled: true });
}

export async function disable2FA(userId: number) {
  await db.updateUser(userId, { is2FAEnabled: false });
}
