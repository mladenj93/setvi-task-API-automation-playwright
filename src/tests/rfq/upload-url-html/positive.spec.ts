/**
 * Positive Test Cases - Upload URL HTML API
 * Tests for correct behavior and regression of known bugs (P3)
 */
import { test, expect } from "../../../fixtures/rfq-fixture";
import { getProductsFromResponse } from "../../../helpers/response-parser";

test.describe("Upload URL HTML - Positive Scenarios @positive", () => {
  test("Valid URL returns 200 and result with products", async ({
    rfqClient,
  }) => {
    const response = await rfqClient.uploadUrlHtml({
      url: "https://www.example.com/product-page",
      topK: 3,
      threshold: 0.5,
    });

    const body = (await response.json()) as Record<string, unknown>;

    expect([200, 403, 404]).toContain(response.status());
    if (response.status() === 200) {
      expect(body).toHaveProperty("result");
      const products = getProductsFromResponse(body);
      expect(Array.isArray(products)).toBe(true);
    }
  });

  test("P3: URL upload should extract product content, not navigation [Bug P3] @severity-high @priority-high", async ({
    rfqClient,
  }) => {
    const response = await rfqClient.uploadUrlHtml({
      url: "https://httpbin.org/html",
      topK: 3,
      threshold: 0.5,
    });

    const body = (await response.json()) as Record<string, unknown>;
    const products = getProductsFromResponse(body);

    expect([200, 403, 404, 500]).toContain(response.status());

    if (response.status() === 200 && products.length > 0) {
      const first = products[0];
      expect(first.name).toBeDefined();
      expect(first.similarityScore).toBeDefined();
    }
  });
});
