import { API_BASE_URL, API_CARDS_BUCKET, API_REGION } from '@env';
import { configureApi } from '@vocably/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { adapty } from 'react-native-adapty';
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

adapty.activate('public_live_pTYVvJ2D.ZqmFz3ZQPnr7R75Vk0fE');

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
