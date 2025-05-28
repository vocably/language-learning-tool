import { chatGptRequest, GPT_4O_MINI } from '@vocably/lambda-shared';
import {
  GoogleLanguage,
  languageList,
  Result,
  Translation,
} from '@vocably/model';
import { isSafeObject } from '@vocably/sulna';
import { isArray } from 'lodash-es';

type Payload = {
  target: string;
  sourceLanguage: GoogleLanguage;
  targetLanguage: GoogleLanguage;
};

type AiTranslationVariant = {
  translation: string;
  partOfSpeech: string;
  transcript: string;
};

type AiTranslationResult = {
  translations: [AiTranslationVariant, ...AiTranslationVariant[]];
};

type ValidTranslations = [Translation, ...Translation[]];

export const truncateText = (text: string, length: number): string => {
  return text.replace(/[<>]/gm, '').slice(0, length);
};

export const aiReverseTranslate = async (
  payload: Payload
): Promise<Result<ValidTranslations>> => {
  const target = truncateText(payload.target, 100);
  const prompt = [
    `Provide all the possible translations of the ${
      languageList[payload.targetLanguage]
    } word/phrase`,
    `<input>${target}</input>`,
    `into ${languageList[payload.sourceLanguage]}.`,
    `For each translation provide part of speech in English`,
    '',
    `Respond in JSON, as in example: ${JSON.stringify({
      translations: [
        { translation: 'word 1', partOfSpeech: 'noun', transcript: 'word 1' },
        { translation: 'word 2', partOfSpeech: 'noun', transcript: 'word 2' },
      ],
    })}`,
  ].join('\n');

  const responseResult = await chatGptRequest({
    messages: [
      {
        role: 'system',
        content:
          'You are a smart language assistant. Only respond to questions about vocabulary and translations.',
      },
      { role: 'user', content: prompt },
    ],
    model: GPT_4O_MINI,
  });

  if (!responseResult.success) {
    return responseResult;
  }

  const translationData = responseResult.value;

  if (!isValidResult(translationData)) {
    return {
      success: false,
      errorCode: 'OPENAI_UNEXPECTED_RESPONSE',
      reason: `The provided result is not an array of valid AiTranslationVariant objects`,
      extra: translationData,
    };
  }

  const translations = translationData.translations
    .map(sanitizeTranslationVariant(payload))
    .map((translationVariant) => ({
      source: payload.target,
      sourceLanguage: payload.targetLanguage,
      targetLanguage: payload.sourceLanguage,
      target: translationVariant.translation,
      partOfSpeech: translationVariant.partOfSpeech,
      transcript: translationVariant.transcript,
    }));

  return {
    success: true,
    value: [translations[0], ...translations.slice(1)],
  };
};

const isValidResult = (result: any): result is AiTranslationResult => {
  if (!isSafeObject(result)) {
    return false;
  }

  if (!('translations' in result) || !isArray(result['translations'])) {
    return false;
  }

  return (
    result['translations'].length > 0 &&
    result['translations'].every(isTranslationVariant)
  );
};

const isTranslationVariant = (data: any): data is AiTranslationVariant => {
  return (
    isSafeObject(data) &&
    typeof data['translation'] === 'string' &&
    typeof data['partOfSpeech'] === 'string'
  );
};

const sanitizeTranslationVariant =
  (payload: Payload) =>
  (translationVariant: AiTranslationVariant): AiTranslationVariant => {
    if (
      payload.sourceLanguage === 'en' &&
      translationVariant.partOfSpeech === 'verb'
    ) {
      return {
        ...translationVariant,
        translation: translationVariant.translation.replace(/to /i, ''),
      };
    }

    return translationVariant;
  };
