export const calculateDays = (todayTs: number, dueDate: number): number => {
  return Math.ceil((dueDate - todayTs) / 86_400_000);
};
