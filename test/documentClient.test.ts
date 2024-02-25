import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { Movie, Info } from '../src/movie';

const dynamodb = new DocumentClient({
	credentials: {
		accessKeyId: 'local',
		secretAccessKey: 'local',
	},
	region: 'ap-northeast-1',
	endpoint: 'http://localhost:8000',
});


test('write items', async () => {
	const movie = new Movie(
		2015,
		'The Big New Movie',
		new Info('nothing happens at all', 0)
	)
	const params: DocumentClient.PutItemInput = {
		TableName: 'Movies',
		Item: movie
	}
	return await dynamodb.put(params).promise();
})

test('read item', async () => {
	const params: DocumentClient.GetItemInput = {
		TableName: 'Movies',
		Key: {
			year: 2015,
			title: 'The Big New Movie',
		},
		ConsistentRead: true,
	}

	const value = await dynamodb.get(params).promise();
	const movie = value.Item as Movie;
	expect(movie.year).toBe(2015);
	expect(movie.title).toBe('The Big New Movie');
	expect(movie.info.rating).toBe(0);
})

test('update item', async () => {
	const params: DocumentClient.UpdateItemInput = {
		TableName: 'Movies',
		Key: {
			year: 2015,
			title: 'The Big New Movie',
		},
		ExpressionAttributeValues: {
			':r': 5.5,
			':p': 'Everything happens all at once.',
			':a': ['Larry', 'Moe', 'Curly'],
		},
		UpdateExpression: 'set info.rating = :r, info.plot = :p, info.actors = :a',
		ReturnValues: 'UPDATED_NEW',
	};
	const value = await dynamodb.update(params).promise();
	if (value.Attributes) {
		const info = value.Attributes['info'] as Info;
		expect(info.plot).toBe('Everything happens all at once.');
		expect(info.rating).toBe(5.5);
		expect(info.actors).toEqual(['Larry', 'Moe', 'Curly']);
	} else {
		throw new Error('fail');
	}
})

test('delete item', async () => {
	const params: DocumentClient.DeleteItemInput = {
		TableName: 'Movies',
		Key: {
			year: 2015,
			title: 'The Big New Movie'
		},
	};
	const value = await dynamodb.delete(params).promise();
	expect(value).not.toBeNull();
	const readParams: DocumentClient.GetItemInput = {
		TableName: 'Movies',
		Key: {
			year: 2015,
			title: 'The Big New Movie'
		},
		ConsistentRead: true,
	}
	const readValue = await dynamodb.get(readParams).promise();
	expect(readValue.Item).toBeUndefined()
})

test('batch item', async () => {

	const params: DocumentClient.PutItemInput = {
		TableName: 'Movies',
		Item: {
			year: 2015,
			title: 'The Big New Movie',
		}
	}

	const value = await dynamodb.put(params).promise();
	const params2: DocumentClient.UpdateItemInput = {
		TableName: 'Movies',
		Key: {
			year: 2015,
			title: 'The Big New Movie',
		},
		ExpressionAttributeValues: {
			':r': 5.5,
			':p': 'Everything happens all at once.',
			':a': ['Larry', 'Moe', 'Curly'],
		},
		UpdateExpression: 'set info.rating = :r, info.plot = :p, info.actors = :a',
		ReturnValues: 'UPDATED_NEW',
	};
	const value2 = await dynamodb.update(params2).promise();
	if (value2.Attributes) {
		const info = value2.Attributes['info'] as Info;
		expect(info.plot).toBe('Everything happens all at once.');
		expect(info.rating).toBe(5.5);
		expect(info.actors).toEqual(['Larry', 'Moe', 'Curly']);
	} else {
		throw new Error('fail');
	}
})
