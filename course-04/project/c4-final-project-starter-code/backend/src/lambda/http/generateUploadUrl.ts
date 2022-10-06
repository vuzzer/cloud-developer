import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger} from '../../utils/logger'

const logger = createLogger('createTodo');
const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(" Processing event for generating signed url", event)
    const todoId = event.pathParameters.todoId;
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId = getUserId(event);

    const validTodoId = await todoExists(userId, todoId);

    if (!validTodoId) {
      logger.error("No todo found with id ", todoId);
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          error: 'Todo item does not exist'
        })
      };
    }
  
    let url = await createAttachmentPresignedUrl(userId, todoId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url
      })
    };

  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

  async function todoExists(userId: string, todoId: string) {
    const result = await docClient
      .get({
        TableName: todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      })
      .promise();
  
    return !!result.Item;
  }
