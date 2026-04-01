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
    const body = await req.json();
    const { title, description, content } = body;

    // Manual quick validation before hitting DB
    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Validation Error", details: "Title, description, and content are required." },
        { status: 400 }
      );
    }

    await dbConnect();
    const notebook = await Notebook.create(body);
    return NextResponse.json(notebook, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/notebooks ERROR:", error);
    
    // Check if it's a Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: "Validation Error", details: messages.join(", ") }, { status: 400 });
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while creating notebook";
    return NextResponse.json({ error: "Failed to create notebook", details: errorMessage }, { status: 500 });
  }
}
