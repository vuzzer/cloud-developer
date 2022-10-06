import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger} from '../../utils/logger'

const logger = createLogger('createTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.warn("Proccessing delete event on todo", event );
    const todoId = event.pathParameters.todoId;
    // TODO: Remove a TODO item by id
    const userId = getUserId(event);
    
    await deleteTodo(userId, todoId)
    
    return  {
      statusCode: 200,
      body: " "
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
