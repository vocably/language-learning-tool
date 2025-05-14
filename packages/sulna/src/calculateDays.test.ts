import { calculateDays } from './calculateDays';

describe('days', () => {
  it('works on two days', () => {
    const todayTs = Date.UTC(2025, 2, 14);
    const dueDate = Date.UTC(2025, 2, 16);

    expect(calculateDays(todayTs, dueDate)).toEqual(2);
  });
});
