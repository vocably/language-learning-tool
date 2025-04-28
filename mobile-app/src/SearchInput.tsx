import React, { FC, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {},
});

type SearchInput = FC<{
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  multiline?: boolean;
}>;

export const SearchInput: SearchInput = ({
  value,
  placeholder,
  onChange,
  onSubmit,
  disabled = false,
  multiline = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const isSearchDisabled = value === '';
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: isFocused ? theme.colors.onSurface : theme.colors.tertiary,
        borderRadius: 12,
        opacity: disabled ? 0.5 : 1,
        backgroundColor: 'transparent',
        paddingLeft: 12,
      }}
    >
      <TextInput
        style={{
          flex: 1,
          color: theme.colors.secondary,
          fontSize: 18,
          minHeight: 24,
          paddingTop: Platform.OS === 'android' ? 11 : 16,
          paddingBottom: 10,
        }}
        multiline={multiline}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        autoCapitalize={'none'}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.tertiary}
        returnKeyType={'search'}
        onSubmitEditing={() => onSubmit(value)}
      />
      {value && (
        <IconButton
          icon={'close-circle'}
          iconColor={theme.colors.outlineVariant}
          onPress={() => onChange('')}
          style={{ backgroundColor: 'transparent' }}
        />
      )}
      <IconButton
        icon={'magnify'}
        mode="contained"
        iconColor={theme.colors.onPrimary}
        style={{
          backgroundColor: isSearchDisabled
            ? 'transparent'
            : theme.colors.primary,
        }}
        onPress={() => onSubmit(value)}
        disabled={isSearchDisabled}
      />
    </View>
  );
};
