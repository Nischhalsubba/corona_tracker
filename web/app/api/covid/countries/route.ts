import { NextResponse } from "next/server";

import { getCountries } from "@/lib/data/covid";

export async function GET() {
  return NextResponse.json(await getCountries());
}
