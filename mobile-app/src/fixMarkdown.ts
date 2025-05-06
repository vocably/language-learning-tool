export const fixMarkdown = (markdown: string): string => {
  return markdown.replace(/["'`]+\*\*/gi, '**').replace(/\*\*["'`]+/gi, '**');
};
