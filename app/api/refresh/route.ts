import { createHash } from "crypto";

function verifyToken(token: string): boolean {
  try {
    const parts = token.split(":");
    if (parts.length < 3) return false;
    const [expires, type, hash] = parts;
    if (type !== "refresh") return false;
    if (Date.now() > parseInt(expires)) return false;
    const data = `${process.env.ADMIN_USERNAME}:${expires}:${type}:${process.env.ADMIN_SECRET}`;
    const expectedHash = createHash("sha256").update(data).digest("hex");
    return hash === expectedHash;
  } catch {
    return false;
  }
}

function generateAccessToken() {
  const expires = Date.now() + 12 * 60 * 60 * 1000;
  const data = `${process.env.ADMIN_USERNAME}:${expires}:access:${process.env.ADMIN_SECRET}`;
  const hash = createHash("sha256").update(data).digest("hex");
  return `${expires}:access:${hash}`;
}

export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  if (verifyToken(refreshToken)) {
    const accessToken = generateAccessToken();
    return Response.json({ accessToken });
  }

  return Response.json({ error: "Invalid refresh token" }, { status: 401 });
}
