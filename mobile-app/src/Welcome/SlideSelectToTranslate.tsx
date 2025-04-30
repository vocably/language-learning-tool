import { useNavigation } from '@react-navigation/native';
import { GoogleLanguage, languageList } from '@vocably/model';
import { trimLanguage } from '@vocably/sulna';
import { usePostHog } from 'posthog-react-native';
import { FC } from 'react';
import { Linking, Platform, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CardListItem } from '../CardListItem';
import { getOnboardingData } from '../Onboarding/getOnboardingData';
import { Telephone } from '../Telephone';
import { useColorScheme } from '../useColorScheme';
import { WelcomeScrollView } from './WelcomeScrollView';

type Props = {
  sourceLanguage: GoogleLanguage;
  targetLanguage: GoogleLanguage;
};

export const SlideSelectToTranslate: FC<Props> = ({
  sourceLanguage,
  targetLanguage,
}) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const onboardingData = getOnboardingData(sourceLanguage, targetLanguage);
  const theme = useTheme();
  const isAndroid = Platform.OS === 'android';
  const posthog = usePostHog();

  return (
    <WelcomeScrollView style={{ gap: 16 }}>
      {!isAndroid && (
        <Text style={{ fontSize: 22, textAlign: 'center' }}>
          Do you see a new{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {trimLanguage(languageList[sourceLanguage])}
          </Text>{' '}
          in Mobile Safari? Translate it with the{' '}
          <Text
            style={{ color: theme.colors.primary }}
            onPress={() => {
              Linking.openURL('https://vocably.pro/ios-safari-extension.html');
              posthog.capture('onboardingMobileSafariClicked');
            }}
          >
            Vocably extension
          </Text>
          !
        </Text>
      )}
      {isAndroid && (
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 22, textAlign: 'center' }}>
            Do you see a new{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {trimLanguage(languageList[sourceLanguage])}
            </Text>{' '}
            word on the screen of your Android device?
          </Text>
          <Text style={{ fontSize: 22, textAlign: 'center' }}>
            Select the word <Icon name="arrow-right" size={18} /> Click{' '}
            <Icon name="dots-vertical" size={22} />{' '}
            <Icon name="arrow-right" size={22} /> Click "Translate with Vocably"
          </Text>
        </View>
      )}

      <View style={{ width: '100%', alignItems: 'center' }}>
        <Telephone
          colorScheme={colorScheme}
          style={{
            height: 350,
            maxWidth: 310,
          }}
        >
          <View
            pointerEvents="none"
            style={{
              marginTop: 64,
              alignItems: 'center',
              gap: 24,
              position: 'relative',
            }}
          >
            <View>
              <Text style={{ fontSize: 24 }}>
                {onboardingData.contextTranslationExample.text
                  .split('*')
                  .map((part, index) => (
                    <Text
                      key={index}
                      style={{
                        backgroundColor: index === 1 ? '#2C9FD9' : undefined,
                      }}
                    >
                      {part}
                    </Text>
                  ))}
              </Text>
            </View>
          </View>

          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 110,
              right: 0,
              backgroundColor: theme.colors.surfaceVariant,
              borderWidth: 1,
              borderColor: theme.colors.outlineVariant,
              borderRadius: 16,
            }}
          >
            {onboardingData.contextTranslationExample.results.map(
              (card, index) => (
                <View key={index}>
                  {index > 0 && <Divider bold={true} />}
                  <CardListItem
                    style={{ padding: 16 }}
                    card={card}
                    showExamples={true}
                  />
                </View>
              )
            )}
          </View>
        </Telephone>
        <LinearGradient
          locations={[0.1, 0.4]}
          // @ts-ignore
          colors={[theme.colors.transparentSurface, theme.colors.surface]}
          style={{
            position: 'absolute',
            display: 'flex',
            bottom: 0,
            width: '100%',
            alignItems: 'stretch',
            justifyContent: 'center',
            height: 50,
          }}
        ></LinearGradient>
      </View>
    </WelcomeScrollView>
  );
};
