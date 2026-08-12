import { NextResponse } from "next/server";

import { getSourceCatalog } from "@/lib/data/covid";

export async function GET() {
  return NextResponse.json(await getSourceCatalog());
}
