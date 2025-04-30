import { NavigationProp } from '@react-navigation/native';
import { GoogleLanguage } from '@vocably/model';
import { usePostHog } from 'posthog-react-native';
import { FC, useRef, useState } from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Surface, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { mainPadding } from '../styles';
import { useTranslationPreset } from '../TranslationPreset/useTranslationPreset';
import { ScreenLayout } from '../ui/ScreenLayout';
import { SlideCard } from './SlideCard';
import { SlideDesktopBrowser } from './SlideDesktopBrowser';
import { SlideLookUp } from './SlideLookUp';
import { SlideReverseTranslate } from './SlideReverseTranslate';
import { SlideSelectToTranslate } from './SlideSelectToTranslate';
import { WelcomeForm } from './WelcomeForm';

type Props = {
  navigation: NavigationProp<any>;
};

export const WelcomeScreen: FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const swiperRef = useRef<Swiper>(null);
  const posthog = usePostHog();
  const translationPresetState = useTranslationPreset();
  const [swiperIndex, setSwiperIndex] = useState(0);

  if (translationPresetState.status === 'unknown') {
    return <></>;
  }

  const isSet =
    translationPresetState.preset.sourceLanguage &&
    translationPresetState.preset.translationLanguage;

  return (
    <ScreenLayout
      header={
        <Surface
          elevation={1}
          style={{
            paddingLeft: insets.left + mainPadding,
            paddingRight: insets.right + mainPadding,
            paddingTop: insets.top + mainPadding,
            paddingBottom: mainPadding,
            flexDirection: 'row',
          }}
        >
          {swiperIndex > 0 && (
            <Button
              onPress={() =>
                swiperRef.current && swiperRef.current.scrollBy(-1)
              }
            >
              Back
            </Button>
          )}
          {translationPresetState.preset.sourceLanguage &&
            translationPresetState.preset.translationLanguage && (
              <Button
                style={{ marginLeft: 'auto' }}
                onPress={() => navigation.goBack()}
              >
                Skip
              </Button>
            )}
        </Surface>
      }
      content={
        <View
          style={{
            flex: 1,
            position: 'relative',
            paddingBottom: insets.bottom,
          }}
        >
          <Swiper
            loop={false}
            showsPagination={false}
            ref={swiperRef}
            onIndexChanged={(index) => {
              setSwiperIndex(index);
              posthog.capture('onboardingSwiped', {
                index,
              });
            }}
          >
            <WelcomeForm></WelcomeForm>
            {isSet && (
              <SlideCard
                sourceLanguage={
                  translationPresetState.preset.sourceLanguage as GoogleLanguage
                }
                targetLanguage={
                  translationPresetState.preset
                    .translationLanguage as GoogleLanguage
                }
              />
            )}
            {isSet && (
              <SlideLookUp
                sourceLanguage={
                  translationPresetState.preset.sourceLanguage as GoogleLanguage
                }
                targetLanguage={
                  translationPresetState.preset
                    .translationLanguage as GoogleLanguage
                }
              />
            )}
            {isSet && (
              <SlideReverseTranslate
                sourceLanguage={
                  translationPresetState.preset.sourceLanguage as GoogleLanguage
                }
                targetLanguage={
                  translationPresetState.preset
                    .translationLanguage as GoogleLanguage
                }
              />
            )}
            {isSet && (
              <SlideSelectToTranslate
                sourceLanguage={
                  translationPresetState.preset.sourceLanguage as GoogleLanguage
                }
                targetLanguage={
                  translationPresetState.preset
                    .translationLanguage as GoogleLanguage
                }
              />
            )}
            {isSet && (
              <SlideDesktopBrowser
                sourceLanguage={
                  translationPresetState.preset.sourceLanguage as GoogleLanguage
                }
                targetLanguage={
                  translationPresetState.preset
                    .translationLanguage as GoogleLanguage
                }
              />
            )}
          </Swiper>
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
              height: 100,
              paddingLeft: insets.left + mainPadding,
              paddingRight: insets.right + mainPadding,
            }}
          >
            {isSet && (
              <Button
                mode="elevated"
                elevation={2}
                onPress={() => {
                  swiperRef.current && swiperRef.current.scrollBy(1);
                }}
              >
                Next
              </Button>
            )}
          </LinearGradient>
        </View>
      }
    ></ScreenLayout>
  );
};
