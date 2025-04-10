import {
  DirectAnalysis,
  DirectAnalyzePayload,
  Result,
  Translation,
} from '@vocably/model';
import { trimArticle } from '@vocably/sulna';
import { buildDirectJapaneseResult } from './buildDirectResult/buildDirectJapaneseResult';
import { combineItems } from './combineItems';
import { filterOutByPartOfSpeech } from './filterOutByPartOfSpeech';
import { fitsTheSize } from './fitsTheSize';
import { getWords } from './isOneWord';
import { lexicala, LexicalaOverriddenParams } from './lexicala';
import { languageToLexicalaLanguage } from './lexicala/lexicalaLanguageMapper';
import { lexicalaSearchResultToAnalysisItem } from './lexicala/lexicalaSearchResultToAnalysisItem';
import { normalizeHeadword } from './lexicala/normalizeHeadword';
import { lexicalaItemHasDefinitionOrCanBeTranslated } from './lexicalaItemHasDefinitionOrCanBeTranslated';
import { prependTranslation } from './prependTranslation';
import { sanitizePayload } from './sanitizePayload';
import { sortByRelevance } from './sortByRelevance';
import { translate } from './translate';
import { translationToAnalysisItem } from './translationToAnalyzeItem';
import { wordDictionary } from './word-dictionary';
import { wordDictionaryResultToAnalysisItems } from './wordDictionaryResultToItems';

type Options = {
  payload: DirectAnalyzePayload;
  lexicalaParams?: LexicalaOverriddenParams;
};

export const buildDirectResultLegacy = async ({
  payload: rawPayload,
  lexicalaParams,
}: Options): Promise<Result<DirectAnalysis>> => {
  const payload = sanitizePayload(rawPayload);

  const translationResult = await translate(payload);

  if (translationResult.success === false) {
    return translationResult;
  }

  const translation: Translation = {
    ...translationResult.value,
    partOfSpeech: translationResult.value.partOfSpeech ?? payload.partOfSpeech,
    sourceLanguage:
      translationResult.value.sourceLanguage ?? payload.sourceLanguage,
  };

  if (translation.sourceLanguage === 'ja') {
    return buildDirectJapaneseResult({ translation });
  }

  const lexicalaLanguage = languageToLexicalaLanguage(
    translation.sourceLanguage
  );

  if (lexicalaLanguage === null) {
    return {
      success: true,
      value: {
        source: payload.source,
        targetLanguage: payload.targetLanguage,
        sourceLanguage: payload.sourceLanguage,
        translation: translationResult.value,
        items: [translationToAnalysisItem(translation)],
      },
    };
  }

  const trimmedArticle = trimArticle(
    translation.sourceLanguage,
    translation.source
  );

  const numberOfWords = getWords(trimmedArticle.source).length;
  if (numberOfWords > 2) {
    return {
      success: true,
      value: {
        source: payload.source,
        targetLanguage: payload.targetLanguage,
        sourceLanguage: payload.sourceLanguage,
        translation: translation,
        items: [translationToAnalysisItem(translation)],
      },
    };
  }

  const results = await Promise.all([
    lexicala(
      lexicalaLanguage,
      trimmedArticle.source,
      numberOfWords === 1
        ? lexicalaParams
        : {
            morph: 'false',
            analyzed: 'false',
          }
    ),
    lexicalaLanguage === 'en' ? wordDictionary(trimmedArticle.source) : null,
  ]);

  const lexicalaResult = results[0];

  if (lexicalaResult.success === false || lexicalaResult.value.length === 0) {
    if (lexicalaResult.success === false) {
      console.error('Lexicala error', lexicalaResult);
    }

    if (results[1] === null) {
      return {
        success: true,
        value: {
          source: payload.source,
          targetLanguage: payload.targetLanguage,
          sourceLanguage: payload.sourceLanguage,
          translation: translation,
          items: prependTranslation([], translation),
        },
      };
    }

    if (results[1].success === false) {
      console.error('Word dictionary error', results[1]);
      return {
        success: true,
        value: {
          source: payload.source,
          targetLanguage: payload.targetLanguage,
          sourceLanguage: payload.sourceLanguage,
          translation: translation,
          items: prependTranslation([], translation),
        },
      };
    }

    return {
      success: true,
      value: {
        source: payload.source,
        targetLanguage: payload.targetLanguage,
        sourceLanguage: payload.sourceLanguage,
        translation: translation,
        items: prependTranslation(
          await Promise.all(
            wordDictionaryResultToAnalysisItems({
              result: results[1].value,
              payload,
              originalTranslation: translation,
            })
          ),
          translation
        ),
      },
    };
  }

  return {
    success: true,
    value: {
      source: payload.source,
      translation: translation,
      targetLanguage: payload.targetLanguage,
      sourceLanguage: payload.sourceLanguage,
      items: prependTranslation(
        (
          await Promise.all(
            filterOutByPartOfSpeech(
              lexicalaResult.value
                .map(normalizeHeadword(translation.source))
                .filter(fitsTheSize(translation.source))
                .filter(
                  lexicalaItemHasDefinitionOrCanBeTranslated(translation)
                ),
              payload.partOfSpeech
            ).map(lexicalaSearchResultToAnalysisItem(translation))
          )
        )
          .reduce(combineItems, [])
          .sort(sortByRelevance(translation)),
        translation
      ),
    },
  };
};
