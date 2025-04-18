import { MobileOnboardingDataCollection } from '@vocably/model';

export const onboardingCollection: MobileOnboardingDataCollection = {
  en: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'remarkable, impressive, significant, noteworthy, striking',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'en',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'to arrive',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'question',
      sourceLanguage: 'da',
      targetLanguage: 'en',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'query, question, issue, matter',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
        {
          language: 'da',
          source: 'at spørge',
          ipa: '',
          example: '',
          definition: '',
          translation: 'to ask',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'common',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'ordinary, usual, universal, general, common',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  es: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'notable, destacable, evidente, reseñable',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'es',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'llegar, proceder de',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'pregunta',
      sourceLanguage: 'da',
      targetLanguage: 'es',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'spørg',
          ipa: '',
          example: '',
          definition: '',
          translation: 'pregunta',
          partOfSpeech: 'verb',
          tags: [],
        },
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'pregunta, asunto, tema, caso',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'comunes',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation:
            'común, corriente, medio, normal, típico, universal, extendido, tradicional',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  fr: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'remarquable, notable, incroyable',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'fr',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'arriver',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'question',
      sourceLanguage: 'da',
      targetLanguage: 'fr',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'question, problème, affaire',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'courantes',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation:
            'commun, commune, ordinaire, moyen, moyenne, courant, courante, universel, universelle, général, générale, simple',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  de: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'bemerkenswert',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'de',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'ankommen',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'frage',
      sourceLanguage: 'da',
      targetLanguage: 'de',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'Frage',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
        {
          language: 'da',
          source: 'frage',
          ipa: '',
          example: '',
          definition: '',
          translation: 'frage',
          partOfSpeech: 'noun',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'gewöhnlichen',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'gewöhnlich, normal, allgemein, häufig',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  zh: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: '显著的, 引人注目的',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'zh',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: '到达',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: '问题',
      sourceLanguage: 'da',
      targetLanguage: 'zh',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'problem',
          ipa: 'pʁoˈbleˀm',
          example: 'løse et problem',
          definition:
            'væsentligt, uafklaret anliggende som man bør forholde sig til vha. analyse el. tankevirksomhed; fx en uløst opgave der bør løses, et ubesvaret spørgsmål der bør besvares e.l.',
          translation: '问题',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: '问题, 询问',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: '常见的',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: '普通, 一般',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  'zh-TW': {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: '引人注目, 值得注意, 值得注意的',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'zh-TW',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: '到達',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: '問題',
      sourceLanguage: 'da',
      targetLanguage: 'zh-TW',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'problem',
          ipa: 'pʁoˈbleˀm',
          example: 'løse et problem',
          definition:
            'væsentligt, uafklaret anliggende som man bør forholde sig til vha. analyse el. tankevirksomhed; fx en uløst opgave der bør løses, et ubesvaret spørgsmål der bør besvares e.l.',
          translation: '問題',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: '問題, 詢問',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: '一般的',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: '普通, 一般',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  ja: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: '注目すべき, 目を引く',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'ja',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: '到着する',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: '質問',
      sourceLanguage: 'da',
      targetLanguage: 'ja',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: '質問, 疑問',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: '一般的な',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: '普通の, 一般的な',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  ru: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'заметный, выдающийся, замечательный',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'ru',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'прибыть',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'вопрос',
      sourceLanguage: 'da',
      targetLanguage: 'ru',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'вопрос, проблема',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'обычные',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'обычный, общий',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  it: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'notevole, eccezionale',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'it',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'arrivare',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'domanda',
      sourceLanguage: 'da',
      targetLanguage: 'it',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'domanda, questione',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
        {
          language: 'da',
          source: 'anmodning',
          ipa: '-ˌmoðˀneŋ',
          example: 'sende en anmodning om at få sagen genoptaget',
          definition:
            '* det at anmode nogen om noget\n* (skriftlig) meddelelse hvorved nogen anmoder om noget',
          translation: 'richiesta, domanda',
          partOfSpeech: 'noun',
          g: 'common',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'comuni',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'comune, normale',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  pt: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'notável, extraordinário',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'pt',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'chegar',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'pergunta',
      sourceLanguage: 'da',
      targetLanguage: 'pt',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'pergunta, questão',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'comuns',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'comum, normal',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  ar: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'ملحوظ, بارز',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'ar',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'الوصول, يصل',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'سؤال',
      sourceLanguage: 'da',
      targetLanguage: 'ar',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'سؤال, استفسار',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'عادية',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'عادي, شائع',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  nl: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'opmerkelijk, opvallend',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'nl',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankommen',
          ipa: '',
          example: '',
          definition: '',
          translation: 'aankomen',
          partOfSpeech: 'verb',
          tags: [],
        },
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'aankomen',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'vraag',
      sourceLanguage: 'da',
      targetLanguage: 'nl',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'vraag, probleem',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
        {
          language: 'da',
          source: 'anmodning',
          ipa: '-ˌmoðˀneŋ',
          example: 'sende en anmodning om at få sagen genoptaget',
          definition:
            '* det at anmode nogen om noget\n* (skriftlig) meddelelse hvorved nogen anmoder om noget',
          translation: 'verzoek, aanvraag',
          partOfSpeech: 'noun',
          g: 'common',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'gewone',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'gewone, algemeen',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  ko: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: '주목할 만한, 인상적인, 놀라운',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'ko',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: '도착하다',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: '질문',
      sourceLanguage: 'da',
      targetLanguage: 'ko',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: '질문, 문제',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: '일반적인',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: '평범한, 일반적인, 보통의, 흔한',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  hi: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'विशेष, ध्यान आकर्षित करने वाला, विशेष उल्लेखनीय',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'hi',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'आना',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'सवाल',
      sourceLanguage: 'da',
      targetLanguage: 'hi',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'प्रश्न, सवाल',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'सामान्य',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'सामान्य, साधारण',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  tr: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'dikkate değer, olağanüstü',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'tr',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'varmak',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'soru',
      sourceLanguage: 'da',
      targetLanguage: 'tr',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'soru, mesele',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'yaygın',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'sıradan, yaygın, genel',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  sv: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'anmärkningsvärd, märklig',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'sv',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'ankomma',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'fråga',
      sourceLanguage: 'da',
      targetLanguage: 'sv',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'fråga, spörsmål',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
        {
          language: 'da',
          source: 'at spørge',
          ipa: '',
          example: '',
          definition: '',
          translation: 'att fråga',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'vanliga',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'vanlig, allmän',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  no: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemerkelsesverdig',
      ipa: '',
      example: '',
      definition: '',
      translation: 'bemerkelsesverdig',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'no',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'ankomme',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'spørsmål',
      sourceLanguage: 'da',
      targetLanguage: 'no',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'spørsmål',
          ipa: '',
          example: '',
          definition: '',
          translation: 'spørsmål',
          partOfSpeech: 'noun',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'vanlige',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'vanlig, alminnelig',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  da: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: '',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'da',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: '',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'spørgsmål',
      sourceLanguage: 'da',
      targetLanguage: 'da',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: '',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'almindelige',
          partOfSpeech: '',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: '',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  fi: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'huomattava, merkittävä, huomionarvoinen',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'fi',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'saapua',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'kysymys',
      sourceLanguage: 'da',
      targetLanguage: 'fi',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'kysymys, kysymysmerkki',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'yleiset',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'tavallinen, yleinen',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  fa: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'بارز، قابل توجه',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'fa',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'رسیدن',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'سوال',
      sourceLanguage: 'da',
      targetLanguage: 'fa',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'پرسش، سوال',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'معمولی',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'عادی، معمولی',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  pl: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'godny uwagi, zauważalny',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'pl',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'przybyć',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'pytanie',
      sourceLanguage: 'da',
      targetLanguage: 'pl',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'pytanie, kwestia, problem',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'powszechny',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'zwykły, powszechny',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  el: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'εντυπωσιακός, σημαντικός',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'el',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'φτάνω',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'ερώτηση',
      sourceLanguage: 'da',
      targetLanguage: 'el',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'ερώτηση, ζητούμενο',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'συνηθισμένα',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'κανονικός, συνηθισμένος',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  he: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'מרשים, בולט, מְשׁוּמָשׁ',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'he',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'להגיע, לְהַגִּיעַ',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'שְׁאֵלָה',
      sourceLanguage: 'da',
      targetLanguage: 'he',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'שאלה, בעיה, שְׁאֵלָה',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
        {
          language: 'da',
          source: 'forespørgsel',
          ipa: 'ˈfɒːɒˌsbɶɐ̯səl',
          example:
            '* oplyse om rentesatser på forespørgsel\n* få mange forespørgsler på et produkt\n* rejse en forespørgsel',
          definition:
            '* spørgsmål el. anmodning som fremsættes på en høflig el. formel måde\n* henvendelse hvor en person søger oplysninger om et produkt med henblik på evt. køb\n* spørgsmål som rettes til regeringen el. en minister af et medlem af Folketinget, og som efterfølges af en debat i folketingssalen; en lignende procedure findes i Københavns Kommunes borgerrepræsentation, hvis medlemmer kan rejse forespørgsler til Magistraten',
          translation: 'שאלה, בקשה, שְׁאֵלָה',
          partOfSpeech: 'noun',
          g: 'common',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'נפוצים',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'רגיל, שכיח',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  th: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'น่าจดจำ, น่าสนใจ',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'th',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'มาถึง',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'คำถาม',
      sourceLanguage: 'da',
      targetLanguage: 'th',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'คำถาม, ปัญหา',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'ทั่วไป',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'ทั่วไป, ธรรมดา',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  vi: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'đáng chú ý, nổi bật',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'vi',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'đến',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'câu hỏi',
      sourceLanguage: 'da',
      targetLanguage: 'vi',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'câu hỏi, vấn đề',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'thông thường',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'thông thường, bình thường',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  id: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'menarik, mencolok, menarik perhatian',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'id',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'tiba',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'pertanyaan',
      sourceLanguage: 'da',
      targetLanguage: 'id',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'pertanyaan, masalah',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'umum',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'umum, biasa',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  ms: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'menarik, hebat, menarik perhatian',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'ms',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'tiba',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'soalan',
      sourceLanguage: 'da',
      targetLanguage: 'ms',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'soalan, pertanyaan',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'biasa',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'biasa, umum',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
  uk: {
    welcomeScreenCard: {
      language: 'da',
      source: 'bemærkelsesværdig',
      ipa: 'beˈmæɐ̯gəlsəsˌvæɐ̯ˀdi',
      example: '* bemærkelsesværdige resultater\n* bemærkelsesværdig fåmælt',
      definition:
        '* som vækker opmærksomhed og opsigt pga. sit omfang, sin karakter, sine egenskaber e.l.; som fortjener opmærksomhed\n* som afviger fra det forventelige; som falder i øjnene',
      translation: 'помітний, значний',
      partOfSpeech: 'adjective',
      tags: [],
    },
    directTranslationExample: {
      text: 'ankomme',
      sourceLanguage: 'da',
      targetLanguage: 'uk',
      isReversed: false,
      results: [
        {
          language: 'da',
          source: 'ankomme',
          ipa: 'ˈanˌkʌmˀə',
          example: 'ankomme med fly',
          definition:
            'komme til et bestemt sted efter at have tilbagelagt en vis afstand; om person el. transportmiddel',
          translation: 'прибути',
          partOfSpeech: 'verb',
          tags: [],
        },
      ],
    },
    reverseTranslationExample: {
      text: 'запитання',
      sourceLanguage: 'da',
      targetLanguage: 'uk',
      isReversed: true,
      results: [
        {
          language: 'da',
          source: 'et spørgsmål',
          ipa: 'ˈsbɶɐ̯sˌmɔˀl',
          example:
            '* stille et spørgsmål til nogen\n* ignorere spørgsmålet om ulighed\n* et spørgsmål om tillid',
          definition:
            '* sproglig ytring som rummer et uafklaret punkt, og som man fremsætter for at få dette punkt afklaret el. belyst af modtageren gennem dennes svar; kan i skriften markeres ved et spørgsmålstegn, i grammatikken ved fx omvendt ordstilling el. et spørgende pronomen og i udtalen ved en særlig intonation\n* anliggende, forhold el. problematik som giver anledning til overvejelser, diskussion, konflikt e.l.\n* anliggende el. problematik som beror på noget bestemt, el. hvis løsning el. afklaring er afhængig af en bestemt faktor',
          translation: 'питання, запит',
          partOfSpeech: 'noun',
          g: 'n',
          tags: [],
        },
      ],
    },
    contextTranslationExample: {
      text: 'De mest *almindelige* overspringede vedligeholdelsesopgaver involverer din krig mod støv. Dit hus er fyldt med filtre og ventilationsåbninger, der fanger støv og andre ting, hvilket forlænger dine systemers levetid og holder luften ren. Mindst en gang om året bør du rengøre og udskifte følgende:',
      results: [
        {
          language: 'da',
          source: 'almindelige',
          ipa: '',
          example: '',
          definition: '',
          translation: 'звичайні',
          partOfSpeech: 'adjective',
          tags: [],
        },
        {
          language: 'da',
          source: 'almindelig',
          ipa: 'alˈmenˀli',
          example:
            '* almindeligt tøj\n* almindeligt postevand\n* almindelig valgret',
          definition:
            '* som ikke adskiller sig fra gennemsnittet; uden bemærkelsesværdige el. påfaldende egenskaber\n* den mest udbredte og kendte af sin slags\n* som omfatter el. vedkommer alle; som er fælles for alle',
          translation: 'звичайний, поширений, загальний',
          partOfSpeech: 'adjective',
          tags: [],
        },
      ],
    },
  },
};
