import { API_BASE_URL, API_CARDS_BUCKET, API_REGION } from '@env';
import { configureApi } from '@vocably/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContainer } from './auth/AuthContainer';
import { Login } from './auth/Login';
import { LanguagesContainer } from './languages/LanguagesContainer';
import { NavigationContainer } from './NavigationContainer';
import { NotificationsContainer } from './NotificationsContainer';
import { PostHogProvider } from './PostHogProvider';
import { RootModalStack } from './RootModalStack';
import { ThemeProvider } from './ThemeProvider';
import { TranslationPresetContainer } from './TranslationPreset/TranslationPresetContainer';
import { UserMetadataContainer } from './UserMetadataContainer';

configureApi({
  baseUrl: API_BASE_URL,
  region: API_REGION,
  cardsBucket: API_CARDS_BUCKET,
  getJwtToken: () =>
    fetchAuthSession().then(
      (session) => session.tokens?.idToken?.toString() ?? ''
    ),
});

const App = () => {
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: 'appl_FNZugGphmSHimfrAmGJlScQLYQO' });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: 'goog_qyWCrPaMtbeUbPMeTuhckfUuhzP' });
    }
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <PostHogProvider>
          <AuthContainer>
            <Login>
              <NotificationsContainer>
                <UserMetadataContainer>
                  <LanguagesContainer refreshLanguagesOnActive={true}>
                    <TranslationPresetContainer>
                      <SafeAreaProvider>
                        <RootModalStack />
                      </SafeAreaProvider>
                    </TranslationPresetContainer>
                  </LanguagesContainer>
                </UserMetadataContainer>
              </NotificationsContainer>
            </Login>
          </AuthContainer>
        </PostHogProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
