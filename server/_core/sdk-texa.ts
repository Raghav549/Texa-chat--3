/**
 * TEXA SDK Compatibility Shim
 * Disables OAuth functionality and uses phone-based authentication instead
 * This replaces the default OAuth SDK for TEXA
 */

import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { validateTEXASession } from "../sdk-compat";

export type AuthenticatedUser = User & {
  taskUid?: string;
  isCron?: boolean;
};

class TEXASDKServer {
  /**
   * Authenticate request using TEXA phone-based session
   * Looks for Authorization: Bearer <token> header
   */
  async authenticateRequest(req: Request): Promise<AuthenticatedUser | null> {
    try {
      // Get authorization header
      const authHeader = req.headers?.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
      }

      const token = authHeader.substring(7); // Remove "Bearer " prefix

      // Validate session and get user
      const user = await validateTEXASession(req);

      if (!user) {
        return null;
      }

      // Update last seen
      await db.updateUser(user.id, { lastSeen: new Date() });

      return user as AuthenticatedUser;
    } catch (error) {
      console.error("[TEXA Auth] Authentication error:", error);
      return null;
    }
  }
}

export const sdk = new TEXASDKServer();
