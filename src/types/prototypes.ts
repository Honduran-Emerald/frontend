import { Location } from "./general"
import { Image, QuestBase } from "./quest"

//############################# Quest

export interface QuestPrototype extends QuestBase {
  approximateTime: string,
  firstModuleReference: number | null,
  modules: PrototypeModule[],
  images: Image[],
  imageReference: number | null,
  agentProfileReference: number | null,
}

//############################# Modules

export interface PrototypeModuleBase {
  id: number,
  type: string,
  objective: string,
  components: PrototypeComponent[]
}

export interface PrototypeChoiceModule extends PrototypeModuleBase {
  type: 'Choice'
  choices: {
      text: string,
      nextModuleReference: number | null,
  }[]
}

export interface PrototypeStoryModule extends PrototypeModuleBase {
  type: 'Story'
  nextModuleReference: number | null,
}

export interface PrototypeEndingModule extends PrototypeModuleBase {
  type: 'Ending',
  endingFactor: number,
}

export interface PrototypeLocationModule extends PrototypeModuleBase {
  type: 'Location',
  location: Location,
  nextModuleReference: number | null,
}

export type PrototypeModule = PrototypeChoiceModule | PrototypeEndingModule | PrototypeStoryModule | PrototypeLocationModule

//############################# Components

export interface PrototypeTextComponent {
  type: 'Text',
  text: string,
}

export interface PrototypeImageComponent {
  type: 'Image',
  text: string,
}

export type PrototypeComponent = PrototypeTextComponent | PrototypeImageComponent