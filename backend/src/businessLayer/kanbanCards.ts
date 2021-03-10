import * as uuid from 'uuid'

import { KanbanCardItem } from '../models/KabanCardItem'
import { KanbanCardAccess } from '../dataLayer/kanbanCardAccess'
import { CreateKanbanCardRequest } from '../requests/CreateKanbanCardRequest'
import { UpdateKanbanCardRequest } from '../requests/UpdateKanbanCardRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('kanbancards')

const kanbanCardAccess = new KanbanCardAccess()

export const getAllKanbanCards = async (jwtToken: string): Promise<KanbanCardItem[]> => {
  const userId = parseUserId(jwtToken)

  return await kanbanCardAccess.getAllKanbanCards(userId)
}

export const createKanbanCard = async (
  createKanbanCardRequest: CreateKanbanCardRequest,
  jwtToken: string
): Promise<KanbanCardItem> => {
  logger.info('In createKanbanCard() function')

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await kanbanCardAccess.createKanbanCard({
    kanbanCardId: itemId,
    userId,
    name: createKanbanCardRequest.name,
    dueDate: createKanbanCardRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export const updateKanbanCard = async (
  kanbanCardId: string,
  updateKanbanCardRequest: UpdateKanbanCardRequest,
  jwtToken: string
): Promise<KanbanCardItem> => {
  logger.info('In updateKanbanCard() function')

  const userId = parseUserId(jwtToken)
  logger.info('User Id: ' + userId)

  return await kanbanCardAccess.updateKanbanCard({
    kanbanCardId,
    userId,
    name: updateKanbanCardRequest.name,
    dueDate: updateKanbanCardRequest.dueDate,
    done: updateKanbanCardRequest.done,
    createdAt: new Date().toISOString()
  })
}

export const deleteKanbanCard = async (
  kanbancardId: string,
  jwtToken: string
): Promise<string> => {
  logger.info('In deleteKanbanCard() function')

  const userId = parseUserId(jwtToken)
  logger.info('User Id: ' + userId)

  return await kanbanCardAccess.deleteKanbanCard(kanbancardId, userId)
}

export const generateUploadUrl = async (kanbancardId: string): Promise<string> => {
  logger.info('In generateUploadUrl() function')

  return await kanbanCardAccess.generateUploadUrl(kanbancardId)
}
