import { store } from "../redux/store"
import { BACKENDIP } from '../../GLOBALCONFIG'
import { setToken, unsetToken } from "../redux/authentication/authenticationSlice";
import { QuestPrototype } from "../types/quest";


const request = (target: string, type: string = 'GET', body?: object) => {

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
  .then(r => r.json())
  .then(r => {store.dispatch(setToken(r.token))})
}

// /quest/query/
export const queryQuestsRequest = (offset: number = 0) => (request(`/quest/query/?offset=${offset}`))

// /create/query/
export const createQueryRequest = (offset: number = 0) => (request(`/create/query?offset=${offset}`))

// /create/get/
export const createGetRequest = (questId: string) => (request(`/create/get/?questId=${questId}`))

// /create/put/
export const createPutRequest = (questId: string, questPrototype: QuestPrototype) => (request('/create/put/', 'POST', {
  questId: questId,
  questPrototype: questPrototype
}))

// /create/publish/
export const createPublishRequest = (questId: string) => (request('/create/publish/', 'POST', {questId: questId}))

// /test/init/ 
export const createQuestRequest =  (longitude: number, latitude: number, title: string, description: string, tags: string[], imageId: string) => (
  request('/test/init/', 'POST', {
    longitude: longitude,
    latitude: latitude,
    title: title,
    description: description,
    tags: tags,
    imageId: imageId
  })
)

// /user/me
export const getUserSelfRequest = () => (request('/user/me/'))
