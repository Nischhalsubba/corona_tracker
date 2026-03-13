import { NextResponse } from "next/server";

import { getCountrySnapshot } from "@/lib/data/covid";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;
  const data = await getCountrySnapshot(slug);
  return NextResponse.json(data, { status: data ? 200 : 404 });
}
