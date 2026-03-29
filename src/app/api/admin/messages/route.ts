import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_auth")?.value === "true";
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const messages = await Message.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Mesajlar yüklenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_auth")?.value === "true";
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await dbConnect();
    await Message.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Mesaj silinemedi." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_auth")?.value === "true";
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, isRead } = await req.json();
    await dbConnect();
    await Message.findByIdAndUpdate(id, { isRead });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Mesaj güncellenemedi." }, { status: 500 });
  }
}
