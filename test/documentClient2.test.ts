import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { Movie, Info } from "../src/movie";
import {
  deleteTable,
  createTable,
  filterByStatus,
  filterAndUpateItems,
  documentClient_get,
  documentClient_batchWrite,
  deepEqual,
  updateItem,
  documentClient_query,
  documentClient_insert,
  queryInActiveStatus,
  insertMockData,
  updateItem2,
  insertMockCopmanyData,
  updateBatch,
  searchWithHashKey,
} from "../src/videoGame";

const dynamodb = new DocumentClient({
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
  region: "ap-northeast-1",
  endpoint: "http://localhost:8000",
});
beforeAll(async () => {
  await createTable();
	await insertMockCopmanyData()
});
afterAll(async () => {
  await deleteTable();
});
test("write items", async () => {
  const result = await documentClient_insert();
  //expect(result.GameId).toBe('1990-SuperMarioWorld')
});

test("update items", async () => {
  const result = await filterAndUpateItems('SFC3', '2000-SuperMarioWorld' );
  // console.log(`Update target items ${result}`);
  expect(result).not.toBe(null);
  
});

test("test filter argument", async () => {
  try {
    const result = await filterByStatus("inactive");
    expect(result).not.toBe(undefined);
  } catch (error) {
    expect(error).toBe(undefined);
  }
});

test("query item", async () => {
  await documentClient_batchWrite();
  const result = await documentClient_query();
  expect(result?.Items?.length).toBe(0);
});

test("update item", async () => {
  const updatedItem = await updateItem();
  expect(updatedItem?.Attributes?.Maker.S).toBe("Nintendo");
});

test("update item as active", async () => {
  const updatedItem = await updateItem2();
  expect(updatedItem?.Attributes?.approvalStatus.S).toBe("active");
});

test("batch queue item", async () => {
  await documentClient_batchWrite();
  const result = await documentClient_get();
  const empty = {};
  const isEmpty = deepEqual(result, empty);
  expect(isEmpty).toBeTruthy();
});

test("batch update item", async () => {
  await insertMockCopmanyData();
  await updateBatch();
  const searchList = await searchWithHashKey("SF3");
  expect(searchList?.Items?.length).toBe(0);
});
