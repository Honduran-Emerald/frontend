
const locked = 1/0; // Infinity; Mathematiker hassen diesen Trick
export const unlockAll = false; // Removes all level restrictions

export const levelLocks: {[key: string]: number} = !unlockAll ? {
  'ChoiceModule': 3,
  'LocationModule': 5,
  'RandomModule': 10,
  'PassphraseModule': 15,
  'QrCodeModule': 20,
  'WideAreaModule': locked,

  'CustomAgent': 7,
  'RelatedQuests': locked,
} : {}