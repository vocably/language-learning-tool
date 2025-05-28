import { inspect } from '@vocably/node-sulna';
import { generateMnemonicFunction } from './index';

// @ts-ignore
let mockEvent: APIGatewayProxyEvent = {};

xdescribe('integration check for generate-mnemonic lambda', () => {
  jest.setTimeout(30000);

  if (process.env.TEST_SKIP_SPEC === 'true') {
    it('skip spec testing', () => {});
    return;
  }

  it('execute generate-mnemonic lambda', async () => {
    mockEvent.body = JSON.stringify({
      sourceLanguage: 'nl',
      targetLanguage: 'en',
      card: {
        source: 'aanranden',
        partOfSpeech: 'verb',
      },
    });
    const result = await generateMnemonicFunction(mockEvent);
    console.log(inspect({ result }));
    expect(result.statusCode).toEqual(200);
  });

  it('execute generate-mnemonic ukrainian', async () => {
    mockEvent.body = JSON.stringify({
      sourceLanguage: 'en',
      targetLanguage: 'uk',
      card: {
        source: 'peculiar',
        partOfSpeech: 'adjective',
      },
    });
    const result = await generateMnemonicFunction(mockEvent);
    expect(result.statusCode).toEqual(200);
  });

  it('conceivable', async () => {
    mockEvent.body = JSON.stringify({
      sourceLanguage: 'en',
      targetLanguage: 'ru',
      card: {
        source: 'conceivable',
        partOfSpeech: 'noun',
      },
    });
    const result = await generateMnemonicFunction(mockEvent);
    console.log(inspect({ result }));
    expect(result.statusCode).toEqual(200);
  });

  it('opwinding', async () => {
    mockEvent.body = JSON.stringify({
      sourceLanguage: 'nl',
      targetLanguage: 'en',
      card: {
        source: 'de opwinding',
        partOfSpeech: 'noun',
      },
    });
    const result = await generateMnemonicFunction(mockEvent);
    console.log(inspect({ result }));
    expect(result.statusCode).toEqual(200);
  });

  it('guedkeuring', async () => {
    mockEvent.body = JSON.stringify({
      sourceLanguage: 'nl',
      targetLanguage: 'en',
      card: {
        source: 'de goedkeuring',
        partOfSpeech: 'noun',
      },
    });
    const result = await generateMnemonicFunction(mockEvent);
    console.log(inspect({ result }));
    expect(result.statusCode).toEqual(200);
  });
});
