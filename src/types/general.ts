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
    trackerCount: number
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
