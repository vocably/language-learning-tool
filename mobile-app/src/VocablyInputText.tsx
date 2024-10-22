import { FC, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = {
  value?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => any;
  onSubmit?: (value: string) => any;
};

export const VocablyInputText: FC<Props> = ({
  value: initialValue = '',
  onChange,
  onSubmit,
  autoFocus = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();

  const submit = () => {
    onSubmit && onSubmit(value);
  };

  const change = (value: string) => {
    setValue(value);
    onChange && onChange(value);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: isFocused
          ? theme.colors.primary
          : theme.colors.outlineVariant,
        borderRadius: 8,
        height: 48,
      }}
    >
      <TextInput
        style={{
          flex: 1,
          height: '100%',
          paddingLeft: 8,
          color: theme.colors.secondary,
          fontSize: 18,
        }}
        placeholder="New tag name"
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        autoCapitalize={'none'}
        onChangeText={change}
        returnKeyType={'done'}
        onSubmitEditing={submit}
      />
    </View>
  );
};
