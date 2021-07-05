export interface Location {
    latitude: number,
    longitude: number
}

export interface User {
    userId: string,
    userName: string,
    image: string,
    level: number,
    experience: number,
    glory: number,
    questCount: number,
    trackerCount: number,
    followerCount: number,
    following: boolean,
    follower: boolean
}

export interface ChatBaseMessageNotif {
    Sender: string,
    Received: boolean,
    CreationTime: Date,
}
export interface ChatTextMessageNotif extends ChatBaseMessageNotif {
    Type: 'Text',
    Text: string
}

export interface ChatMessageNotif {
    Message: ChatTextMessageNotif,
    UserImageId: string,
    Username: string
}

export interface ChatBaseMessage {
    sender: string,
    received: boolean,
    creationTime: Date,
}
export interface ChatTextMessage extends ChatBaseMessage {
    type: 'Text',
    text: string
}

export type ChatMessage = ChatTextMessage
