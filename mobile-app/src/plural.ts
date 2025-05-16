export const plural = (n: number, singular: string) => {
  return `${n} ${singular}${n !== 1 ? 's' : ''}`;
};
