import { NextResponse } from "next/server";

import { getProductBySlug } from "@/lib/get-product-by-slug";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { slug } = await context.params;
  const decoded = decodeURIComponent(slug);
  const product = await getProductBySlug(decoded);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
