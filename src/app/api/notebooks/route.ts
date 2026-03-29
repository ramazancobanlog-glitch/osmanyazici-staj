import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notebook from "@/models/Notebook";

export async function GET() {
  try {
    await dbConnect();
    const notebooks = await Notebook.find({}).sort({ historyYear: 1 });
    return NextResponse.json(notebooks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notebooks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const notebook = await Notebook.create(body);
    return NextResponse.json(notebook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create notebook" }, { status: 500 });
  }
}
