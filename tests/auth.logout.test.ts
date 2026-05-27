import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "../server/_core/context";

type CookieCall = {
  name: string;
  options: Record<string, unknown>;
};

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];
  
  const user: AuthenticatedUser = {
    id: 1,
    phone: "+1234567890",
    username: "sampleuser",
    email: "sample@example.com",
    avatar: null,
    bio: null,
    status: null,
    role: "user",
    publicKey: "sample-public-key",
    publicKeyVersion: 1,
    encryptedPrivateKey: null,
    signingPublicKey: "sample-signing-key",
    signingPrivateKeyEncrypted: null,
    isPhoneVerified: true,
    isBiometricEnabled: false,
    is2FAEnabled: false,
    hideOnlineStatus: false,
    hideReadReceipts: false,
    hideProfilePhoto: false,
    lastSeen: new Date(),
    isOnline: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  
  return { ctx, clearedCookies };
}

// TODO: Remove `.skip` below once you implement user authentication
describe.skip("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({
      maxAge: -1,
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });
  });
});
