import { RateInteractionPayload } from '@vocably/model';
import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { mobileStoreName } from '../mobilePlatform';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  element: {
    marginTop: 12,
  },
});

export type AskForReviewForm = FC<{
  style?: StyleProp<ViewStyle>;
  onAction?: (choice: RateInteractionPayload) => void;
}>;

export const AskForReviewForm: AskForReviewForm = ({
  style,
  onAction = () => {},
}) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <View>
        <Text style={{ fontWeight: 'bold' }}>
          You can help other language learners.
        </Text>
      </View>
      <View style={styles.element}>
        <Text>Vocably is 100% free and open-source.</Text>
      </View>
      <View style={styles.element}>
        <Text style={{ textAlign: 'center' }}>
          Your positive review on {mobileStoreName} would help other users to
          discover this project.
        </Text>
      </View>
      <View style={[styles.element, { alignSelf: 'stretch' }]}>
        <Button mode={'contained'} onPress={() => onAction('review')}>
          Rate on {mobileStoreName}
        </Button>
      </View>
      <View style={[styles.element, { alignSelf: 'stretch' }]}>
        <Button mode={'outlined'} onPress={() => onAction('later')}>
          Ask me later
        </Button>
      </View>
      <View style={styles.element}>
        <Button mode="text" onPress={() => onAction('never')}>
          Please don't ask me about this.
        </Button>
      </View>
    </View>
  );
};
