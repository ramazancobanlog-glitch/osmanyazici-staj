import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notebook from "@/models/Notebook";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const notebook = await Notebook.findById(id);
    if (!notebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
    }
    return NextResponse.json(notebook);
  } catch (error: any) {
    console.error("GET /api/notebooks/[id] ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch notebook", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const notebook = await Notebook.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!notebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
    }
    return NextResponse.json(notebook);
  } catch (error: any) {
    console.error("PUT /api/notebooks/[id] ERROR:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: "Validation Error", details: messages.join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update notebook", details: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const notebook = await Notebook.findByIdAndDelete(id);
    if (!notebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Notebook deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/notebooks/[id] ERROR:", error);
    return NextResponse.json({ error: "Failed to delete notebook", details: error.message }, { status: 500 });
  }
}
