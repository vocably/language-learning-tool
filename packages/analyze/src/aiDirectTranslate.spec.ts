import '@vocably/jest';
import { aiDirectTranslate } from './aiDirectTranslate';
import { configureTestAnalyzer } from './test/configureTestAnalyzer';

configureTestAnalyzer();

describe('aiDirectTranslate', () => {
  if (process.env.TEST_SKIP_SPEC === 'true') {
    it('skip spec testing', () => {});
    return;
  }

  it('properly translate a word', async () => {
    const result = await aiDirectTranslate({
      source: 'cover',
      sourceLanguage: 'en',
      targetLanguage: 'ru',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.source).toBe('cover');
    expect(result.value.partOfSpeech).toBe('noun');
    expect(result.value.sourceLanguage).toBe('en');
    expect(result.value.targetLanguage).toBe('ru');
  });

  it('properly translates and corrects', async () => {
    const result = await aiDirectTranslate({
      source: 'betise',
      sourceLanguage: 'fr',
      targetLanguage: 'en',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.source).toBe('bêtise');
    expect(result.value.partOfSpeech).toBe('noun');
  });

  it('properly translates and corrects russian', async () => {
    const result = await aiDirectTranslate({
      source: 'еж',
      sourceLanguage: 'ru',
      targetLanguage: 'en',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.source).toHaveSomeOf(['ёж', 'еж']);
    expect(result.value.target).toEqual('hedgehog');
    expect(result.value.partOfSpeech).toBe('noun');
  });

  it('properly translates and corrects portuguese', async () => {
    const result = await aiDirectTranslate({
      source: 'dadiva',
      sourceLanguage: 'pt',
      targetLanguage: 'en',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.source).toBe('dádiva');
    expect(result.value.partOfSpeech).toBe('noun');
  });

  it('properly translates and corrects english to russian', async () => {
    const result = await aiDirectTranslate({
      source: 'Something, and something else.',
      sourceLanguage: 'en',
      targetLanguage: 'ru',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.source).toBe('Something, and something else.');
    expect(result.value.target).toHaveSomeOf([
      'Что-то, и что-то еще.',
      'Что-то, и что-то другое.',
      'Что-то и что-то ещё.',
      'Что-то, и что-то ещё.',
    ]);
    expect(result.value.partOfSpeech).toBe('phrase');
  });

  it('properly translates and corrects pt', async () => {
    const result = await aiDirectTranslate({
      source: 'e sua cidade',
      sourceLanguage: 'pt',
      targetLanguage: 'ru',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.source).toBe('e sua cidade');
    expect(result.value.target).toHaveSomeOf(['и ваш город', 'и его город']);
    expect(result.value.partOfSpeech).toBe('phrase');
  });

  it('fixes english spelling', async () => {
    const result = await aiDirectTranslate({
      source: 'sissors',
      sourceLanguage: 'en',
      targetLanguage: 'ru',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.source).toBe('scissors');
    expect(result.value.target).toHaveSomeOf(['ножницы']);
    expect(result.value.partOfSpeech).toBe('noun');
  });

  it('translates from german to ukrainian', async () => {
    const result = await aiDirectTranslate({
      source: 'scharfes Essen',
      sourceLanguage: 'de',
      targetLanguage: 'uk',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    console.log(result);

    expect(result.value.source).toBe('scharfes Essen');
    expect(result.value.target).toHaveSomeOf(['гостра їжа']);
    expect(result.value.partOfSpeech).toHaveSomeOf('noun, noun phrase');
  });

  it('fixes osccillation', async () => {
    const result = await aiDirectTranslate({
      source: 'oscilation',
      sourceLanguage: 'en',
      targetLanguage: 'uk',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    console.log(result);

    expect(result.value.source).toBe('oscillation');
    expect(result.value.target).toHaveSomeOf(['коливання', 'осциляція']);
    expect(result.value.partOfSpeech).toBe('noun');
  });

  it('fixes voordeel', async () => {
    const result = await aiDirectTranslate({
      source: 'vordeel',
      sourceLanguage: 'nl',
      targetLanguage: 'ru',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    console.log(result);

    expect(result.value.source).toBe('voordeel');
    expect(result.value.target).toHaveSomeOf(['преимущество']);
    expect(result.value.partOfSpeech).toBe('noun');
  });

  it('guinea fowl', async () => {
    const result = await aiDirectTranslate({
      source: 'guinea fowl',
      sourceLanguage: 'en',
      targetLanguage: 'ru',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    console.log(result);

    expect(result.value.source).toBe('guinea fowl');
    expect(result.value.target).toHaveSomeOf(['цесарка']);
    expect(result.value.partOfSpeech).toBe('noun');
  });

  it('pinyin for chinese traditional', async () => {
    const result = await aiDirectTranslate({
      source: '星期二',
      sourceLanguage: 'zh-TW',
      targetLanguage: 'ru',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.transcript).toBe("xīngqī'èr");
  });

  it('pinyin for chinese simplified', async () => {
    const result = await aiDirectTranslate({
      source: '星期二',
      sourceLanguage: 'zh',
      targetLanguage: 'ru',
    });

    if (result.success !== true) {
      expect(result.reason).toBeFalsy();
      return;
    }

    expect(result.value.transcript).toBe("xīngqī'èr");
  });
});
