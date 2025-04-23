import { setStreak } from './setStreak';

describe('setStreak', () => {
  it('does not update the streak days if set today', () => {
    const result = setStreak(
      {
        days: 2,
        longestStreak: 2,
        lastPracticeDay: '0000-01-01',
        lastPracticeTimezone: 'Asia/Jerusalem',
      },
      '0000-01-01',
      'Asia/Jerusalem'
    );

    expect(result.days).toEqual(2);
    expect(result.longestStreak).toEqual(2);
  });

  it('increases the streak days when last update was yesterday', () => {
    const result = setStreak(
      {
        days: 2,
        longestStreak: 2,
        lastPracticeDay: '2024-12-31',
        lastPracticeTimezone: 'Asia/Jerusalem',
      },
      '2025-01-01',
      'Asia/Jerusalem'
    );

    expect(result.days).toEqual(3);
    expect(result.longestStreak).toEqual(3);
  });

  it('does not increases longest streak when the current one is not longest', () => {
    const result = setStreak(
      {
        days: 2,
        longestStreak: 4,
        lastPracticeDay: '2025-11-20',
        lastPracticeTimezone: 'Asia/Jerusalem',
      },
      '2025-11-21',
      'Asia/Jerusalem'
    );

    expect(result.days).toEqual(3);
    expect(result.longestStreak).toEqual(4);
  });

  it('sets streak to 1 when last practice day was before yesterday', () => {
    const result = setStreak(
      {
        days: 3,
        longestStreak: 4,
        lastPracticeDay: '2024-12-31',
        lastPracticeTimezone: 'Asia/Jerusalem',
      },
      '2025-01-02',
      'Asia/Jerusalem'
    );

    expect(result.days).toEqual(1);
    expect(result.longestStreak).toEqual(4);
  });
});
