import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
});

export const HowToGroupCards: FC<Props> = () => {
  const theme = useTheme();

  return (
    <View style={{ display: 'flex', gap: 12 }}>
      <Text style={styles.text}>Grouping can be done with tags.</Text>
      <Text style={styles.text}>
        Swipe any existing card left and press{' '}
        <Icon name={'tag-plus'} size={16} /> button.
      </Text>
      <Text style={styles.text}>
        Or press the{' '}
        <Icon name={'tag-plus'} color={theme.colors.primary} size={16} /> button
        on a newly added card.
      </Text>
      <Text style={styles.text}>
        When at least one tag is created, press the{' '}
        <Icon name={'tag'} size={16} /> icon on the Study button to study a
        selected tag or a group of selected tags.
      </Text>
      <Text style={styles.text}>
        Swipe any tag in the list to edit or delete it. Your cards will not be
        deleted.
      </Text>
    </View>
  );
};
