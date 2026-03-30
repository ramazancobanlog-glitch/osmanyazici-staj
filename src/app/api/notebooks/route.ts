import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notebook from "@/models/Notebook";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const notebooks = await Notebook.find({}).sort({ historyYear: 1 });
    return NextResponse.json(notebooks);
  } catch (error) {
    console.error("GET /api/notebooks ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch notebooks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log("POST /api/notebooks: Received request");

    // Parse and validate the request body
    const body = await req.json();
    console.log("POST /api/notebooks: Request body:", body);

    const { title, content } = body;
    if (!title || !content) {
      console.error("POST /api/notebooks: Validation error - Missing title or content");
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    // Connect to the database
    console.log("POST /api/notebooks: Connecting to database...");
    await dbConnect();

    // Create the notebook
    const notebook = await Notebook.create(body);
    console.log("POST /api/notebooks: Notebook created:", notebook);

    return NextResponse.json(notebook, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/notebooks ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : error?.message || "Unknown error";
    return NextResponse.json({ error: "Failed to create notebook", details: errorMessage }, { status: 500 });
  }
}
