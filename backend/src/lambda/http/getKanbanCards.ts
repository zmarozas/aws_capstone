import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {ApiResponseHelper}  from '../../utils/ApiResponseHelper'

import { getAllKanbanCards } from '../../businessLayer/kanbanCards'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('get-kanban-cards')
const apiResponseHelper = new ApiResponseHelper()


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event:', event)

    try {
      const jwtToken: string = getToken(event.headers.Authorization)
      const kanbanCards = await getAllKanbanCards(jwtToken)

      return {
        statusCode: 200,
 
        body: JSON.stringify({
          items: kanbanCards
        })
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
