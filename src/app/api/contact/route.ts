import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Eksik alanlar var!" }, { status: 400 });
    }

    const newMessage = await Message.create(body);
    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
  }
}
