import { StudyStreak } from '@vocably/model';
import { addDays } from '@vocably/sulna';

export const setStreak = (
  existingStreak: StudyStreak,
  today: string,
  timezone: string
): StudyStreak => {
  if (existingStreak.lastPracticeDay === today) {
    return existingStreak;
  }

  if (existingStreak.lastPracticeDay === addDays(today, -1)) {
    return {
      days: existingStreak.days + 1,
      longestStreak: Math.max(
        existingStreak.days + 1,
        existingStreak.longestStreak
      ),
      lastPracticeDay: today,
      lastPracticeTimezone: timezone,
    };
  }

  return {
    days: 1,
    longestStreak: Math.max(existingStreak.longestStreak, 1),
    lastPracticeDay: today,
    lastPracticeTimezone: timezone,
  };
};
