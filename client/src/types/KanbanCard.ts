export interface KanbanCard {
  kanbanCardId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  validUrl?: boolean
}
