# Setvi RFQ API Automation

Playwright API automation framework for Setvi AI-powered RFQ (Request for Quote) endpoints. Built with TypeScript following senior QA automation engineering practices.

## Overview

| Item            | Value                                                             |
| --------------- | ----------------------------------------------------------------- |
| **Module**      | AI-powered RFQ                                                    |
| **Environment** | Development                                                       |
| **Base URL**    | https://intelligence-dev.setvi.com                                |
| **Endpoints**   | `POST /api/rfq/upload-free-text`, `POST /api/rfq/upload-url-html` |

## Project Structure

```
setvi-task-API-automation-playwright/
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── fixtures/
│   │   └── rfq-fixture.ts
│   ├── helpers/
│   │   └── api-client.ts
│   ├── tests/
│   │   └── rfq/
│   │       ├── auth.spec.ts
│   │       ├── upload-free-text/
│   │       │   ├── negative.spec.ts
│   │       │   └── positive.spec.ts
│   │       └── upload-url-html/
│   │           ├── negative.spec.ts
│   │           └── positive.spec.ts
│   └── types/
│       └── rfq.ts
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your API key (default Dev key is pre-configured in `playwright.config.ts`):

```
BASE_URL=https://intelligence-dev.setvi.com
API_KEY=a7a91f48-0371-4680-b69d-7928d9c1c9ad
```

### 3. Run tests

```bash
# Run all RFQ tests
npm test

# Run with UI mode
npm run test:ui

# Run specific endpoint tests
npm run test:upload-freetext
npm run test:upload-url

# Run by tag
npm run test:negative
npm run test:positive

# Generate HTML report
npm test && npm run test:report
```

## Test Coverage

### Negative Scenarios (@negative)

| Bug ID | Title                                 | Severity | Priority | Spec                                |
| ------ | ------------------------------------- | -------- | -------- | ----------------------------------- |
| **N1** | Empty text returns 200 instead of 400 | Medium   | High     | `upload-free-text/negative.spec.ts` |
| **N2** | Invalid URL causes 500 instead of 400 | High     | High     | `upload-url-html/negative.spec.ts`  |
| **N3** | Threshold parameter ignored           | High     | Medium   | `upload-free-text/negative.spec.ts` |
| **N4** | topK always returns 5                 | Medium   | Medium   | `upload-free-text/negative.spec.ts` |
| **N5** | Special characters break matching     | Low      | Low      | `upload-free-text/negative.spec.ts` |

### Positive Scenarios (@positive)

| Bug ID | Title                                    | Severity | Priority | Spec                                |
| ------ | ---------------------------------------- | -------- | -------- | ----------------------------------- |
| **P1** | Private label ranking flag has no effect | Medium   | Medium   | `upload-free-text/positive.spec.ts` |
| **P2** | High similarity for irrelevant product   | High     | High     | `upload-free-text/positive.spec.ts` |
| **P3** | URL extracts wrong content               | High     | High     | `upload-url-html/positive.spec.ts`  |
| **P4** | Similarity score inconsistent            | Medium   | Medium   | `upload-free-text/positive.spec.ts` |
| **P5** | Missing product fields                   | Low      | Low      | `upload-free-text/positive.spec.ts` |

### Run by Severity / Priority

```bash
npm run test:high          # Severity High only (N2, N3, P2, P3)
npm run test:medium        # Severity Medium (N1, N4, P1, P4)
npm run test:low           # Severity Low (N5, P5)
npm run test:priority-high # Priority High (N1, N2, P2, P3)
```

### Authentication

- Valid API key allows request
- Missing API key returns 401
- Invalid API key returns 401

## API Reference

### POST /api/rfq/upload-free-text

**Request body:**

```json
{
  "text": "Cutting Board 24x18",
  "topK": 5,
  "threshold": 0.5,
  "enablePrivateLabelRanking": false
}
```

### POST /api/rfq/upload-url-html

**Request body:**

```json
{
  "url": "https://example.com/product",
  "topK": 5,
  "threshold": 0.5
}
```

## Expected Test Results

These tests document **expected API behavior**. When run against the current Development API, some tests may **fail** due to known bugs (N1–N5, P1–P5). A failing test indicates a bug that should be fixed.

| Test             | Expected                  | Current API (if bug exists)  |
| ---------------- | ------------------------- | ---------------------------- |
| N1 Empty text    | 400                       | 200 ✓ (bug)                  |
| N2 Invalid URL   | 400                       | 500 ✓ (bug)                  |
| N3 Threshold     | Only scores ≥ threshold   | Returns lower scores ✓ (bug) |
| N4 topK          | Respect topK value        | Always 5 ✓ (bug)             |
| P1 Private label | Different order when true | Same order ✓ (bug)           |

## Troubleshooting

| Error                         | Cause                      | Action                                                    |
| ----------------------------- | -------------------------- | --------------------------------------------------------- |
| **401 Unauthorized**          | Invalid or missing API key | Check `API_KEY` in `.env` or `playwright.config.ts`       |
| **403 Forbidden**             | URL blocked                | Use a different test URL                                  |
| **404 Not Found**             | Wrong base URL             | Verify `BASE_URL` is `https://intelligence-dev.setvi.com` |
| **500 Internal Server Error** | Invalid URL (Bug N2)       | Use valid URL format                                      |
| **Slow response**             | API or network             | Increase timeout in `playwright.config.ts`                |

## Postman Collection

Original Postman collection:
https://extemporeapp.postman.co/workspace/Setvi~972c6d88-649e-4ca2-a20a-aad69bda0460/collection/13094513-2b149a72-ec87-4c49-878efc55f7bb5927

## Scripts

| Script                         | Description                     |
| ------------------------------ | ------------------------------- |
| `npm test`                     | Run all tests                   |
| `npm run test:ui`              | Run with Playwright UI          |
| `npm run test:debug`           | Run in debug mode               |
| `npm run test:upload-freetext` | Run upload-free-text tests only |
| `npm run test:upload-url`      | Run upload-url-html tests only  |
| `npm run test:negative`        | Run @negative tests             |
| `npm run test:positive`        | Run @positive tests             |
| `npm run test:high`            | Run @severity-high tests        |
| `npm run test:medium`          | Run @severity-medium tests      |
| `npm run test:low`             | Run @severity-low tests         |
| `npm run test:priority-high`   | Run @priority-high tests        |
| `npm run test:report`          | Open last HTML report           |

## License

MIT
