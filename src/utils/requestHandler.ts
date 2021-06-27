import { store } from "../redux/store"
import { BACKENDIP } from '../../GLOBALCONFIG'
import { setToken, unsetToken } from "../redux/authentication/authenticationSlice";
import { QuestPrototype } from "../types/quest";


const request = (target: string, type: string = 'GET', body?: any) => {

  const token = store.getState().authentication.token;

  return fetch(BACKENDIP + target, {

    method: type,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)

  }).then((response) => {
    if (response.status === 401)
      store.dispatch(unsetToken())
    return response;
  })
}

// /auth/login/
export const loginRequest = (email: string, hashed_password: string) => (request('/auth/login/', 'POST', {
  email: email,
  password: hashed_password
}))

// /auth/create/
export const registerRequest = (username: string, email: string, hashed_password: string) => (request('/auth/create/', 'POST', {
  username: username,
  email: email,
  password: hashed_password
}))

// /auth/renew/
export const renewRequest = () : void => {
  request('/auth/renew/', 'POST')
  .then(r => {
    if(r.ok) {
      r.json().then(r => {store.dispatch(setToken(r.token))})
    }
  })
}

export const invalidatemessagingtokenRequest = (FMToken: string) => (request('/auth/invalidatemessagingtoken', 'POST', FMToken))

// /chat/get/
export const chatGetRequest = (userId: string, offset: number) => (request(`/chat/get?userId=${userId}&offset=${offset}`))

// /chat/query/
export const chatQueryRequest = () => (request('/chat/query'))

// /chat/send/text
export const chatSendTextRequest = (userId: string, text: string) => (request('/chat/send/text', 'POST', {
  userId: userId,
  text: text
}))

// /chat/send/image
export const chatSendImageRequest = (userId: string, binaryImage: string) => (request('/chat/send/image', 'POST', {
  userId: userId,
  binaryImage: binaryImage
}))

// /quest/query/
export const queryQuestsRequest = (offset: number = 0) => (request(`/quest/query/?offset=${offset}`))

// /create/create/
export const createQuestRequest = () => (request('/create/create/', 'POST', {}))

// /create/query/
export const createQueryRequest = (offset: number = 0) => (request(`/create/query?offset=${offset}`))

// /create/get/
export const createGetRequest = (questId: string) => (request(`/create/get/?questId=${questId}`))

// /create/put/
export const createPutRequest = (questId: string, questPrototype: QuestPrototype) => (request('/create/put/', 'POST', {
  questId: questId,
  questPrototype: questPrototype,
  newImages: []
}))

// /create/release/
export const createPublishRequest = (questId: string) => (request('/create/release/', 'POST', {questId: questId}))

// /play/query
export const getAllTrackersRequest = () => (request('/play/query'))

// /play/create
export const createTrackerRequest = (questId: string) => (request('/play/create', 'POST', {questId: questId}))

// /user/updatemessagingtoken
export const userUpdatemessagingtoken = (token: string) => (request('/user/updatemessagingtoken', 'POST', token))

// /user/updateImage
export const userUpdateImage = (base64: string) => (request('/user/updateimage', 'POST', base64))

// /user/me
export const getUserSelfRequest = () => (request('/user/me/'))
