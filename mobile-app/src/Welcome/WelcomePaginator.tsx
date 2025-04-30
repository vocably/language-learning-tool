import { FC } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = {
  slideIndex: number;
  totalSlides: number;
};

export const WelcomePaginator: FC<Props> = ({ slideIndex, totalSlides }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      {Array.from({ length: totalSlides }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            backgroundColor:
              slideIndex === index
                ? theme.colors.primary
                : theme.colors.onSurface,
          }}
        ></View>
      ))}
    </View>
  );
};
