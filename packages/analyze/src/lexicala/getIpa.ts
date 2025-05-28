import { LexicalaSearchResultItemWithNormalHeadword } from './normalizeHeadword';

export const getIpa = (
  item: LexicalaSearchResultItemWithNormalHeadword
): string => {
  if (item.language === 'zh' || item.language === 'tw') {
    const pinyin = item.headword.alternative_scripts?.find(
      (a) => a.type === 'pinyin'
    );
    return pinyin ? pinyin?.text : '';
  }

  if (!item.headword.pronunciation?.value) {
    return '';
  }

  return item.headword.pronunciation?.value.split(', ')[0];
};
