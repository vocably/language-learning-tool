import { FC } from 'react';
import { View } from 'react-native';
import { HowToGroupCards } from '../HowToGroupCards';
import { CustomScrollView } from '../ui/CustomScrollView';
import { ScreenTitle } from '../ui/ScreenTitle';

type Props = {};

export const HowToGroupCardsScreen: FC<Props> = () => {
  return (
    <CustomScrollView>
      <ScreenTitle icon="group" title="How to group cards" />
      <View style={{ paddingHorizontal: 16 }}>
        <HowToGroupCards />
      </View>
    </CustomScrollView>
  );
};
