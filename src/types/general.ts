export interface Location {
    latitude: number,
    longitude: number
}

export interface Location {
    latitude: number,
    longitude: number
}

export interface User {
    userId: string,
    userName: string,
    email?: string,
    profileimage: string,
    questIds: string[],
    trackerIds: string[],
    activeTrackerId?: string,
    syncToken: string
}