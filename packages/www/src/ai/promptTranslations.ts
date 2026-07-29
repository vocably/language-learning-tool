import { GoogleLanguage } from '@vocably/model';

type PromptTranslation = {
  grammar: string;
  response: string;
};

export const promptTranslations: Record<GoogleLanguage, PromptTranslation> = {
  af: {
    grammar: 'u grammatika',
    response: 'die werklike antwoord',
  },
  sq: {
    grammar: 'gramatika juaj',
    response: 'përgjigjja e vërtetë',
  },
  am: {
    grammar: 'ሰዋስውዎ',
    response: 'ትክክለኛው ምላሽ',
  },
  ar: {
    grammar: 'قواعدكم اللغوية',
    response: 'الرد الفعلي',
  },
  hy: {
    grammar: 'ձեր քերականությունը',
    response: 'բուն պատասխանը',
  },
  hyw: {
    grammar: 'ձեր քերականութիւնը',
    response: 'բուն պատասխանը',
  },
  az: {
    grammar: 'qrammatikanız',
    response: 'əsas cavab',
  },
  eu: {
    grammar: 'zure gramatika',
    response: 'benetako erantzuna',
  },
  be: {
    grammar: 'ваша граматыка',
    response: 'сам адказ',
  },
  bn: {
    grammar: 'আপনার ব্যাকরণ',
    response: 'প্রকৃত উত্তর',
  },
  bs: {
    grammar: 'vaša gramatika',
    response: 'stvarni odgovor',
  },
  bg: {
    grammar: 'вашата граматика',
    response: 'самият отговор',
  },
  ca: {
    grammar: 'la seva gramàtica',
    response: 'la resposta real',
  },
  zh: {
    grammar: '您的语法',
    response: '实际回复',
  },
  'zh-TW': {
    grammar: '您的語法',
    response: '實際回覆',
  },
  co: {
    grammar: 'a vostra grammatica',
    response: 'a risposta vera',
  },
  hr: {
    grammar: 'vaša gramatika',
    response: 'stvarni odgovor',
  },
  cs: {
    grammar: 'vaše gramatika',
    response: 'samotná odpověď',
  },
  da: {
    grammar: 'din grammatik',
    response: 'det egentlige svar',
  },
  nl: {
    grammar: 'uw grammatica',
    response: 'het echte antwoord',
  },
  en: {
    grammar: 'your grammar',
    response: 'the actual response',
  },
  'en-GB': {
    grammar: 'your grammar',
    response: 'the actual response',
  },
  eo: {
    grammar: 'via gramatiko',
    response: 'la efektiva respondo',
  },
  et: {
    grammar: 'teie grammatika',
    response: 'tegelik vastus',
  },
  fi: {
    grammar: 'kielioppinne',
    response: 'varsinainen vastaus',
  },
  fr: {
    grammar: 'votre grammaire',
    response: 'la réponse proprement dite',
  },
  fy: {
    grammar: 'jo grammatika',
    response: 'it eigentlike antwurd',
  },
  gl: {
    grammar: 'a súa gramática',
    response: 'a resposta real',
  },
  ka: {
    grammar: 'თქვენი გრამატიკა',
    response: 'ნამდვილი პასუხი',
  },
  de: {
    grammar: 'Ihre Grammatik',
    response: 'die eigentliche Antwort',
  },
  el: {
    grammar: 'η γραμματική σας',
    response: 'η κανονική απάντηση',
  },
  gu: {
    grammar: 'તમારું વ્યાકરણ',
    response: 'વાસ્તવિક જવાબ',
  },
  ht: {
    grammar: 'gramè ou',
    response: 'vrè repons lan',
  },
  ha: {
    grammar: 'nahawunku',
    response: 'ainihin amsar',
  },
  haw: {
    grammar: 'kāu pilina ʻōlelo',
    response: 'ka pane maoli',
  },
  he: {
    grammar: 'הדקדוק שלך',
    response: 'התשובה עצמה',
  },
  hi: {
    grammar: 'आपका व्याकरण',
    response: 'वास्तविक उत्तर',
  },
  hmn: {
    grammar: 'koj cov cai sau ntawv',
    response: 'cov lus teb tiag',
  },
  hu: {
    grammar: 'az Ön nyelvtana',
    response: 'maga a válasz',
  },
  is: {
    grammar: 'málfræðin þín',
    response: 'eiginlega svarið',
  },
  ig: {
    grammar: 'ụtọasụsụ gị',
    response: 'ezigbo azịza',
  },
  id: {
    grammar: 'tata bahasa Anda',
    response: 'jawaban sebenarnya',
  },
  ga: {
    grammar: 'do ghramadach',
    response: 'an freagra féin',
  },
  it: {
    grammar: 'la Sua grammatica',
    response: 'la risposta vera e propria',
  },
  ja: {
    grammar: 'あなたの文法',
    response: '実際の返答',
  },
  jv: {
    grammar: 'tata basa panjenengan',
    response: 'wangsulan sing sanyatane',
  },
  kn: {
    grammar: 'ನಿಮ್ಮ ವ್ಯಾಕರಣ',
    response: 'ನಿಜವಾದ ಪ್ರತಿಕ್ರಿಯೆ',
  },
  kk: {
    grammar: 'сіздің грамматикаңыз',
    response: 'нақты жауап',
  },
  km: {
    grammar: 'វេយ្យាករណ៍របស់អ្នក',
    response: 'ចម្លើយពិតប្រាកដ',
  },
  rw: {
    grammar: 'ikibonezamvugo cyawe',
    response: 'igisubizo nyacyo',
  },
  ko: {
    grammar: '당신의 문법',
    response: '실제 답변',
  },
  ku: {
    grammar: 'rêzimana we',
    response: 'bersiva rastîn',
  },
  ky: {
    grammar: 'сиздин грамматикаңыз',
    response: 'негизги жооп',
  },
  lo: {
    grammar: 'ໄວຍາກອນຂອງທ່ານ',
    response: 'ຄຳຕອບຕົວຈິງ',
  },
  lv: {
    grammar: 'jūsu gramatika',
    response: 'pati atbilde',
  },
  lt: {
    grammar: 'jūsų gramatika',
    response: 'pats atsakymas',
  },
  lb: {
    grammar: 'Är Grammaire',
    response: 'déi eigentlech Äntwert',
  },
  mk: {
    grammar: 'вашата граматика',
    response: 'самиот одговор',
  },
  mg: {
    grammar: 'ny fitsipi-pitenenanao',
    response: 'ny tena valiny',
  },
  ms: {
    grammar: 'tatabahasa anda',
    response: 'jawapan sebenar',
  },
  ml: {
    grammar: 'നിങ്ങളുടെ വ്യാകരണം',
    response: 'യഥാർത്ഥ മറുപടി',
  },
  mt: {
    grammar: 'il-grammatika tagħkom',
    response: 'it-tweġiba nnifisha',
  },
  mi: {
    grammar: 'tō wetereo',
    response: 'te whakautu tūturu',
  },
  mr: {
    grammar: 'तुमचे व्याकरण',
    response: 'प्रत्यक्ष उत्तर',
  },
  mn: {
    grammar: 'таны хэл зүй',
    response: 'жинхэнэ хариулт',
  },
  my: {
    grammar: 'သင့်သဒ္ဒါ',
    response: 'အမှန်တကယ် အဖြေ',
  },
  ne: {
    grammar: 'तपाईंको व्याकरण',
    response: 'वास्तविक जवाफ',
  },
  no: {
    grammar: 'grammatikken din',
    response: 'selve svaret',
  },
  ny: {
    grammar: 'galamala yanu',
    response: 'yankho lenileni',
  },
  or: {
    grammar: 'ଆପଣଙ୍କ ବ୍ୟାକରଣ',
    response: 'ପ୍ରକୃତ ଉତ୍ତର',
  },
  ps: {
    grammar: 'ستاسو ګرامر',
    response: 'اصلي ځواب',
  },
  fa: {
    grammar: 'دستور زبان شما',
    response: 'پاسخ اصلی',
  },
  pl: {
    grammar: 'Pana/Pani gramatyka',
    response: 'właściwa odpowiedź',
  },
  pt: {
    grammar: 'sua gramática',
    response: 'a resposta em si',
  },
  'pt-PT': {
    grammar: 'a sua gramática',
    response: 'a resposta em si',
  },
  pa: {
    grammar: 'ਤੁਹਾਡੀ ਵਿਆਕਰਨ',
    response: 'ਅਸਲ ਜਵਾਬ',
  },
  ro: {
    grammar: 'gramatica dumneavoastră',
    response: 'răspunsul propriu-zis',
  },
  ru: {
    grammar: 'ваша грамматика',
    response: 'сам ответ',
  },
  sm: {
    grammar: 'lau kalama',
    response: 'le tali moni',
  },
  gd: {
    grammar: 'ur gràmar',
    response: 'an fhreagairt fhèin',
  },
  sr: {
    grammar: 'ваша граматика',
    response: 'сам одговор',
  },
  st: {
    grammar: 'sebōpeho-puo sa hao',
    response: 'karabo ea sebele',
  },
  sn: {
    grammar: 'girama yako',
    response: 'mhinduro chaiyo',
  },
  sd: {
    grammar: 'توهان جي گرامر',
    response: 'اصل جواب',
  },
  si: {
    grammar: 'ඔබේ ව්‍යාකරණ',
    response: 'සැබෑ පිළිතුර',
  },
  sk: {
    grammar: 'vaša gramatika',
    response: 'samotná odpoveď',
  },
  sl: {
    grammar: 'vaša slovnica',
    response: 'sam odgovor',
  },
  so: {
    grammar: 'naxwahaaga',
    response: 'jawaabta dhabta ah',
  },
  es: {
    grammar: 'su gramática',
    response: 'la respuesta en sí',
  },
  su: {
    grammar: 'tata basa anjeun',
    response: 'jawaban saenyana',
  },
  sw: {
    grammar: 'sarufi yako',
    response: 'jibu halisi',
  },
  sv: {
    grammar: 'din grammatik',
    response: 'själva svaret',
  },
  tl: {
    grammar: 'ang inyong gramatika',
    response: 'ang aktwal na sagot',
  },
  tg: {
    grammar: 'грамматикаи шумо',
    response: 'ҷавоби асосӣ',
  },
  ta: {
    grammar: 'உங்கள் இலக்கணம்',
    response: 'உண்மையான பதில்',
  },
  tt: {
    grammar: 'сезнең грамматика',
    response: 'җавапның үзе',
  },
  te: {
    grammar: 'మీ వ్యాకరణం',
    response: 'అసలు సమాధానం',
  },
  th: {
    grammar: 'ไวยากรณ์ของคุณ',
    response: 'คำตอบจริง',
  },
  tr: {
    grammar: 'dil bilginiz',
    response: 'asıl yanıt',
  },
  tk: {
    grammar: 'siziň grammatikaňyz',
    response: 'esasy jogap',
  },
  uk: {
    grammar: 'ваша граматика',
    response: 'сама відповідь',
  },
  ur: {
    grammar: 'آپ کی گرامر',
    response: 'اصل جواب',
  },
  ug: {
    grammar: 'گرامماتىكىڭىز',
    response: 'ئەسلى جاۋاب',
  },
  uz: {
    grammar: 'grammatikangiz',
    response: 'asosiy javob',
  },
  vi: {
    grammar: 'ngữ pháp của bạn',
    response: 'câu trả lời thực sự',
  },
  cy: {
    grammar: 'eich gramadeg',
    response: 'yr ateb ei hun',
  },
  xh: {
    grammar: 'igrama yakho',
    response: 'impendulo yokwenyani',
  },
  yi: {
    grammar: 'אײַער גראַמאַטיק',
    response: 'דער אמתער ענטפֿער',
  },
  yo: {
    grammar: 'gírámà yín',
    response: 'ìdáhùn gangan',
  },
  zu: {
    grammar: 'uhlelo lwakho lolimi',
    response: 'impendulo yangempela',
  },
};
