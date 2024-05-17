
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { collections } from '@wix/data';


const wixClient = createClient({
  modules: { collections },
  auth: ApiKeyStrategy({
    siteId: process.env.SITE_ID,
    apiKey: process.env.API_KEY
  })
});

export async function createDataCollection(collection) {
  const response = await wixClient.collections.createDataCollection(collection);
  return response;
}


export async function listDataCollections(options) {
  const response = await wixClient.collections.listDataCollections(options);
  return response;
}

export async function getDataCollection(dataCollectionId, options) {
  const response = await wixClient.collections.getDataCollection(dataCollectionId, options);
  return response;
}

export async function updateDataCollection(collection) {
  const response = await wixClient.collections.updateDataCollection(collection);
  return response;
}