import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { Movie, Info } from '../src/movie';
import { createTable, documentClient_get, documentClient_batchWrite, deepEqual, updateItem } from '../src/videoGame';

const dynamodb = new DocumentClient({
	credentials: {
		accessKeyId: 'fakeMyKeyId',
		secretAccessKey: 'fakeSecretAccessKey',
	},
	region: 'ap-northeast-1',
	endpoint: 'http://localhost:8000',
});

test('write items', async () => {
	//await createTable()
})

test('read item', async () => {
	const result = await documentClient_get()
	expect(result.Item).toBeUndefined()
})

test('update item', async () => {
	const updatedItem = await updateItem()
	expect(updatedItem.Attributes.Maker.S).toBe('Nintendo')
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


