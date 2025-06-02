import { parseJson } from './parseJson';

describe('parseJson', () => {
  it('parses results from ChatGPT 4o', () => {
    const result = parseJson(
      '```json\n{"translations": ["банк", \n"берег", \n"ряд"]}\n```'
    );
    console.log(result);
    if (result.success === false) {
      expect('valid json parse result').toEqual('non valid json parse result');
      return;
    }

    expect(result.value).toEqual({
      translations: ['банк', 'берег', 'ряд'],
    });
  });

  it('parses nested objects', () => {
    const result = parseJson('```json\n{"obj": {"банк": \n"берег"}}\n```');
    console.log(result);
    if (result.success === false) {
      expect('valid json parse result').toEqual('non valid json parse result');
      return;
    }

    expect(result.value).toEqual({
      obj: { банк: 'берег' },
    });
  });
});
