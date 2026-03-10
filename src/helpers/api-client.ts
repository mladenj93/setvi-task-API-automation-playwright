import { APIRequestContext, APIResponse } from "@playwright/test";
import { config } from "../config/env";
import type { UploadFreeTextRequest, UploadUrlHtmlRequest } from "../types/rfq";

export class RfqApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string = config.baseUrl,
    private readonly apiKey: string = config.apiKey,
  ) {}

  private getHeaders(customHeaders?: Record<string, string | undefined>) {
    const base: Record<string, string> = {
      "Content-Type": "application/json",
      ...(this.apiKey ? { Authorization: `ApiKey ${this.apiKey}` } : {}),
    };
    const merged = { ...base, ...customHeaders };
    // Filter only undefined; keep '' to allow overriding project headers (e.g. for auth tests)
    return Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== undefined),
    ) as Record<string, string>;
  }

  async uploadFreeText(
    body: UploadFreeTextRequest,
    options?: { headers?: Record<string, string> },
  ): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/api/rfq/upload-free-text`, {
      headers: this.getHeaders(options?.headers),
      data: body,
      failOnStatusCode: false,
    });
  }

  async uploadUrlHtml(
    body: UploadUrlHtmlRequest,
    options?: { headers?: Record<string, string> },
  ): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/api/rfq/upload-url-html`, {
      headers: this.getHeaders(options?.headers),
      data: body,
      failOnStatusCode: false,
    });
  }
}
