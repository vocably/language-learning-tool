import '@vocably/jest';
import { aiReverseTranslate, truncateText } from './aiReverseTranslate';
import { configureTestAnalyzer } from './test/configureTestAnalyzer';

configureTestAnalyzer();

describe('aiReverseTranslate', () => {
  if (process.env.TEST_SKIP_SPEC === 'true') {
    it('skip spec testing', () => {});
    return;
  }

  it('gets all the Dutch meanings of the word or phrase "cover"', async () => {
    const result = await aiReverseTranslate({
      target: 'cover',
      sourceLanguage: 'nl',
      targetLanguage: 'en',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.length).toBeGreaterThanOrEqual(3);
    expect(result.value[0].target).toHaveSomeOf(
      'deksel, cover, bedekking, omslag, bedekken, coveren, dekken'
    );
    expect(result.value[1].target).toHaveSomeOf(
      'deksel, cover, bedekking, omslag, bedekken, coveren, dekken'
    );
    expect(result.value[2].target).toHaveSomeOf(
      'deksel, cover, bedekking, omslag, bedekken, coveren, dekken'
    );
  });

  it('gets all the Dutch meanings of the word or phrase "phone case"', async () => {
    const result = await aiReverseTranslate({
      target: 'phone case',
      sourceLanguage: 'nl',
      targetLanguage: 'en',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value[0].target).toHaveSomeOf([
      'telefoonhoes',
      'telefoonhoesje',
    ]);
    expect(result.value[0].source).toEqual('phone case');
    expect(result.value[1].target).toEqual('telefooncase');
    expect(result.value[1].source).toEqual('phone case');
  });

  it('translates questions', async () => {
    const result = await aiReverseTranslate({
      target: 'Всё в силе?',
      sourceLanguage: 'en',
      targetLanguage: 'ru',
    });

    expect(result.success).toBeTruthy();

    if (!result.success) {
      return;
    }

    expect(result.value[0].target).toHaveSomeOf([
      'Is everything still in effect?',
      'Is everything in force?',
      'Is everything still on?',
      'Is everything in place?',
    ]);
  });

  it('translates from ukrainian to german', async () => {
    const result = await aiReverseTranslate({
      target: 'гостра їжа',
      sourceLanguage: 'de',
      targetLanguage: 'uk',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    console.log(result);

    expect(result.value.length).toBeGreaterThanOrEqual(1);
    expect(result.value[0].target).toHaveSomeOf([
      'scharfes Essen',
      'scharfe Speisen',
    ]);
  });

  describe('truncateText', () => {
    it('keeps all the punctuation but angle braces', () => {
      expect(truncateText('a, b, </cd>, >, <, something', 100)).toEqual(
        'a, b, /cd, , , something'
      );
    });

    it('truncates the string while keeping the punctuation', () => {
      expect(truncateText('a, b, c, d, e, f, g, h', 10)).toEqual('a, b, c, d');
    });
  });

  describe('pinyin', () => {
    it('chinese traditional', async () => {
      const result = await aiReverseTranslate({
        target: 'Tuesday',
        sourceLanguage: 'zh-TW',
        targetLanguage: 'ru',
      });

      if (result.success !== true) {
        expect(result.reason).toBeFalsy();
        return;
      }

      expect(result.value.length).toBeGreaterThanOrEqual(1);
      expect(result.value[0].transcript).toEqual('xīngqī èr');
    });

    it('chinese simplified', async () => {
      const result = await aiReverseTranslate({
        target: 'Tuesday',
        sourceLanguage: 'zh',
        targetLanguage: 'ru',
      });

      if (result.success !== true) {
        expect(result.reason).toBeFalsy();
        return;
      }

      expect(result.value.length).toBeGreaterThanOrEqual(1);
      expect(result.value[0].transcript).toEqual('xīngqī èr');
    });
  });
});
