import { useNavigation } from '@react-navigation/native';
import { FC, useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { dialogAlign } from './dialogAlign';
import { LanguagesContext } from './languages/LanguagesContainer';

export const DeleteDeckButton: FC = () => {
  const [isAboutToDelete, setIsAboutToDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { selectedLanguage, deleteLanguage, languages } =
    useContext(LanguagesContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const deleteAfterConfirmation = useCallback(async () => {
    setIsDeleting(true);
    const deleteResult = await deleteLanguage(selectedLanguage);
    setIsAboutToDelete(false);
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
  }, [setIsDeleting, languages]);

  return (
    <>
      <Button
        onPress={() => {
          setIsAboutToDelete(true);
        }}
        icon={'delete'}
        mode="outlined"
        textColor={theme.colors.error}
        style={{
          borderColor: theme.colors.error,
        }}
      >
        Delete this deck
      </Button>
      <Portal>
        <Dialog
          visible={isAboutToDelete}
          onDismiss={() => setIsAboutToDelete(false)}
          style={{
            alignSelf: dialogAlign,
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <Dialog.Title>Delete Deck</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure that you want to delete this deck? This operation can
              not be reversed.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={deleteAfterConfirmation}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Yes
            </Button>
            <Button
              onPress={() => setIsAboutToDelete(false)}
              disabled={isDeleting}
            >
              No
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
