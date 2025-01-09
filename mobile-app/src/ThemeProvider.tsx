import { FC, PropsWithChildren } from 'react';
import {
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  Provider,
} from 'react-native-paper';
import { useColorScheme } from './useColorScheme';

type ThemeProvider = FC<PropsWithChildren<{}>>;

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: 'rgb(255, 255, 255)',
    onBackground: 'rgb(106, 106, 106)',
    surface: 'rgb(255, 255, 255)',
    // @ts-ignore
    transparentSurface: 'rgba(255, 255, 255, 0)',
    onSurface: 'rgb(106, 106, 106)',
    primary: 'rgb(0, 80, 255)',
    onPrimary: 'rgb(255, 255, 255)',
    error: 'rgb(221, 34, 34)',
    secondary: 'rgb(0, 0, 0)',
    onSecondary: 'rgb(255, 255, 255)',
    outline: 'rgb(0, 80, 255)',
    outlineVariant: 'rgb(107, 106, 106)',
    secondaryContainer: 'rgb(0, 80, 255)',
    onSecondaryContainer: 'rgb(255, 255, 255)',
    surfaceVariant: 'rgb(251, 251, 251)',
    inversePrimary: 'rgba(0, 80, 255, 0.1)',
    elevation: {
      level0: 'rgb(255, 255, 255)',
      level1: 'rgb(252, 252, 252)',
      level2: 'rgb(250, 250, 250)',
      level3: 'rgb(247, 247, 247)',
      level4: 'rgb(245, 245, 245)',
      level5: 'rgb(243, 243, 243)',
    },
  },
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: 'rgb(37, 37, 37)',
    surface: 'rgb(37, 37, 37)',
    // @ts-ignore
    transparentSurface: 'rgba(37, 37, 37, 0)',
    onSurface: 'rgb(186, 186, 186)',
    primary: 'rgb(40, 165, 255)',
    onPrimary: 'rgb(255, 255, 255)',
    error: 'rgb(255, 94, 94)',
    secondary: 'rgb(255, 255, 255)',
    onSecondary: 'rgb(37, 37, 37)',
    outline: 'rgb(40, 165, 255)',
    outlineVariant: 'rgb(107, 106, 106)',
    secondaryContainer: 'rgb(40, 165, 255)',
    onSecondaryContainer: 'rgb(255, 255, 255)',
    surfaceVariant: 'rgb(59, 59, 59)',
    inversePrimary: 'rgba(40, 165, 255, 0.1)',
    elevation: {
      level0: 'rgb(37, 37, 37)',
      level1: 'rgb(50, 50, 50)',
      level2: 'rgb(62, 62, 62)',
      level3: 'rgb(75, 75, 75)',
      level4: 'rgb(88, 88, 88)',
      level5: 'rgb(101, 101, 101)',
    },
  },
};

export const ThemeProvider: ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  return (
    <Provider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
      {children}
    </Provider>
  );
};
