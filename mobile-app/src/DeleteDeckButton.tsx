import { useNavigation } from '@react-navigation/native';
import { FC, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LanguagesContext } from './languages/LanguagesContainer';
import { ListItem } from './ui/ListItem';
import { useCurrentLanguageName } from './useCurrentLanguageName';

export const DeleteDeckButton: FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { selectedLanguage, deleteLanguage, languages } =
    useContext(LanguagesContext);
  const navigation = useNavigation();
  const theme = useTheme();
  const languageName = useCurrentLanguageName();

  const deleteAfterConfirmation = async () => {
    setIsDeleting(true);
    const deleteResult = await deleteLanguage(selectedLanguage);
    setIsDeleting(false);

    if (deleteResult.success === false) {
      Alert.alert(
        'Error: Trouble deleting deck',
        // `Oops! Something went wrong while attempting to delete the deck. Please try again later and don't hesitate to let the support know if the issue persists.`
        `Oops! Something went wrong while attempting to delete the deck. Please try again later.`
      );
    }

    if (languages.length > 1) {
      navigation.goBack();
    }
  };

  const onClick = () => {
    Alert.alert(
      `Delete ${languageName} deck?`,
      'This operation cannot be undone.',
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            deleteAfterConfirmation();
          },
        },
        {
          text: 'Cancel',
        },
      ]
    );
  };

  return (
    <ListItem
      leftIcon="delete"
      rightIcon=""
      title="Delete this deck"
      onPress={onClick}
      color={theme.colors.error}
    />
  );
};
