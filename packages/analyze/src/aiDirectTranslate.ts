import {
  chatGptRequest,
  GPT_4O,
  GPT_4O_MINI,
  OpenAiModel,
} from '@vocably/lambda-shared';
import {
  ChatGPTLanguage,
  GoogleLanguage,
  languageList,
  Result,
  Translation,
} from '@vocably/model';
import {
  AiTranslation,
  isAiTranslation,
  resultExamples,
} from './aiDirectTranslateConstants';
import { fallback } from './fallback';

type Payload = {
  source: string;
  sourceLanguage: ChatGPTLanguage;
  targetLanguage: GoogleLanguage;
};

const internalAiDirectTranslate = async (
  payload: Payload,
  model: OpenAiModel
): Promise<Result<Translation>> => {
  const source = truncateAsIs(payload.source, 500);

  const example: AiTranslation = resultExamples[payload.sourceLanguage][
    payload.targetLanguage
  ] ?? {
    fixedSource: 'hedgehog',
    translation: 'ёж',
    partOfSpeech: 'noun',
  };

  const diacriticMarks = !['en', 'nl', 'he'].includes(payload.sourceLanguage)
    ? ', fix diacritic marks'
    : '';

  const prompt = [
    `Translate the ${languageList[payload.sourceLanguage]} word/phrase`,
    `<word-or-phrase>${source}</word-or-phrase>`,
    `into ${languageList[payload.targetLanguage]}.`,
    `Provide the part of speech, fix spelling, preserve punctuation${diacriticMarks}.`,
    '',
    `Respond in JSON, as in example: ${JSON.stringify(example)}`,
  ].join('\n');

  const responseResult = await chatGptRequest({
    messages: [
      {
        role: 'system',
        content: `You are a ${languageList[payload.sourceLanguage]}-${
          languageList[payload.targetLanguage]
        } dictionary.`,
      },
      { role: 'user', content: prompt },
    ],
    model,
    timeoutMs: 3000,
  });

  if (!responseResult.success) {
    return responseResult;
  }

  const response = responseResult.value;

  if (!isAiTranslation(response)) {
    return {
      success: false,
      errorCode: 'OPENAI_UNEXPECTED_RESPONSE',
      reason: `Unexpected response from analyzer: ${JSON.stringify(response)}`,
    };
  }

  return {
    success: true,
    value: {
      source: response.fixedSource,
      target: response.translation,
      sourceLanguage: payload.sourceLanguage,
      targetLanguage: payload.targetLanguage,
      partOfSpeech: response.partOfSpeech,
      transcript: response.pinyin,
    },
  };
};

export const aiDirectTranslate = async (
  payload: Payload
): Promise<Result<Translation>> => {
  return fallback(internalAiDirectTranslate(payload, GPT_4O), () =>
    internalAiDirectTranslate(payload, GPT_4O_MINI)
  );
};

export const truncateAsIs = (text: string, length: number): string => {
  return text.replace(/[<>]/gm, '').slice(0, length);
};
