import {
  GoogleLanguage,
  isChatGPTLanguage,
  Result,
  Translation,
} from '@vocably/model';
import { aiDirectTranslate } from './aiDirectTranslate';
import { fallback } from './fallback';
import { googleTranslate } from './googleTranslate';
import {
  isContextPayload,
  itMakesSense,
  translateFromContext,
} from './translateFromContext';

type Payload = {
  source: string;
  targetLanguage: GoogleLanguage;
  sourceLanguage: GoogleLanguage;
  target?: string;
  context?: string;
  partOfSpeech?: string;
  transcript?: string;
};

export const translate = async (
  payload: Payload
): Promise<Result<Translation>> => {
  if (payload.source && payload.target) {
    return {
      success: true,
      value: {
        source: payload.source,
        target: payload.target ?? payload.source,
        sourceLanguage: payload.sourceLanguage,
        targetLanguage: payload.targetLanguage,
        partOfSpeech: payload.partOfSpeech,
        transcript: payload.transcript,
      },
    };
  }

  if (payload.sourceLanguage === payload.targetLanguage) {
    return {
      success: true,
      value: {
        source: payload.source,
        target: payload.target ?? payload.source,
        sourceLanguage: payload.sourceLanguage,
        targetLanguage: payload.targetLanguage,
        partOfSpeech: payload.partOfSpeech,
        transcript: payload.transcript,
      },
    };
  }

  if (!isChatGPTLanguage(payload.sourceLanguage)) {
    return googleTranslate(
      payload.source,
      payload.sourceLanguage,
      payload.targetLanguage
    );
  }

  if (!isContextPayload(payload) || !itMakesSense(payload)) {
    return fallback(
      aiDirectTranslate({
        sourceLanguage: payload.sourceLanguage,
        source: payload.source,
        targetLanguage: payload.targetLanguage,
      }),
      () =>
        googleTranslate(
          payload.source,
          payload.sourceLanguage,
          payload.targetLanguage
        )
    );
  }

  return fallback(translateFromContext(payload), () =>
    googleTranslate(
      payload.source,
      payload.sourceLanguage,
      payload.targetLanguage
    )
  );
};
