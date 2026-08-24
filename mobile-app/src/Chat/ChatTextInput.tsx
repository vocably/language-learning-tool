import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Animated, Platform, Text, TextInput, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '../ThemeProvider';

type Props = {
  initialValue?: string;
  placeholder: string;
  onChange?: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  multiline?: boolean;
  pasteFromClipboard?: boolean;
  autoFocus?: boolean;
};

export type ChatTextInputRef = {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
};

const initialMinHeight = 24;

const textStyle = {
  fontSize: 18,
  paddingTop: Platform.OS === 'android' ? 11 : 12,
  paddingBottom: 10,
};

export const ChatTextInput = forwardRef<ChatTextInputRef, Props>(
  (
    {
      initialValue = '',
      placeholder,
      onChange,
      onSubmit,
      disabled = false,
      multiline = false,
      autoFocus = false,
    },
    ref
  ) => {
    const theme = useAppTheme();
    const inputRef = useRef<TextInput>(null);
    const focusAnimation = useRef(new Animated.Value(0)).current;

    // The input is intentionally uncontrolled. Writing the value back into the
    // native input on every keystroke re-assigns its attributed text, which
    // terminates an in-flight iOS dictation session after the first word.
    const valueRef = useRef(initialValue);
    const [defaultValue, setDefaultValue] = useState(initialValue);
    const [remountKey, setRemountKey] = useState(0);
    const [isEmpty, setIsEmpty] = useState(initialValue === '');

    // An uncontrolled input never tells the shadow tree what the text is, and
    // on iOS the layout is measured from the shadow tree, so the input would
    // stay one line tall forever. The invisible text below mirrors the value
    // and its measured height becomes the height of the input. Android grows
    // on its own and reports the content size, so it doesn't need the mirror.
    const measureWithMirror = Platform.OS === 'ios' && multiline;
    const [mirrorValue, setMirrorValue] = useState(initialValue);
    const [minHeight, setMinHeight] = useState(initialMinHeight);

    const handleFocus = () => {
      Animated.timing(focusAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    };

    const handleBlur = () => {
      Animated.timing(focusAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    };

    const focus = useCallback(() => {
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current && inputRef.current.focus();
        }, 100);
      }
    }, []);

    const setValue = useCallback(
      (value: string) => {
        const wasFocused = inputRef.current?.isFocused() ?? false;
        valueRef.current = value;
        setIsEmpty(value === '');
        setMirrorValue(value);

        if (value === '') {
          // Clearing goes through the native command, so the keyboard and the
          // focus stay in place.
          inputRef.current?.clear();
          return;
        }

        // Setting an arbitrary text is only possible by remounting an
        // uncontrolled input with a new default value.
        setDefaultValue(value);
        setRemountKey((key) => key + 1);

        if (wasFocused) {
          focus();
        }
      },
      [focus]
    );

    useImperativeHandle(
      ref,
      () => ({
        focus,
        getValue: () => valueRef.current,
        setValue,
      }),
      [focus, setValue]
    );

    const handleChangeText = (text: string) => {
      valueRef.current = text;
      // Neither of these writes into the native input, so the text the user is
      // typing or dictating is left alone.
      setIsEmpty(text === '');
      setMirrorValue(text);
      onChange && onChange(text);
    };

    const backgroundColor = focusAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.inputBg, theme.colors.inputBgFocused],
    });

    const isSearchDisabled = isEmpty;
    return (
      <Animated.View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          opacity: disabled ? 0.5 : 1,
          backgroundColor: backgroundColor,
          paddingLeft: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          {measureWithMirror && (
            <Text
              style={{
                ...textStyle,
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                opacity: 0,
                pointerEvents: 'none',
              }}
              accessible={false}
              importantForAccessibility={'no-hide-descendants'}
              onLayout={(event) => {
                setMinHeight(event.nativeEvent.layout.height);
              }}
            >
              {mirrorValue === '' || mirrorValue.endsWith('\n')
                ? `${mirrorValue} `
                : mirrorValue}
            </Text>
          )}
          <TextInput
            key={remountKey}
            ref={inputRef}
            style={{
              ...textStyle,
              color: theme.colors.secondary,
              minHeight: minHeight,
            }}
            multiline={multiline}
            onContentSizeChange={(event) => {
              if (Platform.OS === 'android') {
                setMinHeight(event.nativeEvent.contentSize.height);
              }
            }}
            editable={!disabled}
            onFocus={() => {
              handleFocus();
            }}
            onBlur={() => {
              handleBlur();
            }}
            defaultValue={defaultValue}
            autoCapitalize={'none'}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.tertiary}
            returnKeyType={'search'}
            onSubmitEditing={() => onSubmit(valueRef.current)}
            autoFocus={autoFocus}
          />
        </View>
        <IconButton
          icon={'send-circle'}
          size={32}
          mode="contained"
          iconColor={theme.colors.inputIconColor}
          style={{
            backgroundColor: 'transparent',
            alignSelf: multiline ? 'flex-end' : undefined,
          }}
          onPress={() => onSubmit(valueRef.current)}
          disabled={isSearchDisabled}
        />
      </Animated.View>
    );
  }
);
