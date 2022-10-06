import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger} from '../../utils/logger'

const logger = createLogger('createTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
    const userId = getUserId(event);
    const createTodoRequest: CreateTodoRequest = JSON.parse(event.body);

    logger.info('auth user id ', userId);
    logger.info('Processing event: ', event);

    const newTodo = await createTodo(createTodoRequest, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({item: newTodo})
    };
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
