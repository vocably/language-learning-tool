import { addDays } from './date';

describe('date', () => {
  it('sub days', () => {
    const result = addDays('2024-01-01', -2);
    expect(result).toEqual('2023-12-30');
  });

  it('pads zeros', () => {
    const result = addDays('2024-01-03', -2);
    expect(result).toEqual('2024-01-01');
  });
});
