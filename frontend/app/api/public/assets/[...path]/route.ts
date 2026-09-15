import { NextResponse } from "next/server";

const backendInternalUrl = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8081";

async function proxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const assetPath = path.map(encodeURIComponent).join("/");
  const upstream = await fetch(`${backendInternalUrl}/api/public/assets/${assetPath}`, {
    headers: { accept: request.headers.get("accept") ?? "*/*" },
    cache: "no-store",
  });

  if (!upstream.ok) return new NextResponse(null, { status: upstream.status });

  const headers = new Headers();
  for (const name of ["content-type", "content-length", "cache-control", "etag", "last-modified"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new NextResponse(upstream.body, { status: 200, headers });
}

export const GET = proxy;
export const HEAD = proxy;
