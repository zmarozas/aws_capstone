/**
 * Fields in a request to update a single KanbanCard item.
 */
export interface UpdateKanbanCardRequest {
  name: string
  dueDate: string
  done: boolean
}
