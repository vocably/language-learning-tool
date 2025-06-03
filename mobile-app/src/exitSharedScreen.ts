import { BackHandler, Platform } from 'react-native';
import { ShareMenuReactView } from 'react-native-share-menu';

export const exitSharedScreen = () => {
  Platform.OS === 'ios'
    ? ShareMenuReactView.dismissExtension()
    : BackHandler.exitApp();
};
