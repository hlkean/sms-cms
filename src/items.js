
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { items } from '@wix/data';


const wixClient = createClient({
  modules: { items },
  auth: ApiKeyStrategy({
    siteId: process.env.SITE_ID,
    apiKey: process.env.API_KEY
  })
});

export async function saveDataItem(options) {
    const response = await wixClient.items.saveDataItem(options);
    return response;
}