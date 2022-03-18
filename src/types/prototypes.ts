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
  agentEnabled: boolean,
}

//############################# Modules

export interface PrototypeModuleBase {
  id: number,
  type: string,
  objective: string,
  components: PrototypeComponent[]
}

export interface PrototypeChoiceModule extends PrototypeModuleBase {
  type: 'Choice',
  choices: {
      text: string,
      nextModuleReference: number | null,
  }[]
}

export interface PrototypeRandomModule extends PrototypeModuleBase {
  type: 'Random',
  nextLeftModuleReference: number | null,
  nextRightModuleReference: number | null,
  leftRatio: number,
}

export interface PrototypeWideAreaModule extends PrototypeModuleBase {
  type: 'WideArea',
  location: Location,
  radius: number,
  nextModuleReference: number | null,
}

export interface PrototypePassphraseModule extends PrototypeModuleBase {
  type: 'Passphrase',
  text: string,
  nextModuleReference: number | null,
}

export interface PrototypeQRModule extends PrototypeModuleBase {
  type: 'QrCode',
  text: string,
  nextModuleReference: number | null,
}

export interface PrototypeStoryModule extends PrototypeModuleBase {
  type: 'Story'
  nextModuleReference: number | null,
}

export interface PrototypeEndingModule extends PrototypeModuleBase {
  type: 'Ending',
  endingFactor: 0 | 0.5 | 1,
}

export interface PrototypeLocationModule extends PrototypeModuleBase {
  type: 'Location',
  location: Location,
  nextModuleReference: number | null,
}

export type PrototypeModule = PrototypeChoiceModule | PrototypeEndingModule | PrototypeStoryModule | PrototypeLocationModule | PrototypeRandomModule | PrototypeWideAreaModule | PrototypePassphraseModule | PrototypeQRModule

//############################# Components

export interface PrototypeTextComponent {
  type: 'Text',
  text: string,
}

export interface PrototypeImageComponent {
  type: 'Image',
  imageReference: number | null,
}

export type PrototypeComponent = PrototypeTextComponent | PrototypeImageComponent