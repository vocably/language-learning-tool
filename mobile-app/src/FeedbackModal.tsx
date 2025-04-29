import { NavigationProp, Route } from '@react-navigation/native';
import { sendUserFeedback } from '@vocably/api';
import { FC, useCallback, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserEmail } from './auth/useUserEmail';
import { useTranslationPreset } from './TranslationPreset/useTranslationPreset';
import { VocablyTextInput } from './VocablyTextInput';

type Props = {
  route: Route<string, any>;
  navigation: NavigationProp<any>;
};

export const FeedbackModal: FC<Props> = ({ navigation, route }) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const userEmail = useUserEmail();

  const translationPreset = useTranslationPreset();

  const sendFeedback = useCallback(async () => {
    setIsSending(true);
    const res = await sendUserFeedback({
      feedback: text,
      metadata: {
        platform: 'mobile',
        os: Platform.OS,
        translationPreset,
        extraRouteParams: route.params,
      },
    });

    if (res.success === true) {
      Alert.alert('Success', 'Thank you for your feedback.', [
        {
          text: 'Go back',
          onPress: () => {
            setText('');
            navigation.goBack();
          },
        },
      ]);
    } else {
      Alert.alert('Something went wrong. Please try again later.');
    }

    setIsSending(false);
  }, [sendUserFeedback, text, setIsSending, Alert, navigation.goBack]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          disabled={text.trim().length === 0 || isSending}
          onPress={sendFeedback}
          loading={isSending}
          style={{ marginRight: 8 }}
        >
          Send
        </Button>
      ),
    });
  }, [text, sendFeedback, isSending]);

  const insets = useSafeAreaInsets();

  return (
    <>
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View
          style={{
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            paddingVertical: 32,
            paddingLeft: insets.left + 32,
            paddingRight: insets.right + 32,
            gap: 16,
          }}
        >
          <Text>
            Missing any crucial features? Have questions or want to share your
            thoughts on Vocably? I'd love to hear from you!
          </Text>
          <Text>
            I personally respond to every user, usually within a couple of days.
          </Text>
          {userEmail && (
            <Text>
              I'll reply to you at your email address{' '}
              <Text style={{ fontWeight: 'bold' }}>{userEmail}</Text>.
              {userEmail.includes('privaterelay') && (
                <Text>
                  {' '}
                  It looks like you shared a private Apple email with me during
                  registration, but no worries — it should work just fine.
                </Text>
              )}
            </Text>
          )}
          <VocablyTextInput
            multiline
            placeholder={'Please type your message here...'}
            inputStyle={{ height: 128 }}
            onChangeText={setText}
            value={text}
          />
        </View>
      </ScrollView>
    </>
  );
};
