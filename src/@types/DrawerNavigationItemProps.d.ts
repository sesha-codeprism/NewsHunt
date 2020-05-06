import {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
  NavigationParams,
  NavigationDescriptor,
  SupportedThemes,
  NavigationScreenConfig,
} from 'react-navigation';
import {StyleProp, ViewStyle, TextStyle} from 'react-native';
import Animated from 'react-native-reanimated';

export type DrawerNavigatorItemsProps = {
  items: NavigationRoute[];
  activeItemKey?: string | null;
  activeTintColor?: string | ThemedColor;
  activeBackgroundColor?: string | ThemedColor;
  inactiveTintColor?: string | ThemedColor;
  inactiveBackgroundColor?: string | ThemedColor;
  getLabel: (scene: Scene) => React.ReactNode;
  renderIcon: (scene: Scene) => React.ReactNode;
  onItemPress: (scene: {route: NavigationRoute; focused: boolean}) => void;
  itemsContainerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  activeLabelStyle?: StyleProp<TextStyle>;
  inactiveLabelStyle?: StyleProp<TextStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  drawerPosition: 'left' | 'right';
  screenProps: unknown;
};

export type ThemedColor =
  | string
  | {
      light: string;
      dark: string;
    };

export type Scene = {
  route: NavigationRoute;
  index: number;
  focused: boolean;
  tintColor?: string;
};
