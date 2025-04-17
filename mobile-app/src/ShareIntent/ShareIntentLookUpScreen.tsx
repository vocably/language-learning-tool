import { NavigationProp } from '@react-navigation/native';
import { FC } from 'react';
import { View } from 'react-native';
import { Loader } from '../loaders/Loader';
import { LookUpScreen } from '../LookUpScreen';
import { useSharedText } from './useSharedText';

export const ShareIntentLookUpScreen: FC<{
  navigation: NavigationProp<any>;
}> = ({ navigation }) => {
  const sharedText = useSharedText();

  if (sharedText.status === 'undefined') {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Loader>Receiving the text...</Loader>
      </View>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <LookUpScreen
        navigation={navigation}
        initialText={sharedText.text}
        isSharedLookUp={true}
      />
    </View>
  );
};
