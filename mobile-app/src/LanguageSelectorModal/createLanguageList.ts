import { GoogleLanguage, languageList } from '@vocably/model';

export type LanguageListItem = {
  selected: boolean;
  key: string;
  label: string;
};

export type LanguageList = {
  title: string;
  data: LanguageListItem[];
}[];

export const createLanguageList = ({
  selected,
  preferred,
  preferredTitle,
  searchText,
}: {
  selected: string;
  preferred: string[];
  preferredTitle: string;
  searchText: string;
}): LanguageList => {
  const data: LanguageList = [];

  const filteredLanguageList = Object.fromEntries(
    Object.entries(languageList).filter(([languageKey, languageName]) =>
      languageName.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  if (selected && filteredLanguageList[selected as GoogleLanguage]) {
    data.push({
      title: 'Selected',
      data: [
        {
          key: selected,
          label: filteredLanguageList[selected as GoogleLanguage],
          selected: true,
        },
      ],
    });
  }

  const filteredPreferred = preferred
    .filter((l) => l !== selected)
    .filter((l) => filteredLanguageList[l] !== undefined);

  if (filteredPreferred.length > 0) {
    data.push({
      title: preferredTitle,
      data: filteredPreferred.map((key) => ({
        key,
        selected: false,
        label: filteredLanguageList[key as GoogleLanguage],
      })),
    });
  }

  data.push({
    title: 'Available languages',
    data: Object.entries(filteredLanguageList).map(([key, label]) => ({
      key,
      label,
      selected: false,
    })),
  });

  return data;
};
