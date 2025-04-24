import { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  style?: StyleProp<ViewStyle>;
  leftIcon: string;
  title: string;
  rightIcon?: string;
  color?: string;
  onPress: () => void;
};

export const ListItem: FC<Props> = ({
  style,
  leftIcon,
  rightIcon = 'menu-right',
  color,
  onPress,
  title,
}) => {
  const theme = useTheme();
  return (
    <List.Item
      style={style}
      title={title}
      onPress={onPress}
      titleStyle={{
        color: color ?? theme.colors.onBackground,
      }}
      left={() => (
        <Icon
          name={leftIcon}
          size={24}
          color={color ?? theme.colors.onBackground}
          style={{ marginLeft: 16 }}
        />
      )}
      right={() => (
        <>
          {rightIcon && (
            <Icon
              name={rightIcon}
              size={24}
              color={color ?? theme.colors.onBackground}
            />
          )}
        </>
      )}
    ></List.Item>
  );
};
