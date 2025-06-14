import { createStackNavigator } from '@react-navigation/stack';
import React, { FC } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContainer } from '../auth/AuthContainer';
import { configurePurchases } from '../configurePurchases';
import { CustomerInfoContainer } from '../CustomerInfoContainer';
import { LanguagesContainer } from '../languages/LanguagesContainer';
import { LanguageSelectorModal } from '../LanguageSelectorModal';
import { NavigationContainer } from '../NavigationContainer';
import { PostHogProvider } from '../PostHogProvider';
import { ThemeProvider } from '../ThemeProvider';
import { TranslationPresetContainer } from '../TranslationPreset/TranslationPresetContainer';
import { Login } from './Login';
import { ShareIntentLookUpScreen } from './ShareIntentLookUpScreen';
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
                <CustomerInfoContainer>
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
                </CustomerInfoContainer>
              </Login>
            </AuthContainer>
          </PostHogProvider>
        </NavigationContainer>
      </Viewport>
    </ThemeProvider>
  );
};
