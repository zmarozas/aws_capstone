import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {ApiResponseHelper}  from '../../utils/ApiResponseHelper'
import { deleteKanbanCard } from '../../businessLayer/kanbanCards'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('delete-kanban-card')
const apiResponseHelper = new ApiResponseHelper()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const kanbanCardId = event.pathParameters.kanbanCardId
    const jwtToken: string = getToken(event.headers.Authorization)

    try {
      logger.info('In delete. kanbanCardId: ' + event.pathParameters)
      await deleteKanbanCard(kanbanCardId, jwtToken)

      return {
        statusCode: 200,
        body: ''
      }
    } catch (e) {
      logger.error('Error: ' + e.message)
      return apiResponseHelper.generateErrorResponse(500,e.message)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)