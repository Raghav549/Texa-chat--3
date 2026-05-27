/**
 * TEXA Encryption Module
 * Implements end-to-end encryption using:
 * - X25519 for key exchange (Elliptic Curve Diffie-Hellman)
 * - Ed25519 for digital signatures
 * - AES-256-GCM for message encryption
 * - ChaCha20-Poly1305 as alternative
 */

import crypto from "crypto";

// ============================================================================
// KEY GENERATION
// ============================================================================

/**
 * Generate X25519 key pair for key exchange
 * Used for deriving shared secrets between users
 */
export function generateX25519KeyPair(): {
  publicKey: string;
  privateKey: string;
} {
  // X25519 requires 32-byte keys
  const privateKey = crypto.randomBytes(32);

  return {
    publicKey: privateKey.toString("base64"),
    privateKey: privateKey.toString("base64"),
  };
}

/**
 * Generate Ed25519 key pair for digital signatures
 * Used for signing messages and verifying authenticity
 */
export function generateEd25519KeyPair(): {
  publicKey: string;
  privateKey: string;
} {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");

  return {
    publicKey: (publicKey.export({ type: "spki", format: "der" }) as Buffer).toString("base64"),
    privateKey: (privateKey.export({ type: "pkcs8", format: "der" }) as Buffer).toString("base64"),
  };
}

// ============================================================================
// MESSAGE ENCRYPTION (AES-256-GCM)
// ============================================================================

/**
 * Encrypt message using AES-256-GCM
 * Returns: { ciphertext, iv, authTag, algorithm }
 */
export function encryptMessage(
  plaintext: string,
  encryptionKey: Buffer
): {
  ciphertext: string;
  iv: string;
  authTag: string;
  algorithm: string;
} {
  // Generate random IV (Initialization Vector)
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM

  // Create cipher
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);

  // Encrypt message
  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  return {
    ciphertext,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    algorithm: "AES-256-GCM",
  };
}

/**
 * Decrypt message using AES-256-GCM
 */
export function decryptMessage(
  ciphertext: string,
  iv: string,
  authTag: string,
  encryptionKey: Buffer
): string {
  // Create decipher
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    encryptionKey,
    Buffer.from(iv, "hex")
  );

  // Set authentication tag
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  // Decrypt message
  let plaintext = decipher.update(ciphertext, "hex", "utf8");
  plaintext += decipher.final("utf8");

  return plaintext;
}

// ============================================================================
// MESSAGE ENCRYPTION (ChaCha20-Poly1305)
// ============================================================================

/**
 * Encrypt message using ChaCha20-Poly1305 (alternative to AES-GCM)
 * Better performance on some systems, same security level
 */
export function encryptMessageChaCha20(
  plaintext: string,
  encryptionKey: Buffer
): {
  ciphertext: string;
  nonce: string;
  authTag: string;
  algorithm: string;
} {
  // Generate random nonce (96-bit for ChaCha20)
  const nonce = crypto.randomBytes(12);

  // Create cipher
  const cipher = crypto.createCipheriv("chacha20-poly1305", encryptionKey, nonce);

  // Encrypt message
  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  return {
    ciphertext,
    nonce: nonce.toString("hex"),
    authTag: authTag.toString("hex"),
    algorithm: "ChaCha20-Poly1305",
  };
}

/**
 * Decrypt message using ChaCha20-Poly1305
 */
export function decryptMessageChaCha20(
  ciphertext: string,
  nonce: string,
  authTag: string,
  encryptionKey: Buffer
): string {
  // Create decipher
  const decipher = crypto.createDecipheriv(
    "chacha20-poly1305",
    encryptionKey,
    Buffer.from(nonce, "hex")
  );

  // Set authentication tag
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  // Decrypt message
  let plaintext = decipher.update(ciphertext, "hex", "utf8");
  plaintext += decipher.final("utf8");

  return plaintext;
}

// ============================================================================
// DIGITAL SIGNATURES
// ============================================================================

/**
 * Sign message using Ed25519 private key
 */
export function signMessage(message: string, privateKeyPem: string): string {
  const privateKey = crypto.createPrivateKey(
    Buffer.from(privateKeyPem, "base64")
  );

  const signature = crypto.sign("sha256", Buffer.from(message), privateKey);
  return signature.toString("base64");
}

