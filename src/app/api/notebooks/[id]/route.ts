import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notebook from "@/models/Notebook";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/notebooks/[id]">) {
  try {
    const { id } = await ctx.params;
    await dbConnect();
    const notebook = await Notebook.findById(id);
    if (!notebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
    }
    return NextResponse.json(notebook);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notebook" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/notebooks/[id]">) {
  try {
    const { id } = await ctx.params;
    await dbConnect();
    const body = await req.json();
    const notebook = await Notebook.findByIdAndUpdate(id, body, { new: true });
    if (!notebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
    }
    return NextResponse.json(notebook);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notebook" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/notebooks/[id]">) {
  try {
    const { id } = await ctx.params;
    await dbConnect();
    const notebook = await Notebook.findByIdAndDelete(id);
    if (!notebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Notebook deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete notebook" }, { status: 500 });
  }
}
