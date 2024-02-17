import AWS from 'aws-sdk';
import {
	DeleteItemInput,
	GetItemInput,
	PutItemInput,
	QueryInput,
	UpdateItemInput,
} from 'aws-sdk/clients/dynamodb';

const dynamodb = new AWS.DynamoDB({
	credentials: {
		accessKeyId: 'fakeMyKeyId',
		secretAccessKey: 'fakeSecretAccessKey',
	},
	region: 'ap-northeast-1',
	endpoint: 'http://localhost:8000',
});

test('write items', async () => {
	const params1: PutItemInput = {
		TableName: 'Music',
		Item: {
			Artist: {
				S: 'No One You Know',
			},
			SongTitle: {
				S: 'Call Me Today',
			},
			AlbumTitle: {
				S: 'Somewhat Famous',
			},
			Awards: {
				N: '1',
			},
		},
	};

	await dynamodb.putItem(params1).promise();

	const params2: PutItemInput = {
		TableName: 'Music',
		Item: {
			Artist: {
				S: 'Acme Band',
			},
			SongTitle: {
				S: 'Happy Day',
			},
			AlbumTitle: {
				S: 'Songs About Life',
			},
			Awards: {
				N: '10',
			},
		},
	};

	await dynamodb.putItem(params2).promise();
});

test('read item, fail', async () => {
	const params: GetItemInput = {
		TableName: 'Music',
		Key: {
			Artist: {
				S: 'Acme Band',
			},
		},
		ConsistentRead: true,
	};

	try {
		const item = await dynamodb.getItem(params).promise();
		throw new Error('fail');
	} catch (e) {
		const error = e as Error;
		expect(error.message).toBe(
			'The number of conditions on the keys is invalid'
		);
	}
});

test('read item, success', async () => {
	const params: GetItemInput = {
		TableName: 'Music',
		Key: {
			Artist: {
				S: 'Acme Band',
			},
			SongTitle: {
				S: 'Happy Day',
			},
		},
		ConsistentRead: true,
	};

	try {
		const item = await dynamodb.getItem(params).promise();
		console.log(`result ${JSON.stringify(item)}`)
		if (item == {}) {
			throw new Error()
		}
	} catch (e) {
		const error = e as Error;
		throw e
	}
});

test('update item', async () => {
	const params: UpdateItemInput = {
		TableName: 'Music',
		Key: {
			Artist: {
				S: 'Acme Band',
			},
			SongTitle: {
				S: 'Happy Day'
			}
		},
		ExpressionAttributeNames: {
			'#AT': 'AlbumTitle'
		},
		ExpressionAttributeValues: {
			':NEWVAL': {
				S: 'Updated Album Title'
			},
		},
		UpdateExpression: 'SET #AT = :NEWVAL',
		ReturnValues: 'ALL_NEW'
	}
	const returnValue = await dynamodb.updateItem(params).promise();
	expect(returnValue.Attributes).toEqual({
		Artist: {
			S: 'Acme Band',
		},
		SongTitle: {
			S: 'Happy Day',
		},
		AlbumTitle: {
			S: 'Updated Album Title',
		},
		Awards: {
			N: '10',
		},
	});

});
