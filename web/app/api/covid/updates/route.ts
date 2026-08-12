import { NextResponse } from "next/server";

import { getReportingUpdates } from "@/lib/data/covid";

export async function GET() {
  return NextResponse.json(await getReportingUpdates());
}