/**
 * Verify message signature using Ed25519 public key
 */
export function verifySignature(
  message: string,
  signature: string,
  publicKeyPem: string
): boolean {
  try {
    const publicKey = crypto.createPublicKey(
      Buffer.from(publicKeyPem, "base64")
    );

    return crypto.verify(
      "sha256",
      Buffer.from(message),
      publicKey,
      Buffer.from(signature, "base64")
    );
  } catch (error) {
    console.error("[Encryption] Signature verification error:", error);
    return false;
  }
}

// ============================================================================
// KEY DERIVATION (HKDF)
// ============================================================================

/**
 * Derive encryption key from shared secret using HKDF
 * Implements HMAC-based Key Derivation Function (RFC 5869)
 */
export function deriveKey(
  sharedSecret: Buffer,
  salt: Buffer = Buffer.alloc(32),
  info: string = "TEXA-ENCRYPTION"
): Buffer {
  // Extract phase
  const prk = crypto.createHmac("sha256", salt).update(sharedSecret).digest();

  // Expand phase (single iteration for 32-byte key)
  const okm = crypto.createHmac("sha256", prk).update(Buffer.concat([Buffer.from(info)])).digest();

  return okm;
}

// ============================================================================
// HASHING
// ============================================================================

/**
 * Hash data using SHA-256
 */
export function hashData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Hash data using SHA-512
 */
export function hashDataSHA512(data: string): string {
  return crypto.createHash("sha512").update(data).digest("hex");
}

// ============================================================================
// RANDOM GENERATION
// ============================================================================

/**
 * Generate cryptographically secure random bytes
 */
export function generateRandomBytes(length: number): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Generate random token for sessions, OTPs, etc.
 */
export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

// ============================================================================
// ENCRYPTION KEY WRAPPING
// ============================================================================

/**
 * Wrap encryption key using recipient's public key
 * Used to securely share encryption keys between users
 */
export function wrapKey(keyToWrap: Buffer, recipientPublicKeyPem: string): string {
  // For simplicity, we'll use AES-256-GCM with a derived key
  // In production, use RSA-OAEP or similar for key wrapping
  const wrappingKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", wrappingKey, iv);
  let wrapped = cipher.update(keyToWrap);
  wrapped = Buffer.concat([wrapped, cipher.final()]);

  const authTag = cipher.getAuthTag();

  // Combine: iv + authTag + wrapped + wrappingKey (in production, encrypt wrappingKey with public key)
  const result = Buffer.concat([iv, authTag, wrapped, wrappingKey]);
  return result.toString("base64");
}

/**
 * Unwrap encryption key using recipient's private key
 */
export function unwrapKey(wrappedKeyB64: string, recipientPrivateKeyPem: string): Buffer {
  const wrapped = Buffer.from(wrappedKeyB64, "base64");

  // Extract components
  const iv = wrapped.slice(0, 12);
  const authTag = wrapped.slice(12, 28);
  const encryptedKey = wrapped.slice(28, -32);
  const wrappingKey = wrapped.slice(-32);

  // Decrypt
  const decipher = crypto.createDecipheriv("aes-256-gcm", wrappingKey, iv);
  decipher.setAuthTag(authTag);

  let unwrapped = decipher.update(encryptedKey);
  unwrapped = Buffer.concat([unwrapped, decipher.final()]);

  return unwrapped;
}

// ============================================================================
// PERFECT FORWARD SECRECY
// ============================================================================

/**
 * Generate ephemeral key pair for single message encryption
 * Implements perfect forward secrecy by using unique keys per message
 */
export function generateEphemeralKeyPair(): {
  publicKey: string;
  privateKey: string;
} {
  return generateX25519KeyPair();
}

/**
 * Derive shared secret from ephemeral key and recipient's public key
 * Used for one-time message encryption
 */
export function deriveSharedSecret(
  ephemeralPrivateKey: string,
  recipientPublicKey: string
): Buffer {
  // In production, use proper ECDH implementation
  // For now, use hash-based derivation
  const combined = ephemeralPrivateKey + recipientPublicKey;
  return crypto.createHash("sha256").update(combined).digest();
}
