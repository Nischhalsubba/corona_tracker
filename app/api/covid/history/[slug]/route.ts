import { NextResponse } from "next/server";

import { getCountryHistory } from "@/lib/data/covid";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;
  return NextResponse.json(await getCountryHistory(slug));
}
