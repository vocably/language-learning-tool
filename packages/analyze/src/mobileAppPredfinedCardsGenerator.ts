import { makeCreate } from '@vocably/crud';
import {
  AnalysisItem,
  CardItem,
  ChatGPTLanguages,
  GoogleLanguage,
  SrsCard,
} from '@vocably/model';
import { createSrsItem } from '@vocably/srs';
import { join } from '@vocably/sulna';
import { existsSync, writeFileSync } from 'node:fs';
import { buildDirectResult } from './buildDirectResult';

const languageWords: Partial<Record<GoogleLanguage, string[]>> = {
  en: [
    'integrity',
    'resilience',
    'threshold',
    'disposition',
    'repercussion',
    'outcome',
    'acknowledge',
    'consider',
    'devote',
    'justify',
    'neglect',
    'persuade',
    'gradually',
    'implicitly',
    'notably',
    'promptly',
    'roughly',
    'sufficiently',
    'persistent',
    'comprehensive',
    'delightful',
    'cautious',
    'reluctant',
    'significant',
  ],
  es: [
    'integridad',
    'resiliencia',
    'límite',
    'disposición',
    'repercusión',
    'resultado',
    'reconocer',
    'considerar',
    'dedicar',
    'justificar',
    'descuido',
    'persuadir',
    'gradualmente',
    'implícitamente',
    'notablemente',
    'inmediatamente',
    'apenas',
    'suficientemente',
    'persistente',
    'integral',
    'encantador',
    'precavido',
    'reacio',
    'significativo',
  ],
  fr: [
    'intégrité',
    'résilience',
    'seuil',
    'disposition',
    'répercussion',
    'résultat',
    'reconnaître',
    'considérer',
    'consacrer',
    'justifier',
    'négligence',
    'persuader',
    'progressivement',
    'implicitement',
    'notamment',
    'rapidement',
    'à peu près',
    'suffisamment',
    'persistant',
    'complet',
    'délicieux',
    'prudent',
    'réticent',
    'significatif',
  ],
  de: [
    'Integrität',
    'Widerstandsfähigkeit',
    'Schwelle',
    'Anordnung',
    'Auswirkung',
    'Ergebnis',
    'anerkennen',
    'halten',
    'widmen',
    'rechtfertigen',
    'Vernachlässigung',
    'überreden',
    'schrittweise',
    'implizit',
    'vor allem',
    'sofort',
    'rund',
    'ausreichend',
    'hartnäckig',
    'umfassend',
    'entzückend',
    'zurückhaltend',
    'widerwillig',
    'bedeutsam',
  ],
  zh: [
    '正直',
    '弹力',
    '临界点',
    '处置',
    '反响',
    '结果',
    '承认',
    '考虑',
    '奉献',
    '证明合法',
    '忽视',
    '说服',
    '逐步地',
    '隐含地',
    '尤其',
    '及时',
    '大致',
    '足够',
    '执着的',
    '综合的',
    '愉快',
    '谨慎',
    '不情愿的',
    '重要的',
  ],
  'zh-TW': [
    '正直',
    '彈性',
    '臨界點',
    '性格',
    '迴響',
    '結果',
    '承認',
    '考慮',
    '奉獻',
    '證明合法',
    '忽視',
    '說服',
    '逐步地',
    '隱含地',
    '尤其',
    '及時',
    '大致',
    '充分地',
    '執著的',
    '綜合的',
    '愉快',
    '謹慎',
    '不情願的',
    '重要的',
  ],
  ja: [
    '誠実さ',
    '回復力',
    'しきい値',
    '配置',
    '反響',
    '結果',
    '認める',
    '考慮する',
    '献身する',
    '正当化する',
    '無視',
    '説得する',
    '徐々に',
    '暗黙的に',
    '特に',
    '速やかに',
    'だいたい',
    '十分に',
    '持続的',
    '包括的な',
    '楽しい',
    '用心深い',
    '気が進まない',
    '重要な',
  ],
  it: [
    'integrità',
    'resilienza',
    'soglia',
    'disposizione',
    'ripercussione',
    'risultato',
    'riconoscere',
    'considerare',
    'dedicare',
    'giustificare',
    'trascurare',
    'persuadere',
    'gradualmente',
    'implicitamente',
    'in particolare',
    'prontamente',
    "all'incirca",
    'sufficientemente',
    'persistente',
    'completo',
    'delizioso',
    'cauto',
    'riluttante',
    'significativo',
  ],
  pt: [
    'integridade',
    'resiliência',
    'limite',
    'disposição',
    'repercussão',
    'resultado',
    'reconhecer',
    'considerar',
    'dedicar',
    'justificar',
    'negligência',
    'persuadir',
    'gradualmente',
    'implicitamente',
    'notavelmente',
    'prontamente',
    'aproximadamente',
    'suficientemente',
    'persistente',
    'abrangente',
    'delicioso',
    'cauteloso',
    'relutante',
    'significativo',
  ],
  ar: [
    'نزاهة',
    'صمود',
    'عتبة',
    'التصرف',
    'انعكاس',
    'حصيلة',
    'يُقرّ',
    'يعتبر',
    'كرس',
    'يبرر',
    'أهمل',
    'يقنع',
    'تدريجياً',
    'ضمنا',
    'على وجه الخصوص',
    'حالا',
    'تقريبا',
    'بشكل كافي',
    'مثابر',
    'شامل',
    'ممتع',
    'حذر',
    'متكاسل',
    'بارِز',
  ],
  nl: [
    'integriteit',
    'weerstand',
    'drempelwaarde',
    'dispositie',
    'repercussie',
    'resultaat',
    'erkennen',
    'overwegen',
    'wijden',
    'verantwoorden',
    'verwaarlozen',
    'overtuigen',
    'geleidelijk',
    'impliciet',
    'Opmerkelijk',
    'prompt',
    'ongeveer',
    'voldoende',
    'volhardend',
    'uitgebreid',
    'verrukkelijk',
    'voorzichtig',
    'huiverig',
    'significant',
  ],
  ko: [
    '진실성',
    '회복력',
    '한계점',
    '처분',
    '반향',
    '결과',
    '인정하다',
    '고려하다',
    '바치다',
    '신이 옳다고 하다',
    '소홀히 하다',
    '설득하다',
    '서서히',
    '암묵적으로',
    '특히',
    '즉시',
    '대충',
    '충분히',
    '지속성 있는',
    '포괄적인',
    '매우 기쁜',
    '조심성 있는',
    '주저하는',
    '중요한',
  ],
  // hi: [
  //   'अखंडता',
  //   'लचीलापन',
  //   'सीमा',
  //   'स्वभाव',
  //   'प्रतिक्रिया',
  //   'नतीजा',
  //   'स्वीकार करना',
  //   'विचार करना',
  //   'समर्पित',
  //   'औचित्य',
  //   'उपेक्षा करना',
  //   'राज़ी करना',
  //   'धीरे-धीरे',
  //   'उलझाव से',
  //   'विशेष रूप से',
  //   'तत्काल',
  //   'मोटे तौर पर',
  //   'पर्याप्त रूप से',
  //   'ज़िद्दी',
  //   'विस्तृत',
  //   'रमणीय',
  //   'सावधान',
  //   'अनिच्छुक',
  //   'महत्वपूर्ण',
  // ],
  // tr: [
  //   'bütünlük',
  //   'dayanıklılık',
  //   'eşik',
  //   'eğilim',
  //   'yankı',
  //   'sonuç',
  //   'kabullenmek',
  //   'dikkate almak',
  //   'adamak',
  //   'savunmak',
  //   'ihmal etmek',
  //   'ikna etmek',
  //   'gitgide',
  //   'dolaylı olarak',
  //   'özellikle',
  //   'derhal',
  //   'kabaca',
  //   'yeterince',
  //   'kalıcı',
  //   'kapsayıcı',
  //   'hoş',
  //   'dikkatli',
  //   'isteksiz',
  //   'önemli',
  // ],
  sv: [
    'integritet',
    'elasticitet',
    'tröskel',
    'disposition',
    'återverkningar',
    'resultat',
    'erkänna',
    'överväga',
    'ägna',
    'rättfärdiga',
    'försummelse',
    'övertyga',
    'gradvis',
    'implicit',
    'i synnerhet',
    'omedelbart',
    'ungefär',
    'tillräckligt',
    'beständig',
    'omfattande',
    'härlig',
    'försiktig',
    'motvillig',
    'signifikant',
  ],
  no: [
    'integritet',
    'motstandskraft',
    'terskel',
    'disposisjon',
    'ettervirkning',
    'utfall',
    'bekrefte',
    'vurdere',
    'vie',
    'rettferdiggjøre',
    'forsømmelse',
    'overtale',
    'gradvis',
    'implisitt',
    'spesielt',
    'raskt',
    'omtrent',
    'tilstrekkelig',
    'vedvarende',
    'omfattende',
    'herlig',
    'forsiktig',
    'motvillig',
    'betydelig',
  ],
  // da: [
  //   'integritet',
  //   'modstandsdygtighed',
  //   'tærskel',
  //   'disposition',
  //   'eftervirkning',
  //   'resultat',
  //   'anerkende',
  //   'overveje',
  //   'hellige',
  //   'retfærdiggøre',
  //   'forsømme',
  //   'overtale',
  //   'gradvis',
  //   'implicit',
  //   'især',
  //   'prompte',
  //   'nogenlunde',
  //   'tilstrækkeligt',
  //   'vedvarende',
  //   'omfattende',
  //   'dejlig',
  //   'forsigtig',
  //   'modstræbende',
  //   'væsentlig',
  // ],
  fi: [
    'eheys',
    'joustavuutta',
    'kynnys',
    'taipumus',
    'jälkivaikutusta',
    'tulokset',
    'tunnustaa',
    'harkita',
    'omistautua',
    'perustella',
    'laiminlyödä',
    'suostutella',
    'vähitellen',
    'epäsuorasti',
    'erityisesti',
    'viipymättä',
    'karkeasti',
    'riittävästi',
    'jatkuvaa',
    'kattava',
    'ihana',
    'varovainen',
    'vastahakoinen',
    'merkittävä',
  ],
  // pl: [
  //   'uczciwość',
  //   'odporność',
  //   'próg',
  //   'usposobienie',
  //   'następstwo',
  //   'wynik',
  //   'uznawać',
  //   'rozważać',
  //   'poświęcać',
  //   'uzasadniać',
  //   'zaniedbanie',
  //   'namówić',
  //   'stopniowo',
  //   'bez zastrzeżeń',
  //   'szczególnie',
  //   'natychmiast',
  //   'mniej więcej',
  //   'wystarczająco',
  //   'uporczywy',
  //   'wyczerpujący',
  //   'zachwycający',
  //   'ostrożny',
  //   'niechętny',
  //   'istotne',
  // ],
  he: [
    'שְׁלֵמוּת',
    'כּוֹשֵׁר הִתאוֹשְׁשׁוּת',
    'סַף',
    'מֶזֶג',
    'השלכה',
    'תוֹצָאָה',
    'לְהוֹדוֹת',
    'לִשְׁקוֹל',
    'להקדיש',
    'לְהַצְדִיק',
    'הַזנָחָה',
    'לְשַׁכְנֵעַ',
    'בְּהַדרָגָה',
    'באופן מרומז',
    'במיוחד',
    'באופן מיידי',
    'בְּעֵרֶך',
    'במידה מספקת',
    'מַתְמִיד',
    'מַקִיף',
    'מְהַנֶה',
    'זָהִיר',
    'סרבן',
    'חשוב',
  ],
};

