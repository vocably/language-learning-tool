import {
  AnalysisItem,
  DirectAnalysis,
  Result,
  Translation,
} from '@vocably/model';
import { isRomaji, toRomaji } from 'wanakana';
import { lexicala } from '../lexicala';
import { normalizeHeadword } from '../lexicala/normalizeHeadword';
import { extractJapaneseHeadwords } from './extractJapaneseHeadwords';
import { translateJapaneseHeadwords } from './translateJapaneseHeadwords';

const buildTranslationResult = (translation: Translation): DirectAnalysis => {
  const romaji = toRomaji(translation.source);
  let definitions: string[] = [];

  if (isRomaji(romaji)) {
    definitions.push(`[ ${romaji} ]`);
  }

  return {
    source: translation.source,
    translation,
    items: [
      {
        source: translation.source,
        translation: translation.target,
        definitions,
        partOfSpeech: translation.partOfSpeech,
      },
    ],
  };
};

type Payload = {
  translation: Translation;
};

export const buildDirectJapaneseResult = async ({
  translation,
}: Payload): Promise<Result<DirectAnalysis>> => {
  const lexicalaResult = await lexicala('ja', translation.source, {
    analyzed: 'false',
    morph: 'false',
  });

  if (lexicalaResult.success === false || lexicalaResult.value.length === 0) {
    return {
      success: true,
      value: buildTranslationResult(translation),
    };
  }

  const analysisItemsResults: Result<AnalysisItem>[] = await Promise.all(
    lexicalaResult.value
      .map(normalizeHeadword(translation.source))
      .map(async (lexicalaItem): Promise<Result<AnalysisItem>> => {
        const japaneseHeadwords = extractJapaneseHeadwords(
          lexicalaItem.headword
        );
        const translationResult = await translateJapaneseHeadwords({
          translation,
          japaneseHeadwords,
          lexicalaItem,
        });

        if (translationResult.success === false) {
          return translationResult;
        }

        let definitions: string[] = [];

        const source = japaneseHeadwords.kanji ?? japaneseHeadwords.hiragana;
        if (japaneseHeadwords.kanji && japaneseHeadwords.hiragana) {
          definitions.push(`[ ${japaneseHeadwords.hiragana} ]`);
        }

        definitions.push(`[ ${japaneseHeadwords.romaji} ]`);

        return {
          success: true,
          value: {
            source,
            definitions,
            partOfSpeech: lexicalaItem.headword.pos,
            translation: translationResult.value,
          },
        };
      })
  );

  const analysisItems: AnalysisItem[] = analysisItemsResults
    .filter((r) => r.success === true)
    // @ts-ignore
    .map((r) => r.value);

  if (analysisItems.length === 0) {
    return {
      success: true,
      value: buildTranslationResult(translation),
    };
  }

  return {
    success: true,
    value: {
      source: translation.source,
      translation,
      items: [analysisItems[0], ...analysisItems.slice(1)],
    },
  };
};
