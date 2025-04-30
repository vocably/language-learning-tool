import { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  style?: StyleProp<ViewStyle>;
  leftIcon: string;
  title: string;
  rightIcon?: string;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
  order?: 'single' | 'first' | 'last' | 'middle';
};

const BORDER_RADIUS = 12;

export const ListItem: FC<Props> = ({
  style,
  leftIcon,
  rightIcon = 'menu-right',
  color,
  onPress,
  title,
  disabled = false,
  order = 'single',
}) => {
  const theme = useTheme();
  return (
    <TouchableRipple
      disabled={disabled}
      borderless={true}
      style={[
        {
          borderTopLeftRadius:
            order === 'single' || order === 'first' ? BORDER_RADIUS : 0,
          borderTopRightRadius:
            order === 'single' || order === 'first' ? BORDER_RADIUS : 0,
          borderBottomRightRadius:
            order === 'single' || order === 'last' ? BORDER_RADIUS : 0,
          borderBottomLeftRadius:
            order === 'single' || order === 'last' ? BORDER_RADIUS : 0,
          paddingVertical: 16,
        },
        style,
      ]}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: 56 }}>
          <Icon
            name={leftIcon}
            size={24}
            color={color ?? theme.colors.onBackground}
            style={{ marginLeft: 16 }}
          />
        </View>
        <View style={{ flexGrow: 1 }}>
          <Text
            style={{
              color: color ?? theme.colors.onBackground,
              fontSize: 16,
            }}
          >
            {title}
          </Text>
        </View>
        {rightIcon && (
          <View style={{ width: 48 }}>
            <Icon
              name={rightIcon}
              size={24}
              color={color ?? theme.colors.onBackground}
            />
          </View>
        )}
      </View>
    </TouchableRipple>
  );
};
