import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (!category) {
    return NextResponse.json({ error: 'Invalid category parameter' }, { status: 400 });
  }

  const API_HOST = process.env.API_HOST!;
  const API_KEY = process.env.API_KEY!;

  const res = await fetch(`${API_HOST}/getcontents?page=1&size=20&type=movie,tv&category=${category}`, {
    headers: {
      'Content-Type': 'application/json',
      'token': API_KEY,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json({ error }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}