import { GoogleLanguage } from '@vocably/model';

/**
 * An example word for every supported language, used as a placeholder /
 * suggestion in the search box.
 *
 * Selection criteria:
 * - a single noun, written in the language's own script
 * - neutral to mildly positive in meaning ("ice cream", "table")
 * - an everyday word with a plain equivalent in other languages — nothing
 *   culture-bound or hard to translate
 * - every word is unique within this list (the underlying concept may repeat
 *   across languages, the string never does)
 *
 * Keys follow the order of `GoogleLanguages` in `@vocably/model`.
 */
export const words: Record<GoogleLanguage, string> = {
  af: 'roomys', // ice cream
  sq: 'dritare', // window
  am: 'ቡና', // buna — coffee
  ar: 'قمر', // qamar — moon
  hy: 'նուռ', // nur — pomegranate
  hyw: 'գարուն', // garun — spring
  az: 'çay', // tea
  eu: 'itsaso', // sea
  be: 'бусел', // busiel — stork
  bn: 'নদী', // nodi — river
  bs: 'most', // bridge
  bg: 'роза', // roza — rose
  ca: 'finestra', // window
  zh: '灯笼', // dēnglong — lantern
  co: 'mare', // sea
  haw: 'honu', // sea turtle
  hr: 'more', // sea
  cs: 'houba', // mushroom
  da: 'cykel', // bicycle
  nl: 'fiets', // bicycle
  en: 'lighthouse',
  'en-GB': 'certainty',
  eo: 'stelo', // star
  et: 'mesi', // honey
  fi: 'järvi', // lake
  fr: 'boulangerie', // bakery
  fy: 'wetter', // water
  gl: 'praia', // beach
  ka: 'ღვინო', // ghvino — wine
  de: 'brücke', // bridge
  el: 'θάλασσα', // thalassa — sea
  gu: 'ઘર', // ghar — house
  ht: 'solèy', // sun
  ha: 'kifi', // fish
  he: 'תפוז', // tapuz — orange
  hi: 'बादल', // baadal — cloud
  hu: 'kenyér', // bread
  hmn: 'dej', // water
  is: 'jökull', // glacier
  ig: 'ugo', // eagle
  id: 'gunung', // mountain
  ga: 'ceol', // music
  it: 'gelato', // ice cream
  ja: '傘', // kasa — umbrella
  jv: 'kucing', // cat
  kn: 'ಮನೆ', // mane — house
  kk: 'алма', // alma — apple
  km: 'ទន្លេ', // tonle — river
  rw: 'inka', // cow
  ko: '나무', // namu — tree
  ku: 'çiya', // mountain
  ky: 'көл', // köl — lake
  lo: 'ຊ້າງ', // sang — elephant
  lv: 'ozols', // oak
  lt: 'duona', // bread
  lb: 'Haus', // house
  mk: 'езеро', // ezero — lake
  mg: 'vary', // rice
  ms: 'pulau', // island
  ml: 'തേങ്ങ', // thenga — coconut
  mt: 'ktieb', // book
  mi: 'waka', // canoe
  mr: 'पाऊस', // paus — rain
  mn: 'морь', // mori — horse
  my: 'ကြယ်', // kyal — star
  ne: 'हिमाल', // himal — snow mountain
  no: 'vindu', // window
  ny: 'mvula', // rain
  or: 'ଫୁଲ', // phula — flower
  ps: 'باغ', // bagh — garden
  fa: 'پروانه', // parvāne — butterfly
  pl: 'jabłko', // apple
  pt: 'café', // coffee
  'pt-PT': 'janela', // window
  pa: 'ਦਰਿਆ', // dariā — river
  ro: 'pădure', // forest
  ru: 'мороженое', // morozhenoe — ice cream
  sm: 'moana', // ocean
  gd: 'uisge', // water
  sr: 'малина', // malina — raspberry
  st: 'thaba', // mountain
  sn: 'shamwari', // friend
  sd: 'گل', // gul — flower
  si: 'තේ', // thē — tea
  sk: 'lúka', // meadow
  sl: 'jezero', // lake
  so: 'geed', // tree
  es: 'naranja', // orange
  su: 'kembang', // flower
  sw: 'mti', // tree
  sv: 'skog', // forest
  tl: 'bahay', // house
  tg: 'нон', // non — bread
  ta: 'நிலா', // nilā — moon
  tt: 'кояш', // koyash — sun
  te: 'పండు', // pandu — fruit
  th: 'ตลาด', // talat — market
  tr: 'deniz', // sea
  tk: 'ýyldyz', // star
  'zh-TW': '茶', // chá — tea
  uk: 'соняшник', // soniashnyk — sunflower
  ur: 'کتاب', // kitāb — book
  ug: 'ئۈزۈم', // üzüm — grape
  uz: 'anor', // pomegranate
  vi: 'sông', // river
  cy: 'afon', // river
  xh: 'intaba', // mountain
  yi: 'בוך', // bukh — book
  yo: 'ìlù', // drum
  zu: 'inyoni', // bird
};
