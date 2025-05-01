import { FC, useCallback, useState } from 'react';
import { TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

type VocablyTextInput = FC<
  TextInputProps & {
    style?: ViewStyle;
    inputStyle?: TextInputProps['style'];
  }
>;

export const VocablyTextInput: VocablyTextInput = ({
  style,
  onFocus,
  onBlur,
  inputStyle,
  ...textInputProps
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const onFocusReloaded = useCallback(
    (e: any) => {
      setIsFocused(true);
      onFocus && onFocus(e);
    },
    [onFocus, setIsFocused]
  );

  const onBlurReloaded = useCallback(
    (e: any) => {
      setIsFocused(false);
      onBlur && onBlur(e);
    },
    [onBlur, setIsFocused]
  );

  return (
    <View
      style={[
        {
          borderStyle: 'solid',
          borderColor: isFocused
            ? theme.colors.onSurface
            : theme.colors.tertiary,
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
        },
        style,
      ]}
    >
      <TextInput
        style={[
          {
            color: theme.colors.secondary,
            textAlignVertical: 'top',
          },
          inputStyle,
        ]}
        placeholderTextColor={theme.colors.outlineVariant}
        {...textInputProps}
        onFocus={onFocusReloaded}
        onBlur={onBlurReloaded}
      ></TextInput>
    </View>
  );
};
