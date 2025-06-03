export const plural = (n: number, singular: string, showNumber = true) => {
  return `${showNumber ? n + ' ' : ''}${singular}${n !== 1 ? 's' : ''}`;
};
