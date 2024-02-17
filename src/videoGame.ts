import * as AWS from 'aws-sdk';
const dynamoDb = new AWS.DynamoDB({
	credentials: {
		accessKeyId: 'fakeMyKeyId',
		secretAccessKey: 'fakeSecretAccessKey',
	},
	region: 'ap-northeast-1',
	endpoint: 'http://localhost:8000',
});
const documentClient = new AWS.DynamoDB.DocumentClient({
	credentials: {
		accessKeyId: 'fakeMyKeyId',
		secretAccessKey: 'fakeSecretAccessKey',
	},
	region: 'ap-northeast-1',
	endpoint: 'http://localhost:8000',
});

export async function createTable() {
	// 作成するテーブルの情報
	const params: AWS.DynamoDB.CreateTableInput = {
		TableName: 'Games',  // テーブル名
		BillingMode: 'PAY_PER_REQUEST',  // 課金方法
		KeySchema: [
			{ AttributeName: 'Hardware', KeyType: 'HASH' },  // パーティションキー
			{ AttributeName: 'GameId', KeyType: 'RANGE' },  // ソートキー
		],
		AttributeDefinitions: [
			{ AttributeName: 'Hardware', AttributeType: 'S' },  // 文字列属性
			{ AttributeName: 'GameId', AttributeType: 'S' },  // 文字列属性
		],
		StreamSpecification: {
			StreamEnabled: false,
		},
	};

	try {
		const result = await dynamoDb.createTable(params).promise();
		// テーブルの作成に成功したら、ARN 情報を取得してみる
		console.log(result.TableDescription?.TableArn);
	} catch (err) {
		console.error(err);
	}
}

export async function documentClient_get() {
	const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
		TableName: 'Games',
		Key: {
			Hardware: 'SFC',
			GameId: '1990-SuperMarioWorld'
		}
	};

	try {
		const result = await documentClient.get(params).promise();
		console.log(result);
		return result
	} catch (err) {
		console.error(err);
	}
}


export async function documentClient_batchWrite() {
  const params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      'Games': [
        {
          PutRequest: { Item: { Hardware: 'FC', GameId: '1984-lode-runner', Title: 'Lode Runner', Players: 1, Genre: 'ACT' }}
        },
        {
          PutRequest: { Item: { Hardware: 'FC', GameId: '1985-exed-exes', Title: 'Exed Exes', Players: 1, Genre: 'STG' }}
        },
        {
          DeleteRequest: { Key: { Hardware: 'SFC', GameId: '1990-SuperMarioWorld' }}
        }
      ]
    }
  };

  try {
    const result = await documentClient.batchWrite(params).promise();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

export async function updateItem() {
  const params: AWS.DynamoDB.UpdateItemInput = {
    TableName: 'Games',
    // 更新するアイテムを特定するプライマリーキー属性
    Key: {
      Hardware: { S: 'SFC' },
      GameId: { S: '1990-SuperMarioWorld' }
    },
    // 属性値の更新方法を下記 3 プロパティで設定
    UpdateExpression: 'set Title = :x, #a = :y',
    ExpressionAttributeNames: {
      '#a': 'Maker',
    },
    ExpressionAttributeValues: {
      ':x': { S: 'Mario 4' },
      ':y': { S: 'Nintendo' }
    },
    // 更新後の内容を戻り値で知りたいとき（ALL_OLD なら更新前の値が返される）
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDb.updateItem(params).promise();
	return result
    //console.log(result);
  } catch (err) {
    console.error(err);
  }
}
// 深い比較を行う関数
export function deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}
