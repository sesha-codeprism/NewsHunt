import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import AuthNavigation from '../Navigators/AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
const Root = createSwitchNavigator({
  Auth: {
    screen: AuthNavigation,
    navigationOptions: {
      header: null,
    },
  },
  App: {
    screen: DrawerNavigator,
    path: '',
    navigationOptions: {
      header: null,
    },
  },
});

export default createAppContainer(Root);