const analyzeItemToCardItem = (
  language: GoogleLanguage,
  analyzeItem: AnalysisItem
): SrsCard => {
  return {
    language,
    source: analyzeItem.source,
    ipa: analyzeItem.ipa ?? '',
    example: join(analyzeItem.examples ?? []),
    definition: join(analyzeItem.definitions),
    translation: analyzeItem.translation,
    partOfSpeech: analyzeItem.partOfSpeech ?? '',
    g: analyzeItem.g,
    tags: [],
    ...createSrsItem(),
  };
};

export const generateAppPredefinedCards = async () => {
  for (let [sourceLanguage, words] of Object.entries(languageWords)) {
    console.log({ sourceLanguage, words });
    for (let targetLanguage of [...ChatGPTLanguages, 'hy', 'ka', 'kk', 'az']) {
      const fileName = `${__dirname}/mobileAppPredefinedCardsGenerator/${sourceLanguage}-${targetLanguage}.ts`;

      if (existsSync(fileName)) {
        continue;
      }

      let cards: CardItem[] = [];
      const createCard = makeCreate(cards);

      for (let word of words) {
        const directTranslationResult = await buildDirectResult({
          payload: {
            source: word,
            sourceLanguage: sourceLanguage as GoogleLanguage,
            targetLanguage: targetLanguage as GoogleLanguage,
          },
        });

        if (directTranslationResult.success === false) {
          console.log(directTranslationResult);
          throw directTranslationResult;
        }

        let itemCandidate = directTranslationResult.value.items.find(
          (i) => i.ipa
        );

        if (!itemCandidate) {
          itemCandidate = directTranslationResult.value.items[0];
        }

        createCard(
          analyzeItemToCardItem(sourceLanguage as GoogleLanguage, itemCandidate)
        );
      }

      writeFileSync(
        fileName,
        `import { CardItem } from '@vocably/model';

export const predefinedMultiChoiceOptions: CardItem[] = ${JSON.stringify(
          cards
        )};
  `
      );
    }
  }
};
