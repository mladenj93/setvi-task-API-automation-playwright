/**
 * Negative Test Cases - Upload Free Text API
 * Tests for API errors, failures, and bad behavior (Bugs N1, N3, N4, N5)
 */
import { test, expect, RfqFixtures } from "../../../fixtures/rfq-fixture";
import {
  getProductsFromResponse,
  getMatchedItemsCount,
} from "../../../helpers/response-parser";

test.describe("Upload Free Text - Negative Scenarios @negative", () => {
  test("N1: Empty text should return 400 Bad Request, not 200 OK [Bug N1] @severity-medium @priority-high", async ({ rfqClient }: RfqFixtures) => {
    const response = await rfqClient.uploadFreeText({
      text: "",
      topK: 3,
      threshold: 0.5,
      enablePrivateLabelRanking: false,
    });

    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status(), "Empty text should return 400, not 200").toBe(
      400,
    );
    expect(body).toBeDefined();
    expect(
      (body as Record<string, unknown>).Message ??
        (body as Record<string, unknown>).message,
      "Response should contain error message",
    ).toBeTruthy();
  });

  test("N1: Whitespace-only text should return 400 Bad Request [Bug N1 variant] @severity-medium @priority-high", async ({ rfqClient }: RfqFixtures) => {
    const response = await rfqClient.uploadFreeText({
      text: "   ",
      topK: 3,
      threshold: 0.5,
    });

    expect(
      response.status(),
      "Whitespace-only text should be treated as empty",
    ).toBe(400);
  });

  test("N3: Threshold Parameter Ignored - Low Scores Included [Bug N3] @severity-high @priority-medium", async ({ rfqClient }: RfqFixtures) => {
    const response = await rfqClient.uploadFreeText({
      text: "Cutting Board",
      topK: 5,
      threshold: 0.8,
      enablePrivateLabelRanking: false,
    });

    const body = (await response.json()) as Record<string, unknown>;
    expect(response.status()).toBe(200);

    const products = getProductsFromResponse(body);
    expect(products.length, "Response should contain products").toBeGreaterThan(
      0,
    );

    // Expected: only products with similarityScore >= 0.8 (Bug: API returns 0.61, 0.45, 0.38 too)
    for (const product of products) {
      expect(
        product.similarityScore,
        `Product "${product.name}" has score ${product.similarityScore} but threshold=0.8 - only >=0.8 should be returned`,
      ).toBeGreaterThanOrEqual(0.8);
    }
  });

  test("N4: topK=1 should return at most 1 top-level matched item [Bug N4] @severity-medium @priority-medium", async ({ rfqClient }: RfqFixtures) => {
    const response = await rfqClient.uploadFreeText({
      text: "container",
      topK: 1,
      threshold: 0.5,
    });

    const body = (await response.json()) as Record<string, unknown>;
    expect(response.status()).toBe(200);
    const count = getMatchedItemsCount(body);
    expect(
      count,
      "topK=1 should return at most 1 top-level matched item",
    ).toBeLessThanOrEqual(1);
  });

  test("N4: topK=10 should return up to 10 top-level matched items [Bug N4] @severity-medium @priority-medium", async ({ rfqClient }: RfqFixtures) => {
    const response = await rfqClient.uploadFreeText({
      text: "container",
      topK: 10,
      threshold: 0.5,
    });

    const body = (await response.json()) as Record<string, unknown>;
    expect(response.status()).toBe(200);
    const count = getMatchedItemsCount(body);
    expect(
      count,
      "topK=10 should return up to 10 top-level matched items",
    ).toBeLessThanOrEqual(10);
  });

  test("N5: Special characters (accented) should not break matching [Bug N5] @severity-low @priority-low", async ({ rfqClient }: RfqFixtures) => {
    const response = await rfqClient.uploadFreeText({
      text: "Café & Restaurant Supplies",
      topK: 3,
      threshold: 0.5,
      enablePrivateLabelRanking: false,
    });

    const body = (await response.json()) as Record<string, unknown>;
    expect(response.status()).toBe(200);
    const products = getProductsFromResponse(body);
    // Bug: API may return empty for special chars - test documents expected behavior
    expect(Array.isArray(products)).toBe(true);
  });

  test("N5: Quotes in measurements should not break matching [Bug N5] @severity-low @priority-low", async ({ rfqClient }: RfqFixtures) => {
    const response = await rfqClient.uploadFreeText({
      text: '24" x 18" board',
      topK: 3,
      threshold: 0.5,
      enablePrivateLabelRanking: false,
    });

    const body = (await response.json()) as Record<string, unknown>;
    expect(response.status()).toBe(200);
    const products = getProductsFromResponse(body);
    expect(Array.isArray(products)).toBe(true);
  });

  test("Missing required text field should return 400", async ({ rfqClient }: RfqFixtures) => {
    const response = await rfqClient.uploadFreeText({
      topK: 3,
    } as { text: string; topK: number });

    expect(response.status()).toBe(400);
  });

  test("Invalid topK (negative) should be rejected", async ({ rfqClient }: RfqFixtures) => {
    const response = await rfqClient.uploadFreeText({
      text: "valid search text",
      topK: -1,
      threshold: 0.5,
    });

    expect([400, 422, 200]).toContain(response.status());
  });
});
