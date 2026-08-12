import { NextResponse } from "next/server";

import { getGlobalSummary } from "@/lib/data/covid";

export async function GET() {
  return NextResponse.json(await getGlobalSummary());
}
