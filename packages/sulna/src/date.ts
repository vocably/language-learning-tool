export const dateToString = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const dateFromString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const addDays = (dateString: string, days: number): string => {
  const date = dateFromString(dateString);
  date.setDate(date.getDate() + days);

  return dateToString(date);
};
