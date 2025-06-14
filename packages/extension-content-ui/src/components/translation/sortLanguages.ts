import { GoogleLanguage, isGoogleLanguage } from '@vocably/model';

export const sortLanguages =
  (existingLanguages: GoogleLanguage[]) =>
  (
    entryA: [code: string, name: string],
    entryB: [code: string, name: string]
  ): number => {
    const isEntryAExists =
      isGoogleLanguage(entryA[0]) && existingLanguages.includes(entryA[0]);
    const isEntryBExists =
      isGoogleLanguage(entryB[0]) && existingLanguages.includes(entryB[0]);

    if (isEntryAExists && !isEntryBExists) {
      return -1;
    }

    if (!isEntryAExists && isEntryBExists) {
      return 1;
    }

    return entryA[1].localeCompare(entryB[1]);
  };
