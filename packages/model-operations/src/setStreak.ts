import { StudyStreak } from '@vocably/model';
import { addDays } from '@vocably/sulna';

export const setStreak = (
  existingStreak: StudyStreak,
  today: string,
  timezone: string
): StudyStreak => {
  if (existingStreak.lastStudyDay === today) {
    return existingStreak;
  }

  if (existingStreak.lastStudyDay === addDays(today, -1)) {
    return {
      days: existingStreak.days + 1,
      longestStreak: Math.max(
        existingStreak.days + 1,
        existingStreak.longestStreak
      ),
      lastStudyDay: today,
      lastStudyTimezone: timezone,
    };
  }

  return {
    days: 1,
    longestStreak: Math.max(existingStreak.longestStreak, 1),
    lastStudyDay: today,
    lastStudyTimezone: timezone,
  };
};
