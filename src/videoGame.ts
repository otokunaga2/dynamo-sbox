import * as AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB({
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
  region: "ap-northeast-1",
  endpoint: "http://localhost:8000",
});
const documentClient = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
  region: "ap-northeast-1",
  endpoint: "http://localhost:8000",
});

export async function createTable() {
  // 作成するテーブルの情報
  const params: AWS.DynamoDB.CreateTableInput = {
    TableName: "Games", // テーブル名
    BillingMode: "PAY_PER_REQUEST", // 課金方法
    KeySchema: [
      { AttributeName: "Hardware", KeyType: "HASH" }, // パーティションキー
      { AttributeName: "GameId", KeyType: "RANGE" }, // ソートキー
    ],
    AttributeDefinitions: [
      { AttributeName: "Hardware", AttributeType: "S" }, // 文字列属性
      { AttributeName: "GameId", AttributeType: "S" }, // 文字列属性
      { AttributeName: "approvalStatus", AttributeType: "S" }, // 文字列属性
      { AttributeName: "companyName", AttributeType: "S" }, // 文字列属性
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "statusIndex",
        KeySchema: [
          { AttributeName: "approvalStatus", KeyType: "HASH" }, // GSI のハッシュキーを指定してください
          { AttributeName: "companyName", KeyType: "RANGE" },
          // 他のキーも必要に応じて追加してください
        ],
        Projection: {
          ProjectionType: "ALL", // GSI の投影タイプを指定してください（例: ALL、KEYS_ONLY、INCLUDE）
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5, // GSI の読み取りキャパシティユニットを指定してください
          WriteCapacityUnits: 5, // GSI の書き込みキャパシティユニットを指定してください
        },
      },
    ],
  };

  try {
    const result = await dynamoDb.createTable(params).promise();
    // テーブルの作成に成功したら、ARN 情報を取得してみる
    console.log(result.TableDescription?.TableArn);
  } catch (err) {
    console.error(err);
  }
}
export async function deleteTable() {
  const params: AWS.DynamoDB.DeleteTableInput = {
    TableName: "Games", // テーブル名
  };
  await dynamoDb.deleteTable(params).promise();
}

