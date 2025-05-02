import { FC, ReactNode, useCallback, useState } from 'react';
import { TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = TextInputProps & {
  style?: ViewStyle;
  inputStyle?: TextInputProps['style'];
  label?: string;
  right?: ReactNode;
};

export const FormText: FC<Props> = ({
  style,
  onFocus,
  onBlur,
  inputStyle,
  label,
  right,
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
          gap: 16,
          padding: 16,
          backgroundColor: theme.colors.elevation.level2,
          borderRadius: 16,
        },
        style,
      ]}
    >
      {label && <Text>{label}</Text>}
      <View
        style={{
          borderStyle: 'solid',
          borderColor: isFocused
            ? theme.colors.onSurface
            : theme.colors.tertiary,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 8,
          flexDirection: 'row',
        }}
      >
        <TextInput
          style={[
            {
              color: theme.colors.secondary,
              textAlignVertical: 'top',
              fontSize: 16,
              flexGrow: 1,
              paddingTop: 16,
              paddingBottom: 16,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.outlineVariant}
          {...textInputProps}
          onFocus={onFocusReloaded}
          onBlur={onBlurReloaded}
        ></TextInput>
        {right}
      </View>
    </View>
  );
};
