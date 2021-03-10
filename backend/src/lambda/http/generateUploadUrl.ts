import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {ApiResponseHelper}  from '../../utils/ApiResponseHelper'

import { generateUploadUrl } from '../../businessLayer/kanbanCards'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update-kanban-card')
const apiResponseHelper = new ApiResponseHelper()


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const kanbanCardId = event.pathParameters.kanbanCardId
      const uploadUrl = await generateUploadUrl(kanbanCardId)

      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl
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