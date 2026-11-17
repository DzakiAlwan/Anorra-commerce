import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "anorra-session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type SessionPayload = {
  sub: string;
  email: string;
  role: "ADMIN";
  exp: number;
};

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET belum diatur (minimal 32 karakter acak).");
  }

  return secret;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function createSessionToken(input: { sub: string; email: string }): string {
  const payload: SessionPayload = {
    sub: input.sub,
    email: input.email,
    role: "ADMIN",
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };

  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");

  return `${data}.${sign(data)}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [data, signature] = token.split(".");

  if (!data || !signature) {
    return null;
  }

  const expected = Buffer.from(sign(data));
  const received = Buffer.from(signature);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const record = parsed as Record<string, unknown>;

    if (
      typeof record.sub !== "string" ||
      typeof record.email !== "string" ||
      record.role !== "ADMIN" ||
      typeof record.exp !== "number"
    ) {
      return null;
    }

    if (record.exp * 1000 <= Date.now()) {
      return null;
    }

    return {
      sub: record.sub,
      email: record.email,
      role: "ADMIN",
      exp: record.exp,
    };
  } catch {
    return null;
  }
}
