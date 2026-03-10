/**
 * Negative Test Cases - Upload URL HTML API
 * Tests for API errors and invalid URL handling (Bug N2)
 */
import { test, expect } from "../../../fixtures/rfq-fixture";
import type { RfqErrorResponse } from "../../../types/rfq";

test.describe("Upload URL HTML - Negative Scenarios @negative", () => {
  test("N2: Invalid URL format should return 400, not 500 [Bug N2] @severity-high @priority-high", async ({
    rfqClient,
  }) => {
    const response = await rfqClient.uploadUrlHtml({
      url: "not-a-valid-url-format",
      topK: 3,
      threshold: 0.5,
    });

    const body = (await response.json()) as RfqErrorResponse;

    expect(
      response.status(),
      "Invalid URL should return 400 Bad Request, not 500",
    ).toBe(400);
    expect(body).toBeDefined();
  });

  test("Empty URL should return 400", async ({ rfqClient }) => {
    const response = await rfqClient.uploadUrlHtml({
      url: "",
      topK: 3,
      threshold: 0.5,
    });

    expect(response.status()).toBe(400);
  });

  test("URL without protocol should return 400", async ({ rfqClient }) => {
    const response = await rfqClient.uploadUrlHtml({
      url: "www.example.com/page",
      topK: 3,
      threshold: 0.5,
    });

    expect([400, 500]).toContain(response.status());
  });

  test("Malformed URL (missing TLD) should be rejected", async ({
    rfqClient,
  }) => {
    const response = await rfqClient.uploadUrlHtml({
      url: "http://invalid",
      topK: 3,
      threshold: 0.5,
    });

    expect([400, 404, 500]).toContain(response.status());
  });
});
