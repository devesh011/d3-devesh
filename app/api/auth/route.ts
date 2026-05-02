import { createHash } from "crypto";

function generateToken(username: string, type: "access" | "refresh") {
  const expires =
    type === "access"
      ? Date.now() + 12 * 60 * 60 * 1000 // 12 hours
      : Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days refresh

  const data = `${username}:${expires}:${type}:${process.env.ADMIN_SECRET}`;
  const hash = createHash("sha256").update(data).digest("hex");
  return `${expires}:${type}:${hash}`;
}

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const accessToken = generateToken(username, "access");
    const refreshToken = generateToken(username, "refresh");
    return Response.json({ accessToken, refreshToken });
  }

  return Response.json({ error: "Invalid credentials" }, { status: 401 });
}
