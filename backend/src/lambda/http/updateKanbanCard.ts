import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {ApiResponseHelper}  from '../../utils/ApiResponseHelper'

import { UpdateKanbanCardRequest } from '../../requests/UpdateKanbanCardRequest'
import { updateKanbanCard } from '../../businessLayer/kanbanCards'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update-kanban-card')
const apiResponseHelper = new ApiResponseHelper()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const kanbanCardId: string = event.pathParameters.kanbanCardId
      const updatedKanbanCard: UpdateKanbanCardRequest = JSON.parse(event.body)

      const jwtToken: string = getToken(event.headers.Authorization)

      await updateKanbanCard(kanbanCardId, updatedKanbanCard, jwtToken)

      return {
        statusCode: 200,
   
        body: ''
      }
    } catch (e) {
      logger.error('Error', { error: e.message })
      return apiResponseHelper.generateErrorResponse(500,e.message)

    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)