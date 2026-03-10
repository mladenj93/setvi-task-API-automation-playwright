/**
 * Parser for RFQ API response structure
 * API returns: { result: { matchedItems: [{ matchedInternalProducts: [...] }] } }
 */

export interface ParsedProduct {
  name?: string;
  similarityScore: number;
  percentage?: number;
}

export function getProductsFromResponse(
  body: Record<string, unknown>,
): ParsedProduct[] {
  const result = body.result as Record<string, unknown> | undefined;
  if (!result) return [];

  const matchedItems = result.matchedItems as
    | Array<Record<string, unknown>>
    | undefined;
  if (!Array.isArray(matchedItems)) return [];

  const products: ParsedProduct[] = [];
  for (const item of matchedItems) {
    const internal = item.matchedInternalProducts as
      | Array<Record<string, unknown>>
      | undefined;
    if (!Array.isArray(internal)) continue;

    for (const p of internal) {
      const percentage = (p.percentage as number) ?? 0;
      products.push({
        name: (p.name as string) ?? (p.productName as string),
        similarityScore: percentage / 100,
        percentage,
      });
    }
  }
  return products;
}

/** Returns count of top-level matched items (for topK assertion) */
export function getMatchedItemsCount(body: Record<string, unknown>): number {
  const result = body.result as Record<string, unknown> | undefined;
  if (!result) return 0;
  const matchedItems = result.matchedItems as unknown[] | undefined;
  return Array.isArray(matchedItems) ? matchedItems.length : 0;
}
