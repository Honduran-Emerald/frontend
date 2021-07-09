
const locked = 1/0

export const levelLocks: {[key: string]: number} = {
  'ChoiceModule': 3,
  'LocationModule': 5,
  'RandomModule': 10,
  'PassphraseModule': 15,
  'QrCodeModule': 20,
  'WideAreaModule': locked,

  'CustomAgent': 7,
  'RelatedQuests': locked,
}