import { test as base } from "@playwright/test";
import { RfqApiClient } from "../helpers/api-client";

export type RfqFixtures = {
  rfqClient: RfqApiClient;
};

export const test = base.extend<RfqFixtures>({
  rfqClient: async ({ request }, use) => {
    const client = new RfqApiClient(request);
    await use(client);
  },
});

export { expect } from "@playwright/test";
