import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("supervision_session");
  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("supervision_session");
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  try {
    const user = JSON.parse(session.value);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
