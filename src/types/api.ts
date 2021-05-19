import { Module } from "./quest";

export interface QuestAPI {
    id: string,
    owner: string,
    title: string,
    description: string,
    image: string,
    version: number,
    createdAt: string,
    votes: number,
    plays: number,
    finishes: number,
    location: {
        longitude: number,
        latitude: number
    }
}

export interface EventAPI {
    type: string,
    reponseEvent: {
        module?: Module
    }
}