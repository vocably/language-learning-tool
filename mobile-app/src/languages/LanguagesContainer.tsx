import {
  deleteLanguageDeck,
  listLanguages,
  saveLanguageDeck,
} from '@vocably/api';
import { LanguageDeck, Result, TagItem } from '@vocably/model';
import { usePostHog } from 'posthog-react-native';
import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { AppState } from 'react-native';
import * as asyncAppStorage from '../asyncAppStorage';
import { Sentry } from '../BetterSentry';
import { Error } from '../Error';
import { Loader } from '../loaders/Loader';
import { pingGoogle } from '../pingGoogle';
import { useAsync } from '../useAsync';

const selectedLanguageStorageKey = 'languagesContainerSelectedLanguage';

const loadSelectedLanguageStorage = (): Promise<string> =>
  asyncAppStorage.getItem(selectedLanguageStorageKey).then((res) => res ?? '');

const saveSelectedLanguageToStorage = (language: string) =>
  asyncAppStorage.setItem(selectedLanguageStorageKey, language);

export type LanguageContainerDeck = {
  status: 'initial' | 'loading' | 'loaded' | 'error';
  deck: LanguageDeck;
  selectedTags: TagItem[];
};

type DecksCollection = Record<string, LanguageContainerDeck>;

type Languages = {
  status: 'loading' | 'loaded' | 'error';
  languages: string[];
  decks: DecksCollection;
  storeDeck: (deck: LanguageContainerDeck) => void;
  deleteLanguage: (language: string) => ReturnType<typeof deleteLanguageDeck>;
  selectedLanguage: string;
  selectLanguage: (language: string) => Promise<void>;
  refreshLanguages: () => Promise<void>;
  addLanguage: (language: string) => void;
  addNewLanguage: (language: string) => Promise<Result<unknown>>;
};

export const LanguagesContext = createContext<Languages>({
  status: 'loading',
  languages: [],
  decks: {},
  storeDeck: () => null,
  deleteLanguage: () =>
    Promise.resolve({
      success: true,
      value: null,
    }),
  selectedLanguage: '',
  selectLanguage: () => Promise.resolve(),
  refreshLanguages: () => Promise.resolve(),
  addLanguage: () => null,
  addNewLanguage: () => Promise.resolve({ success: true, value: null }),
});

type Props = {
  children: ReactNode;
  refreshLanguagesOnActive?: boolean;
};

export const LanguagesContainer: FC<Props> = ({
  children,
  refreshLanguagesOnActive = false,
}) => {
  const posthog = usePostHog();
  const [listLoadingStatus, setListLoadingStatus] =
    useState<Languages['status']>('loading');
  const [languages, setLanguages] = useState<string[]>([]);
  const [decks, setDecks] = useState<DecksCollection>({});
  const [selectedLanguage, selectLanguage] = useAsync(
    () =>
      loadSelectedLanguageStorage().catch((error) => {
        Sentry.captureMessage('loadSelectedLanguageError', { error: error });
        posthog.capture('loadSelectedLanguageError', { error });
        throw error;
      }),
    (payload) =>
      saveSelectedLanguageToStorage(payload).catch((error) => {
        Sentry.captureMessage('storeSelectedLanguageError', { error: error });
        posthog.capture('storeSelectedLanguageError', { error });
        throw error;
      })
  );

  const storeDeck = (deck: LanguageContainerDeck) => {
    setDecks({
      ...decks,
      [deck.deck.language]: deck,
    });
  };

  const addLanguage = (language: string) => {
    if (languages.includes(language)) {
      return;
    }

    setLanguages([...languages, language]);
  };

  const deleteLanguage = (language: string) =>
    deleteLanguageDeck(language).then((result) => {
      if (result.success === false) {
        return result;
      }

      const { [language]: _, ...newDecks } = decks;
      setDecks(newDecks);

      setLanguages((prevLanguages) =>
        prevLanguages.filter((prevLanguage) => prevLanguage !== language)
      );

      return result;
    });

  const refreshLanguages = async () => {
    const listResult = await listLanguages();

    if (listResult.success === false) {
      Sentry.captureMessage('listLanguagesError', { ...listResult });
      posthog.capture('listLanguagesError', { ...listResult });
      setListLoadingStatus('error');

      pingGoogle().then((status) => {
        Sentry.captureMessage(`pingGoogleStatus_${status}`);
        posthog.capture('pingGoogleStatus', { status });
      });

      return;
    }

    setLanguages(listResult.value);
    setListLoadingStatus('loaded');
  };

  const addNewLanguage = async (language: string): Promise<Result<unknown>> => {
    const existingLanguagesResult = await listLanguages();
    if (existingLanguagesResult.success === false) {
      return existingLanguagesResult;
    }

    if (existingLanguagesResult.value.includes(language)) {
      setLanguages(existingLanguagesResult.value);
      await selectLanguage(language);
      return {
        success: true,
        value: null,
      };
    }

    setLanguages([...existingLanguagesResult.value, language]);
    selectLanguage(language).then();
    return saveLanguageDeck({
      language,
      cards: [],
      tags: [],
    });
  };

  useEffect(() => {
    refreshLanguages().then();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && refreshLanguagesOnActive) {
        posthog.capture('languagesContainerAutoRefresh');
        refreshLanguages().then();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (
      selectedLanguage.status !== 'loaded' ||
      listLoadingStatus !== 'loaded'
    ) {
      return;
    }

    if (
      selectedLanguage.value !== '' &&
      languages.includes(selectedLanguage.value)
    ) {
      return;
    }

    if (languages.length > 0) {
      selectLanguage(languages[0]);
      return;
    }

    if (selectedLanguage.value !== '') {
      selectLanguage('');
    }
  }, [selectedLanguage, languages, listLoadingStatus, selectLanguage]);

  const value: Languages = {
    status: listLoadingStatus,
    languages,
    decks,
    storeDeck,
    deleteLanguage,
    selectedLanguage:
      selectedLanguage.status === 'loaded' ? selectedLanguage.value : '',
    selectLanguage,
    refreshLanguages,
    addLanguage,
    addNewLanguage,
  };

  return (
    <LanguagesContext.Provider value={value}>
      {(listLoadingStatus === 'loading' ||
        selectedLanguage.status === 'loading') && (
        <Loader>Loading languages...</Loader>
      )}
      {(listLoadingStatus === 'error' ||
        selectedLanguage.status === 'failed') && (
        <Error onRetry={refreshLanguages}>
          Oops! We're unable to load your languages and cards right now.
        </Error>
      )}
      {listLoadingStatus === 'loaded' &&
        selectedLanguage.status === 'loaded' &&
        children}
    </LanguagesContext.Provider>
  );
};
