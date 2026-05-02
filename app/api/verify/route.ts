import { createHash } from "crypto";

function verifyToken(token: string): boolean {
  try {
    const parts = token.split(":");
    if (parts.length < 3) return false;

    const [expires, type, hash] = parts;

    if (Date.now() > parseInt(expires)) return false;

    const data = `${process.env.ADMIN_USERNAME}:${expires}:${type}:${process.env.ADMIN_SECRET}`;
    const expectedHash = createHash("sha256").update(data).digest("hex");

    return hash === expectedHash;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const { token } = await req.json();

  if (verifyToken(token)) {
    return Response.json({ valid: true });
  }

  return Response.json({ valid: false }, { status: 401 });
}
