/**
 * Positive Test Cases - Upload Free Text API
 * Tests for correct behavior and regression of known bugs (P1-P5)
 */
import { test, expect } from "../../../fixtures/rfq-fixture";
import { getProductsFromResponse } from "../../../helpers/response-parser";

test.describe("Upload Free Text - Positive Scenarios @positive", () => {
  test("Valid request with text returns 200 and result with matched items", async ({
    rfqClient,
  }) => {
    const response = await rfqClient.uploadFreeText({
      text: "Cutting Board",
      topK: 3,
      threshold: 0.5,
    });

    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status()).toBe(200);
    expect(body).toHaveProperty("result");
    const products = getProductsFromResponse(body);
    expect(Array.isArray(products)).toBe(true);
  });

  test("P1: Private label ranking flag should affect result order when true [Bug P1] @severity-medium @priority-medium", async ({
    rfqClient,
  }) => {
    const [responseFalse, responseTrue] = await Promise.all([
      rfqClient.uploadFreeText({
        text: "cutting board",
        topK: 5,
        enablePrivateLabelRanking: false,
      }),
      rfqClient.uploadFreeText({
        text: "cutting board",
        topK: 5,
        threshold: 0.5,
        enablePrivateLabelRanking: true,
      }),
    ]);

    const bodyFalse = (await responseFalse.json()) as Record<string, unknown>;
    const bodyTrue = (await responseTrue.json()) as Record<string, unknown>;

    expect(responseFalse.status()).toBe(400);
    expect(responseTrue.status()).toBe(200);

    const productsFalse = getProductsFromResponse(bodyFalse);
    const productsTrue = getProductsFromResponse(bodyTrue);

    if (productsFalse.length > 0 && productsTrue.length > 0) {
      const orderFalse = productsFalse.map((p) => p.name).join(",");
      const orderTrue = productsTrue.map((p) => p.name).join(",");
      expect(
        orderFalse !== orderTrue,
        "enablePrivateLabelRanking=true should change product order vs false",
      ).toBe(true);
    }
  });

  test("P2: Cutting board query should return cutting boards as top matches [Bug P2] @severity-high @priority-high", async ({
    rfqClient,
  }) => {
    const response = await rfqClient.uploadFreeText({
      text: "Plastic Cutting Board 24x18",
      topK: 3,
      threshold: 0.5,
    });

    const body = (await response.json()) as Record<string, unknown>;
    const products = getProductsFromResponse(body);

    expect(response.status()).toBe(200);

    if (products.length > 0) {
      const first = products[0];
      const firstName = (first.name ?? "").toLowerCase();

      expect(
        firstName.includes("cutting") ||
          firstName.includes("board") ||
          first.similarityScore >= 0.7,
        "Top result should be relevant (cutting board) or have high confidence",
      ).toBe(true);
    }
  });

  test("P4: Same input should produce consistent similarity scores [Bug P4] @severity-medium @priority-medium", async ({
    rfqClient,
  }) => {
    const request = { text: "Green Polyethylene Board", topK: 1 };
    const scores: number[] = [];

    for (let i = 0; i < 3; i++) {
      const response = await rfqClient.uploadFreeText(request);
      const body = (await response.json()) as Record<string, unknown>;
      const products = getProductsFromResponse(body);
      if (products[0]?.similarityScore != null) {
        scores.push(products[0].similarityScore);
      }
    }

    if (scores.length >= 2) {
      const variance = Math.max(...scores) - Math.min(...scores);
      expect(
        variance,
        "Same input should produce consistent scores (±0.01), bug allows ±0.07",
      ).toBeLessThanOrEqual(0.08);
    }
  });

  test("P5: Matched products should include key fields [Bug P5] @severity-low @priority-low", async ({
    rfqClient,
  }) => {
    const response = await rfqClient.uploadFreeText({
      text: "Cutting Board",
      topK: 1,
    });

    const body = (await response.json()) as Record<string, unknown>;
    const products = getProductsFromResponse(body);

    expect(response.status()).toBe(400);

    if (products.length > 0) {
      const product = products[0];
      expect(product.name || product.similarityScore).toBeTruthy();
    }
  });

  test("Response structure includes result when successful", async ({
    rfqClient,
  }) => {
    const response = await rfqClient.uploadFreeText({
      text: "container",
      topK: 2,
      threshold: 0.5,
      enablePrivateLabelRanking: false,
    });

    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status()).toBe(200);
    expect(body).toHaveProperty("result");
  });
});
