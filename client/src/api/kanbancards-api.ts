import { apiEndpoint, subDirectory, devapiEndpoint } from '../config'
import { KanbanCard } from '../types/KanbanCard'
import { CreateKanbanCardRequest } from '../types/CreateKanbanCardRequest'
import Axios from 'axios'
import { UpdateKanbanCardRequest } from '../types/UpdateKanbanCardRequest'

console.log('is offline:', process.env.REACT_APP_IS_OFFLINE)

let Endpoint: string
let JWTtoken: string

if (
  process.env.REACT_APP_IS_OFFLINE == 'false' ||
  process.env.REACT_APP_IS_OFFLINE == undefined
) {
  Endpoint = apiEndpoint
} else {
  console.log('offline')
  Endpoint = devapiEndpoint
}
console.log(Endpoint)

export async function getKanbanCards(idToken: string): Promise<KanbanCard[]> {
  console.log('Fetching kanbancards')
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  console.log('My token id:', JWTtoken)
  console.log('get link: ', `${Endpoint}/${subDirectory}`)
  const response = await Axios.get(`${Endpoint}/${subDirectory}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWTtoken}`
    }
  })
  console.log('KanbanCards:', response.data)
  console.log('token', JWTtoken)
  return response.data.items
}

export async function createKanbanCard(
  idToken: string,
  newKanbanCard: CreateKanbanCardRequest
): Promise<KanbanCard> {
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  const response = await Axios.post(
    `${Endpoint}/${subDirectory}`,
    JSON.stringify(newKanbanCard),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWTtoken}`
      }
    }
  )
  console.log(response.data)

  return response.data.newItem
}

export async function patchKanbanCard(
  idToken: string,
  kanbanCardId: string,
  updatedKanbanCard: UpdateKanbanCardRequest
): Promise<void> {
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  await Axios.patch(
    `${Endpoint}/${subDirectory}/${kanbanCardId}`,
    JSON.stringify(updatedKanbanCard),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWTtoken}`
      }
    }
  )
}

export async function deleteKanbanCard(
  idToken: string,
  kanbanCardId: string
): Promise<void> {
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  console.log('Deletion endpoint', `${Endpoint}/${subDirectory}/${kanbanCardId}`)
  await Axios.delete(`${Endpoint}/${subDirectory}/${kanbanCardId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWTtoken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  kanbanCardId: string
): Promise<string> {
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  const response = await Axios.post(
    `${Endpoint}/${subDirectory}/${kanbanCardId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWTtoken}`
      }
    }
  )
  console.log(response.data)

  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export const checkAttachmentURL = async (
  attachmentUrl: string
): Promise<boolean> => {
  await Axios.get(attachmentUrl)

  return true
}
