import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { Movie, Info } from '../src/movie';
import { createTable, documentClient_get, documentClient_batchWrite, deepEqual, updateItem, documentClient_query, documentClient_insert, queryInActiveStatus, insertMockData, updateItem2, insertMockCopmanyData, updateBatch, searchWithHashKey } from '../src/videoGame';

const dynamodb = new DocumentClient({
	credentials: {
		accessKeyId: 'fakeMyKeyId',
		secretAccessKey: 'fakeSecretAccessKey',
	},
	region: 'ap-northeast-1',
	endpoint: 'http://localhost:8000',
});
beforeAll(async () => {
	await createTable()
});
test('write items', async () => {
	const result = await documentClient_insert()
	//expect(result.GameId).toBe('1990-SuperMarioWorld')
})

test('read item', async () => {
	//	const result = await documentClient_get()
})


test('query item', async () => {
	await documentClient_batchWrite()
	const result = await documentClient_query()
	expect(result.Items.length).toBe(0)
})

test('query inactive item', async () => {
	const result = await queryInActiveStatus()
	expect(result.Items.length).not.toBe(0)
})

test('query inactive item with batch', async () => {
	await insertMockData()
	const result = await queryInActiveStatus()
	expect(result.Items.length).toBeGreaterThan(1)
})
test('update item', async () => {
	const updatedItem = await updateItem()
	expect(updatedItem.Attributes.Maker.S).toBe('Nintendo')
})

test('update item as active', async () => {
	const updatedItem = await updateItem2()
	expect(updatedItem.Attributes.approvalStatus.S).toBe('active')
})

test('delete item', async () => {
})

test('batch queue item', async () => {
	await documentClient_batchWrite()
	const result = await documentClient_get()
	const empty = {}
	const isEmpty = deepEqual(result, empty)
	expect(isEmpty).toBeTruthy()
})

test('batch update item', async () => {
	await insertMockCopmanyData()
	await updateBatch()
	const searchList = await searchWithHashKey('SF3')
	expect(searchList.Items.length).toBe(0)
})




