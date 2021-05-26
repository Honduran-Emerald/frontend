import { store } from "../redux/store"
import { BACKENDIP } from '../../GLOBALCONFIG'
import { setToken, unsetToken } from "../redux/authentication/authenticationSlice";


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

export const loginRequest = (email: string, hashed_password: string) => (request('/auth/login/', 'POST', {
  email: email,
  password: hashed_password
}))

export const renewRequest = () => {
  request('/auth/renew/', 'POST')
  .then(r => r.json())
  .then(r => {store.dispatch(setToken(r.token))})
}

export const registerRequest = (username: string, email: string, hashed_password: string) => (request('/auth/create/', 'POST', {
  username: username,
  email: email,
  password: hashed_password
}))

export const queryQuestsRequest = (offset: number = 0) => (request(`/quest/query/?offset=${offset}`))

export const createQueryRequest = (offset: number = 0) => (request(`/create/query?offset=${offset}`))

export const createGetRequest = (questId: string) => (request(`/create/get/?queryId=${questId}`))

export const createQuestRequest =  (longitude: number, latitude: number, title: string, description: string, imageName: string) => (
  request('/create/quest/', 'POST', {
    longitude: longitude,
    latitude: latitude,
    title: title,
    description: description,
    imageName: imageName
  })
)

export const getUserSelfRequest = () => (request('/user/me/'))
