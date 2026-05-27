import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import type { Express, Request, Response } from "express";
// TEXA: OAuth disabled - using phone-based auth instead
// import { getUserByOpenId, upsertUser } from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

// TEXA: OAuth disabled
async function syncUser(userInfo: any) {
  throw new Error("OAuth disabled for TEXA");
}

// TEXA: buildUserResponse stub
function buildUserResponse(user: any) {
  return {
    id: (user as any)?.id ?? null,
    openId: user?.openId ?? null,
    name: user?.name ?? null,
    email: user?.email ?? null,
    loginMethod: user?.loginMethod ?? null,
    lastSignedIn: (user?.lastSignedIn ?? new Date()).toISOString(),
  };
}

export function registerOAuthRoutes(app: Express) {
  // TEXA: OAuth disabled - using phone-based authentication
  console.log("[OAuth] Routes disabled for TEXA - using phone-based auth");

  // TEXA: All OAuth routes disabled
}
