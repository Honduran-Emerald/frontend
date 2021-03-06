import { store } from "../redux/store"
import { BACKENDIP } from '../../GLOBALCONFIG'
import { setToken, unsetToken } from "../redux/authentication/authenticationSlice";
import { NewImage } from "../types/quest";
import { QuestPrototype } from "../types/prototypes";
import { loadQuest } from "../redux/editor/editorSlice";


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
export const renewRequest = () => (
  request('/auth/renew/', 'POST')
  .then(r => {
    if(r.ok) {
      r.json().then(r => {store.dispatch(setToken(r.token))})
    }
  })
)

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
export const queryQuestsRequest = (offset: number = 0, ownerId?: string) => (request(`/quest/query/?Offset=${offset}` + (ownerId != null ? `&OwnerId=${ownerId}` : '')))

// /quest/query get nearby quests
export const nearbyQuestsRequest = (offset: number = 0, long?: number, lat?: number, radius?: number) => (request(`/quest/query/?Offset=${offset}`
  + (long != null ? `&Location.Longitude=${long}` : '')
  + (lat != null ? `&Location.Latitude=${lat}` : '')
  + (radius != null ? `&Radius=${radius}` : '')))

// /quest/queryvoted
export const queryvotedQuestsRequest = (voteType : string, userId? : string) => (request(`/quest/queryvoted/?voteType=${voteType}` + (userId != null ? `&userId=${userId}` : '')))

// /quest/queryfinished
export const queryfinishedQuestsRequest = (userId? : string, offset : number = 0) => (request(`/quest/queryfinished?offset=${offset}` + (userId != null ? `&userId=${userId}` : '') + (`&finished=true`)))

// /quest/querynew
export const querynewQuestsRequest = (offset : number = 0, long?: number, lat?: number, radius?: number) => (request(`/quest/querynew/?offset=${offset}`
  + (long != null ? `&Longitude=${long}` : '')
  + (lat != null ? `&Latitude=${lat}` : '')
  + (radius != null ? `&radius=${radius}` : '')))

// /quest/queryfollowing
export const queryfollowingQuestsRequest = (offset : number = 0) => (request(`/quest/queryfollowing/?offset=${offset}`))

// /quest
export const queryQuestsWithIds = (firstId : string, moreIds? : string[]) => {
  let string = '';
  moreIds?.forEach((id: string) => string +=`&replayIds=${id}`)
  return (request(`/quest?replayIds=${firstId}` + string))
}

// /create/query/
export const createQueryRequest = (offset: number = 0) => (request(`/create/query?offset=${offset}`))

// /create/create/
export const createQuestRequest = () => (request('/create/create/', 'POST', {}))

// /create/delete/
export const createDeleteQuestRequest = (questId: string) => (request('/create/delete/', 'POST', questId))

// /create/get/
export const createGetRequest = (questId: string) => (request(`/create/get/?questId=${questId}`))

// /create/put/
export const createPutRequest = (questId: string, questPrototype: QuestPrototype, newImages: NewImage[]) => (request('/create/put/', 'POST', {
  questId: questId,
  questPrototype: questPrototype,
  newImages: newImages
}))

export const createAndPutRequest = (questId: string, questPrototype: QuestPrototype, newImages: NewImage[]) => (
  questId && questPrototype.id
    ? (createPutRequest(questId, questPrototype, newImages))
    : (createQuestRequest()
        .then(r => r.json())
        .then(r => {
          store.dispatch(loadQuest({
            questId: r.questId,
            questPrototype: {...questPrototype, id: r.questPrototype.id}
          }))
          return createPutRequest(
            r.questId,
            {...questPrototype, id: r.questPrototype.id},
            newImages
          );
      }))

)

// /create/release/
export const createPublishRequest = (questId: string) => (request('/create/release/', 'POST', {questId: questId}))

// /play/query
export const getAllTrackersRequest = () => (request('/play/query'))

// /play/create
export const createTrackerRequest = (questId: string) => (request('/play/create', 'POST', {questId: questId}))

// /play/vote
export const playVoteRequest = (trackerId: string, vote: 'None' | 'Up' | 'Down') => (request('/play/vote', 'POST', {trackerId: trackerId, vote: vote}))

// /play/reset
export const playResetRequest = (trackerId: string) => (request('/play/reset', 'POST', trackerId))

// /play/remove/
export const createDeleteTrackerRequest = (trackerId: string) => (request('/play/remove/', 'POST', trackerId))

// /play/querytrackernodes
export const queryTrackerNodesRequest = (trackerId: string) => (request(`/play/querytrackernodes?trackerId=${trackerId}`))

// /play/event/position

// /play/event/choice
export const playEventChoiceRequest = (trackerId: string, choice: number, moduleId: string) => (request('/play/event/choice', 'POST', {
  trackerId: trackerId,
  choice: choice,
  moduleId: moduleId
}))

// /play/event/...
export const playEventTextRequest = (trackerId: string, text: string | number) => (request('/play/event/text', 'POST', {
  trackerId: trackerId,
  text: text
}))

// /user/updatemessagingtoken
export const userUpdatemessagingtoken = (token: string) => (request('/user/updatemessagingtoken', 'POST', token))

// /user/updateImage
export const userUpdateImage = (base64: string) => (request('/user/updateimage', 'POST', base64))

// /user/me
export const getUserSelfRequest = () => (request('/user/me/'))

// /user/get
export const getUserRequest = (userId: string) => (request(`/user/get?userId=${userId}`))

// /user/followers
export const getUserFollowers = () => (request('/user/followers/'))

// /user/togglefollow
export const userToggleFollow = (userId: string) => (request('/user/togglefollow', 'POST', userId))

// /user/following
export const getUserFollowing = () => (request('/user/following/'))

// /user/friends
export const getUserFriends = () => (request('/user/friends/'))

// /user/query/
export const queryUsersRequest = (offset: number = 0, searchString?: string) => (request(`/user/query?offset=${offset}` + (searchString != null ? `&search=${searchString}` : '')))

// /user/setusername
export const setUsernameRequest = (username: string) => (request('/user/setusername', 'POST', username))
