import { getFullLanguageName } from '@vocably/model';
import { FC, useContext, useState } from 'react';
import { PixelRatio, StyleProp, View, ViewStyle } from 'react-native';
import { Menu, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LanguagesContext } from './languages/LanguagesContainer';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const LanguageSelector: FC<Props> = ({ style }) => {
  const { languages, selectedLanguage, selectLanguage } =
    useContext(LanguagesContext);

  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const onSelect = (language: string) => {
    selectLanguage(language).then();
    setTimeout(() => {
      closeMenu();
    }, 400);
  };

  const fontScale = PixelRatio.getFontScale();

  return (
    <>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableRipple
            hitSlop={24}
            onPress={openMenu}
            borderless={true}
            style={[{ borderRadius: 32, padding: 8 }, style]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                color={theme.colors.onBackground}
                name="earth"
                size={24 * fontScale}
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {selectedLanguage.toUpperCase()}
              </Text>
            </View>
          </TouchableRipple>
        }
      >
        {languages.map((language) => (
          <Menu.Item
            key={language}
            title={getFullLanguageName(language)}
            onPress={() => onSelect(language)}
            titleStyle={{ color: theme.colors.secondary }}
            trailingIcon={language === selectedLanguage ? 'check' : undefined}
          />
        ))}
      </Menu>
    </>
  );
};
