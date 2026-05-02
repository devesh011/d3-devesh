import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* -GET -*/
export async function GET() {
  const db = await connectDB();

  const projects = await db
    .collection("projects")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(projects);
}

/* -POST -*/
export async function POST(req: Request) {
  const body = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, _id, ...cleanBody } = body;

  const db = await connectDB();

  const newProject = {
    ...cleanBody,
    createdAt: new Date(),
  };

  const result = await db.collection("projects").insertOne(newProject);

  return Response.json({ insertedId: result.insertedId });
}

/* -PUT -*/
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, id, createdAt, ...updateData } = body;

    const projectId = _id || id;

    if (!projectId) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    const db = await connectDB();

    const result = await db
      .collection("projects")
      .updateOne({ _id: new ObjectId(projectId) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("PUT ERROR:", err);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

/* -DELETE -*/
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const db = await connectDB();

  await db.collection("projects").deleteOne({
    _id: new ObjectId(id as string),
  });

  return Response.json({ success: true });
}
