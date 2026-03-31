import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password === process.env.ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/"
      });
      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth");
  return NextResponse.json({ authenticated: authCookie?.value === "true" });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  return NextResponse.json({ message: "Logged out" });
}
