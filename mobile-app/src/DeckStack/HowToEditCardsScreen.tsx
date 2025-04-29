import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomScrollView } from '../ui/CustomScrollView';
import { ScreenTitle } from '../ui/ScreenTitle';

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
});

type Props = {};

export const HowToEditCardsScreen: FC<Props> = () => {
  return (
    <CustomScrollView>
      <ScreenTitle icon="pencil-outline" title="How to edit cards" />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ display: 'flex', gap: 12 }}>
          <Text style={styles.text}>You can edit cards in two ways:</Text>
          <Text style={styles.text}>
            • <Text style={{ fontWeight: 'bold' }}>My cards screen</Text>: Swipe
            a card left to reveal the edit menu.
          </Text>
          <Text style={styles.text}>
            • <Text style={{ fontWeight: 'bold' }}>Study session</Text>: Tap the
            "Edit" (<Icon name={'pencil'} size={16} />) button.
          </Text>
        </View>
      </View>
    </CustomScrollView>
  );
};
