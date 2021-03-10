export interface KanbanCardItem {
  userId: string
  kanbanCardId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
