import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../utils/logger'
import { KanbanCardItem } from '../models/KabanCardItem'

let XAWS
if (process.env.AWS_XRAY_CONTEXT_MISSING) {
  console.log('Serverless Offline detected; skipping AWS X-Ray setup')
  XAWS = AWS
} else {
  XAWS = AWSXRay.captureAWS(AWS)
}
const logger = createLogger('kanbanCard-access')

export class KanbanCardAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = createS3Client(),
    private readonly kanbanCardsTable = process.env.KANBAN_CARD_TABLE,
    private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly indexName = process.env.KANBAN_CARD_TABLE_IDX
  ) {
    //
  }

  async getAllKanbanCards(userId: string): Promise<KanbanCardItem[]> {
    logger.info('Getting all kanbanCard items')

    const result = await this.docClient
      .query({
        TableName: this.kanbanCardsTable,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      })
      .promise()

    const items = result.Items

    return items as KanbanCardItem[]
  }

  async createKanbanCard(kanbanCard: KanbanCardItem): Promise<KanbanCardItem> {
    logger.info(`Creating a kanbanCard with ID ${kanbanCard.kanbanCardId}`)

    const newItem = {
      ...kanbanCard,
      attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${kanbanCard.kanbanCardId}`
    }

    await this.docClient
      .put({
        TableName: this.kanbanCardsTable,
        Item: newItem
      })
      .promise()

    return kanbanCard
  }

  async updateKanbanCard(kanbanCard: KanbanCardItem): Promise<KanbanCardItem> {
    logger.info(`Updating a kanbanCard with ID ${kanbanCard.kanbanCardId}`)

    const updateExpression = 'set #n = :name, dueDate = :dueDate, done = :done'

    await this.docClient
      .update({
        TableName: this.kanbanCardsTable,
        Key: {
          userId: kanbanCard.userId,
          kanbanCardId: kanbanCard.kanbanCardId
        },
        UpdateExpression: updateExpression,
        ConditionExpression: 'kanbanCardId = :kanbanCardId',
        ExpressionAttributeValues: {
          ':name': kanbanCard.name,
          ':dueDate': kanbanCard.dueDate,
          ':done': kanbanCard.done,
          ':kanbanCardId': kanbanCard.kanbanCardId
        },
        ExpressionAttributeNames: {
          '#n': 'name'
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return kanbanCard
  }

  async deleteKanbanCard(kanbanCardId: string, userId: string): Promise<string> {
    logger.info(`Deleting a kanbanCard with ID ${kanbanCardId}`)

    await this.docClient
      .delete({
        TableName: this.kanbanCardsTable,
        Key: {
          userId,
          kanbanCardId
        },
        ConditionExpression: 'kanbanCardId = :kanbanCardId',
        ExpressionAttributeValues: {
          ':kanbanCardId': kanbanCardId
        }
      })
      .promise()

    return userId
  }

  async generateUploadUrl(kanbanCardId: string): Promise<string> {
    logger.info('Generating upload Url')

    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: kanbanCardId,
      Expires: this.urlExpiration
    })
  }
}

const createDynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  } else {
    return new XAWS.DynamoDB.DocumentClient()
  }
}

const createS3Client = () => {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local S3 instance')

    return new AWS.S3({
      s3ForcePathStyle: true,
      // endpoint: new AWS.Endpoint('http://localhost:8200'),
      endpoint: 'http://localhost:8200',
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER'
    })
  } else {
    return new XAWS.S3({ signatureVersion: 'v4' })
  }
}
