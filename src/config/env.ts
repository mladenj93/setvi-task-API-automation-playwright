import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const config = {
  baseUrl: process.env.BASE_URL || "https://intelligence-dev.setvi.com",
  apiKey: process.env.API_KEY || "a7a91f48-0371-4680-b69d-7928d9c1c9ad",
  defaultThreshold: 0.5,
  defaultTopK: 5,
} as const;
