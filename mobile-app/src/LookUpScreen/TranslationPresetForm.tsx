import { NavigationProp } from '@react-navigation/native';
import { FC, useCallback } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SourceLanguageButton } from '../SourceLanguageButton';
import { TargetLanguageButton } from '../TargetLanguageButton';
import { Preset } from '../TranslationPreset/TranslationPresetContainer';
import { LanguagePairs } from '../TranslationPreset/useLanguagePairs';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

type Props = {
  navigation: NavigationProp<any>;
  preset: Preset;
  onChange: (preset: Preset) => void;
  languagePairs: LanguagePairs;
};

export const TranslationPresetForm: FC<Props> = ({
  navigation,
  preset,
  onChange,
  languagePairs,
}) => {
  const theme = useTheme();

  const clickReverse = useCallback(() => {
    onChange({
      ...preset,
      isReverse: !preset.isReverse,
    });
  }, [preset]);

  const { width: windowWidth } = useWindowDimensions();

  return (
    <View>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <SourceLanguageButton
            navigation={navigation}
            preset={preset}
            onChange={onChange}
            languagePairs={languagePairs}
          />
        </View>
        <View style={{ alignItems: 'center', width: 65 }}>
          <IconButton
            animated={true}
            icon={preset.isReverse ? 'arrow-left' : 'arrow-right'}
            onPress={clickReverse}
            mode="contained"
            style={{ backgroundColor: theme.colors.elevation.level5 }}
          ></IconButton>
        </View>
        <View style={{ flex: 1 }}>
          <TargetLanguageButton
            navigation={navigation}
            preset={preset}
            onChange={onChange}
            languagePairs={languagePairs}
          />
        </View>
      </View>
      {!preset.sourceLanguage && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Icon name="arrow-up-thin" size={48} color={theme.colors.secondary} />
          <Text style={{ color: theme.colors.secondary }}>
            Select language you're learning.
          </Text>
        </View>
      )}
      {preset.sourceLanguage && !preset.translationLanguage && (
        <View
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            transform: [{ translateX: windowWidth / 3 }],
          }}
        >
          <Text style={{ color: theme.colors.secondary }}>
            Select your mother tongue
          </Text>
          <Icon name="arrow-up-thin" size={48} color={theme.colors.secondary} />
        </View>
      )}
    </View>
  );
};
