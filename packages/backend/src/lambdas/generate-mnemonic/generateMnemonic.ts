import {
  chatGptRequest,
  GPT_4O,
  setOpenAIConfig,
} from '@vocably/lambda-shared';
import {
  GenerateMnemonicPayload,
  GenerateMnemonicResult,
  languageList,
  Result,
} from '@vocably/model';
import { trimLanguage } from '@vocably/sulna';
import { stripCode } from './stripCode';

setOpenAIConfig({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateMnemonic = async (
  payload: GenerateMnemonicPayload
): Promise<Result<GenerateMnemonicResult>> => {
  const prompt = [
    `Generate a mnemonic rule to remember an ${trimLanguage(
      languageList[payload.sourceLanguage]
    )} ${payload.card.partOfSpeech || 'word'}`,
    `<word>`,
    payload.card.source,
    `</word>`,
    payload.targetLanguage !== 'en'
      ? `Response in ${trimLanguage(languageList[payload.targetLanguage])}`
      : '',
    payload.sourceLanguage != payload.targetLanguage
      ? 'Incorporate the translation in response'
      : '',
    `Avoid abbreviations or acronyms. Instead, create vivid, story-based, or image-based associations that connect the word\'s sound or meaning to something concrete or funny.
Make sure the mnemonic helps recall both the pronunciation and the definition of the word.`,
    'Highlight with markdown.',
  ]
    .filter((line) => !!line)
    .join('\n');

  const responseResult = await chatGptRequest({
    responseFormat: {
      type: 'text',
    },
    messages: [
      {
        role: 'system',
        content:
          'You are a smart language assistant. Only respond to questions about vocabulary and translations.',
      },
      { role: 'user', content: prompt },
    ],
    model: GPT_4O,
    temperature: 2,
  });

  if (responseResult.success === false) {
    return responseResult;
  }

  return {
    success: true,
    value: {
      text: stripCode(responseResult.value),
    },
  };
};
