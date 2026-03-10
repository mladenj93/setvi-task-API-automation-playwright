/**
 * Request and Response types for RFQ API endpoints
 */

export interface UploadFreeTextRequest {
  text: string;
  topK?: number;
  threshold?: number;
  enablePrivateLabelRanking?: boolean;
}

export interface UploadUrlHtmlRequest {
  url: string;
  topK?: number;
  threshold?: number;
}

export interface MatchedProduct {
  name?: string;
  description?: string;
  similarityScore?: number;
  price?: number;
  sku?: string;
  vendor?: string;
  inStock?: boolean;
  imageUrl?: string;
  [key: string]: unknown;
}

/** Actual API structure: result.matchedItems[].matchedInternalProducts */
export interface RfqSuccessResponse {
  status?: string;
  statusId?: string;
  result?: {
    matchedItems?: Array<{
      matchedInternalProducts?: Array<{
        name?: string;
        percentage?: number;
        [key: string]: unknown;
      }>;
    }>;
  };
  /** @deprecated use result.matchedItems - kept for backward compat */
  matchedProducts?: MatchedProduct[];
}

export interface RfqErrorResponse {
  error?: string;
  message?: string;
  title?: string;
  status?: number;
  traceId?: string;
}