export async function documentClient_get() {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: "Games",
    Key: {
      Hardware: "SFC",
      GameId: "1995-SuperMarioWorld",
    },
  };

  try {
    const result = await documentClient.get(params).promise();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function documentClient_insert() {
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "Games",
    Item: {
      Hardware: "SFC2",
      GameId: "1995-SuperMarioWorld",
      approvalStatus: "active",
    },
    ReturnValues: "ALL_OLD",
  };

  try {
    const result = await documentClient.put(params).promise();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function insertMockData() {
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "Games",
    Item: {
      Hardware: "SFC2",
      GameId: "1995-SuperMarioWorld",
      approvalStatus: "inactive",
      savedTimeStamp: "2024-02-18T09:10:48.717Z",
    },
    ReturnValues: "ALL_OLD",
  };

  const params2: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "Games",
    Item: {
      Hardware: "SFC2",
      GameId: "1999-SuperMarioWorld",
      approvalStatus: "inactive",
      savedTimeStamp: new Date().toISOString(),
    },
    ReturnValues: "ALL_OLD",
  };

  try {
    const result = await documentClient.put(params).promise();
    //console.log(result);

    const result2 = await documentClient.put(params2).promise();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}
class DynamoUtilClient {
  constructor() {}
}
export async function filterByStatus(status: string) {
  const params2: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: "Games",
    FilterExpression: "#approvalStatus=:approvalStatus",
    // KeyConditionExpression: "GameId = :gameId",
    ExpressionAttributeValues: {
      ":approvalStatus": status,
    },
    ExpressionAttributeNames: {
      "#approvalStatus": "approvalStatus",
    },
  };

  // const params2: AWS.DynamoDB.DocumentClient.QueryInput = {
  // 	TableName: 'Games',
  // 	FilterExpression: "#approvalStatus=:approvalStatus",
  // 	KeyConditionExpression: "GameId = :gameId",
  // 	ExpressionAttributeValues:{
  // 		":approvalStatus": status,
  // 		":gameId": gameId,
  // 	},ExpressionAttributeNames:{
  // 		'#approvalStatus': 'approvalStatus'
  // 	}
  // };

  try {
    const result2 = await documentClient.scan(params2).promise();
    if (result2 === undefined || result2.Count === 0) {
      return null;
    } else {
      return result2.Items;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// export async function documentClient_query() {
// 	const params: AWS.DynamoDB.DocumentClient.QueryInput = {
// 		TableName: 'Games',
// 		KeyConditionExpression: 'approvalStatus=:gameId',
// 		IndexName: 'statusIndex', // 作成したGSI名
// 		Limit: 1,
// 		ScanIndexForward: false, // true = ascending, false = descending
// 		ExpressionAttributeValues: { ':gameId': 'active' }
// 	};
// 	try {
// 		const result = await documentClient.query(params).promise();
// 		console.log(result);
// 		return result
// 	} catch (err) {
// 		console.error(err);
// 	}
// }
export async function insertMockCopmanyData() {
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "Games",
    Item: {
      Hardware: "SFC3",
      GameId: "2000-SuperMarioWorld",
      approvalStatus: "inactive",
      savedTimeStamp: "2024-02-18T09:10:48.717Z",
      companyName: "512345",
    },
    ReturnValues: "ALL_OLD",
  };

  const params2: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "Games",
    Item: {
      Hardware: "SFC3",
      GameId: "2000-SuperMarioWorld",
      approvalStatus: "inactive",
      savedTimeStamp: new Date().toISOString(),
      companyName: "512345",
    },
    ReturnValues: "ALL_OLD",
  };

  try {
    const result = await documentClient.put(params).promise();
    //console.log(result);

    const result2 = await documentClient.put(params2).promise();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function documentClient_query() {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "Games",
    KeyConditionExpression: "approvalStatus=:gameId",
    IndexName: "statusIndex", // 作成したGSI名
    Limit: 1,
    ScanIndexForward: false, // true = ascending, false = descending
    ExpressionAttributeValues: { ":gameId": "active" },
  };
  try {
    const result = await documentClient.query(params).promise();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}
export async function updateWrapper(hardware: string, gameId: string) {
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: "Games",
    Key: {
      Hardware: hardware,
      GameId: gameId,
    },
    // KeyConditionExpression: '#GameId = :gameId, #Hardware = :hardware',
    UpdateExpression: "set newColumn1 = :val1, #a = :val2",
    ExpressionAttributeNames: {
      "#a": "Maker",
    },
    ExpressionAttributeValues: {
      ":val1": "AAA",
      ":val2": "BBB",
    },
    ReturnValues: "ALL_NEW", // ALL_NEW すべて更新後の値を返す
  };
  try {
    const result = await documentClient.update(params).promise();
    if (result === undefined) {
      return null;
    }
    return result.Attributes;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function filterAndUpateItems(hardware: string, gameId: string) {
  console.log(gameId);
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "Games",
    Limit: 1,
    KeyConditionExpression: "#hw = :hardware AND #gameId = :gameId",
    ExpressionAttributeNames: {
      "#hw": "Hardware", // GSIの作成時に指定したキー名を設定
      "#gameId": "GameId",
    },
    ScanIndexForward: true, // true = ascending, false = descending,
    ExpressionAttributeValues: { ":hardware": hardware, ":gameId": gameId },
  };
  const result = await documentClient.query(params).promise();

  if (result.Items === undefined || result.Count === 0) {
    return null;
  }
  console.log(result);
  return await updateWrapper(
    result.Items[0]["Hardware"],
    result.Items[0]["GameId"]
  );
}
export async function searchWithHashKey(hashkey: any) {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "Games",
    Limit: 1,
    KeyConditionExpression: "#hw = :hardware",
    ExpressionAttributeNames: {
      "#hw": "Hardware", // GSIの作成時に指定したキー名を設定
    },
    ScanIndexForward: false, // true = ascending, false = descending
    ExpressionAttributeValues: { ":hardware": hashkey },
  };
  try {
    const result = await documentClient.query(params).promise();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}
async function documentClient_batchWrite2() {
  const params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      Games: [
        {
          PutRequest: {
            Item: {
              Hardware: "FC",
              GameId: "1984-lode-runner",
              Title: "Lode Runner",
              Players: 1,
              Genre: "ACT",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              Hardware: "FC",
              GameId: "1985-exed-exes",
              Title: "Exed Exes",
              Players: 1,
              Genre: "STG",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              Hardware: "FC",
              GameId: "1984-lode-runner",
              Title: "Lode Runner",
              Players: 1,
              Genre: "ACT",
            },
          },
        },
      ],
    },
  };

  try {
    const result = await documentClient.batchWrite(params).promise();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
export async function queryInActiveStatus() {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "Games",
    KeyConditionExpression: "#approvalStatus=:gameStatus",
    ExpressionAttributeNames: {
      "#approvalStatus": "approvalStatus", // GSIの作成時に指定したキー名を設定
    },
    IndexName: "statusIndex", // 作成したGSI名
    Limit: 2,
    ScanIndexForward: false, // true = ascending, false = descending
    ExpressionAttributeValues: { ":gameStatus": "inactive" },
  };
  try {
    const result = await documentClient.query(params).promise();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function documentClient_batchWrite() {
  const params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      Games: [
        {
          PutRequest: {
            Item: {
              Hardware: "FC",
              GameId: "1984-lode-runner",
              Title: "Lode Runner",
              Players: 1,
              Genre: "ACT",
              SavedTimeStamp: new Date().getTime(),
            },
          },
        },
        {
          PutRequest: {
            Item: {
              Hardware: "FC",
              GameId: "1985-exed-exes",
              Title: "Exed Exes",
              Players: 1,
              Genre: "STG",
              SavedTimeStamp: new Date().getTime(),
            },
          },
        },
        {
          DeleteRequest: {
            Key: { Hardware: "SFC", GameId: "1990-SuperMarioWorld" },
          },
        },
      ],
    },
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
    TableName: "Games",
    // 更新するアイテムを特定するプライマリーキー属性
    Key: {
      Hardware: { S: "SFC" },
      GameId: { S: "1990-SuperMarioWorld" },
    },
    // 属性値の更新方法を下記 3 プロパティで設定
    UpdateExpression: "set Title = :x, #a = :y",
    ExpressionAttributeNames: {
      "#a": "Maker",
    },
    ExpressionAttributeValues: {
      ":x": { S: "Mario 4" },
      ":y": { S: "Nintendo" },
    },
    // 更新後の内容を戻り値で知りたいとき（ALL_OLD なら更新前の値が返される）
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDb.updateItem(params).promise();
    return result;
    //console.log(result);
  } catch (err) {
    console.error(err);
  }
}

export async function updateItem2() {
  const params: AWS.DynamoDB.UpdateItemInput = {
    TableName: "Games",
    // 更新するアイテムを特定するプライマリーキー属性
    Key: {
      Hardware: { S: "SFC2" },
      GameId: { S: "1995-SuperMarioWorld" },
    },
    //  Hardware: 'SFC2',
    //  savedTimeStamp: '2024-02-18T09:10:48.717Z',
    //  GameId: '1995-SuperMarioWorld'
    // 属性値の更新方法を下記 3 プロパティで設定
    UpdateExpression: "set Title = :x, #a = :y",
    ExpressionAttributeNames: {
      "#a": "approvalStatus",
    },
    ExpressionAttributeValues: {
      ":x": { S: "SuperMario" },
      ":y": { S: "active" },
    },
    // 更新後の内容を戻り値で知りたいとき（ALL_OLD なら更新前の値が返される）
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDb.updateItem(params).promise();
    return result;
    //console.log(result);
  } catch (err) {
    console.error(err);
  }
}

export async function updateBatch() {
  const params = {
    TableName: "Games",
    IndexName: "statusIndex",
    KeyConditionExpression:
      "#approvalStatus = :approvalStatus AND #companyName = :indexValue",
    ExpressionAttributeNames: {
      "#companyName": "companyName",
      "#approvalStatus": "approvalStatus",
    },
    ExpressionAttributeValues: {
      ":indexValue": { S: "512345" },
      ":approvalStatus": { S: "active" },
    },
  };
  const result = await dynamoDb.query(params).promise();
  return result;
}
// 深い比較を行う関数
export function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
