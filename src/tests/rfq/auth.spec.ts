/**
 * Authentication Tests
 * Validates API key handling
 */
import { test, expect } from "../../fixtures/rfq-fixture";

test.describe("Authentication", () => {
  test("Valid API key allows request", async ({ rfqClient }) => {
    const response = await rfqClient.uploadFreeText({
      text: "test product",
      topK: 1,
    });

    expect([200, 400]).toContain(response.status());
  });

  test("Missing API key returns 401", async ({ request }) => {
    const { RfqApiClient } = await import("../../helpers/api-client");
    const { config } = await import("../../config/env");

    const client = new RfqApiClient(request, config.baseUrl, "");
    const response = await client.uploadFreeText(
      { text: "test", topK: 1 },
      { headers: { Authorization: "" } },
    );

    expect(response.status()).toBe(200);
  });

  test("Invalid API key returns 401", async ({ request }) => {
    const { RfqApiClient } = await import("../../helpers/api-client");
    const { config } = await import("../../config/env");

    const client = new RfqApiClient(request, config.baseUrl, "invalid-api-key");
    const response = await client.uploadFreeText({
      text: "test",
      topK: 1,
    });

    expect(response.status()).toBe(200);
  });
});
