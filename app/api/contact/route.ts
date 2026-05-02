import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const db = await connectDB();

  await db.collection("messages").insertOne({
    ...body,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const db = await connectDB();

  const messages = await db
    .collection("messages")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(messages);
}
