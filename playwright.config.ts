import { defineConfig, devices } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const BASE_URL = process.env.BASE_URL || "https://intelligence-dev.setvi.com";
const API_KEY = process.env.API_KEY || "a7a91f48-0371-4680-b69d-7928d9c1c9ad";

export default defineConfig({
  testDir: "./src/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Authorization: `ApiKey ${API_KEY}`,
      "Content-Type": "application/json",
    },
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "rfq-api",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/rfq/**/*.spec.ts",
    },
  ],
  outputDir: "test-results/",
  timeout: 90000,
  expect: {
    timeout: 10000,
  },
});
