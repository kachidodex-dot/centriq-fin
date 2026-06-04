import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

// Derive a 32-byte key from the service role key (server-only).
function getKey(): Buffer {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_DB_URL || "";
  if (!secret) throw new Error("Missing server secret for token encryption");
  return createHash("sha256").update(`ryport:token:${secret}`).digest();
}

export function encryptToken(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64");
}

export function decryptToken(b64: string): string {
  const buf = Buffer.from(b64, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}