export const buildDaysLeft =
  (today: Date) =>
  (dueTs: number): string => {
    const dueDate = new Date(dueTs);
    return dueDate.toString();
  };
