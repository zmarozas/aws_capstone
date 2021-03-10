import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {ApiResponseHelper}  from '../../utils/ApiResponseHelper'

import { CreateKanbanCardRequest } from '../../requests/CreateKanbanCardRequest'
import { createKanbanCard } from '../../businessLayer/kanbanCards'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update-kanban-card')
const apiResponseHelper = new ApiResponseHelper()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newKanbanCard: CreateKanbanCardRequest = JSON.parse(event.body)
      const jwtToken: string = getToken(event.headers.Authorization)
      const newItem = await createKanbanCard(newKanbanCard, jwtToken)

      return {
        statusCode: 201,
        body: JSON.stringify({
          newItem
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
