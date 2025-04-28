import { FC, useState } from 'react';
import { View } from 'react-native';

type Props = {
  header: React.ReactNode;
  content: React.ReactNode;
};

export const ScreenLayout: FC<Props> = ({ header, content }) => {
  const [headerHeight, setHeaderHeight] = useState(64);

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
      }}
    >
      <View
        style={{
          marginTop: headerHeight,
          flex: 1,
        }}
      >
        {content}
      </View>
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
        }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height) {
            setHeaderHeight(height);
          }
        }}
      >
        {header}
      </View>
    </View>
  );
};
