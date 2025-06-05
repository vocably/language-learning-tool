import { createStackNavigator } from '@react-navigation/stack';
import React, { FC } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContainer } from '../auth/AuthContainer';
import { configurePurchases } from '../configurePurchases';
import { LanguagesContainer } from '../languages/LanguagesContainer';
import { LanguageSelectorModal } from '../LanguageSelectorModal';
import { NavigationContainer } from '../NavigationContainer';
import { PostHogProvider } from '../PostHogProvider';
import { ThemeProvider } from '../ThemeProvider';
import { TranslationPresetContainer } from '../TranslationPreset/TranslationPresetContainer';
import { UserMetadataContainer } from '../UserMetadataContainer';
import { Login } from './Login';
import { ShareIntentLookUpScreen } from './ShareIntentLookUpScreen';
import { Timer } from './Timer';
import { Viewport } from './Viewport';

const Stack = createStackNavigator();

type Props = {
  os: 'ios' | 'android';
};

export const ShareIntentAppBase: FC<Props> = ({ os }) => {
  configurePurchases();

  return (
    <ThemeProvider>
      <StatusBar hidden />
      <Viewport os={os}>
        <NavigationContainer>
          <PostHogProvider>
            <AuthContainer>
              <Login os={os}>
                <UserMetadataContainer>
                  <Timer>
                    <LanguagesContainer>
                      <TranslationPresetContainer>
                        <SafeAreaProvider>
                          <Stack.Navigator>
                            <Stack.Screen
                              name="Vocably"
                              component={ShareIntentLookUpScreen}
                              options={{
                                headerShown: false,
                                presentation: 'card',
                                gestureEnabled: true,
                              }}
                            />
                            <Stack.Screen
                              name="LanguageSelector"
                              component={LanguageSelectorModal}
                              options={{
                                headerShown: false,
                                presentation: 'modal',
                                gestureEnabled: true,
                              }}
                            />
                          </Stack.Navigator>
                        </SafeAreaProvider>
                      </TranslationPresetContainer>
                    </LanguagesContainer>
                  </Timer>
                </UserMetadataContainer>
              </Login>
            </AuthContainer>
          </PostHogProvider>
        </NavigationContainer>
      </Viewport>
    </ThemeProvider>
  );
};
