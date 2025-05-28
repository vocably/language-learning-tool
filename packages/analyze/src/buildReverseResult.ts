import {
  AnalysisItem,
  DirectAnalysis,
  GoogleLanguage,
  Result,
  ReverseAnalysis,
  ReverseAnalyzePayload,
  Translation,
  ValidAnalysisItems,
} from '@vocably/model';
import { trimArticle } from '@vocably/sulna';
import { buildDirectResultLegacy } from './buildDirectResultLegacy';
import { combineTranslations } from './combineItems';
import { makeUniqueItems } from './makeUniqueItems';
import { reverseTranslate } from './reverseTranslate';
import { sortByTarget } from './sortByTarget';

type TranslationDirectResult = {
  translation: Translation;
  directTranslationResult: Result<DirectAnalysis>;
};

export const buildReverseResult = async (
  payload: ReverseAnalyzePayload
): Promise<Result<ReverseAnalysis>> => {
  const translationResults = await reverseTranslate(payload);

  if (translationResults.success === false) {
    return translationResults;
  }

  const directResults = await Promise.all(
    translationResults.value.map(
      async (translation): Promise<TranslationDirectResult> => {
        return {
          translation,
          directTranslationResult: await buildDirectResultLegacy({
            payload: {
              source: translation.target,
              target: languagesWithTarget.includes(payload.sourceLanguage)
                ? translation.source
                : undefined,
              sourceLanguage: payload.sourceLanguage,
              targetLanguage: payload.targetLanguage,
              partOfSpeech: translation.partOfSpeech,
              transcript: translation.transcript,
            },
            lexicalaParams: {
              morph: 'false',
              analyzed: 'false',
            },
          }),
        };
      }
    )
  );

  const translationItems = builtTranslationItems([
    directResults[0],
    ...directResults.slice(1),
  ]);

  return {
    success: true,
    value: {
      target: payload.target,
      source: directResults[0].translation.target,
      sourceLanguage: payload.sourceLanguage,
      targetLanguage: payload.targetLanguage,
      translation: {
        source: directResults[0].translation.target,
        sourceLanguage: payload.sourceLanguage,
        target: payload.target,
        targetLanguage: payload.targetLanguage,
        partOfSpeech: directResults[0].translation.partOfSpeech,
      },
      reverseTranslations: translationResults.value,
      items: makeUniqueItems(translationItems).sort(
        sortByTarget(payload.target)
      ),
    },
  };
};

const mergeItems = (
  language: string,
  candidate: AnalysisItem,
  items: ValidAnalysisItems
): ValidAnalysisItems => {
  const itemThatIsMatchedWithTheCandidate = items.find(
    (item) =>
      item.partOfSpeech === candidate.partOfSpeech &&
      trimArticle(language, item.source).source ===
        trimArticle(language, candidate.source).source
  );

  if (itemThatIsMatchedWithTheCandidate === undefined) {
    return [candidate, ...items];
  }

  const result = items.map((item) => {
    if (
      itemThatIsMatchedWithTheCandidate === item &&
      candidate.translation.toLowerCase() !== item.translation.toLowerCase()
    ) {
      return {
        ...item,
        translation: combineTranslations(
          candidate.translation,
          item.translation
        ),
      };
    }

    return item;
  });

  return [result[0], ...result.slice(1)];
};

const builtTranslationItems = (
  translationDirectResults: [
    TranslationDirectResult,
    ...TranslationDirectResult[]
  ]
): ValidAnalysisItems => {
  const results = translationDirectResults.flatMap((result): AnalysisItem[] => {
    const itemCandidate: AnalysisItem = {
      source: result.translation.target,
      translation: result.translation.source,
      partOfSpeech: result.translation.partOfSpeech,
      definitions: [],
    };

    const language = result.translation.targetLanguage;

    if (result.directTranslationResult.success) {
      return mergeItems(
        language,
        itemCandidate,
        result.directTranslationResult.value.items
      );
    }

    return [itemCandidate];
  });

  return [results[0], ...results.slice(1)];
};

// We can't rely on Google Translate for these languages, thus,
// it's better to provide the AI translation as a direct target
// for the rest of the languages, it should be fine.
const languagesWithTarget: GoogleLanguage[] = ['ja', 'zh', 'zh-TW', 'ko'];
