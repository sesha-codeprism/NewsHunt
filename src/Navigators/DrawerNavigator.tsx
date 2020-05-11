import {Dimensions} from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {CustomDrawerContentComponent} from '../Screens/App/Menu';
import HomeScreen from '../Screens/App/HomeScreen';
import MainNavigator from './Main.navigator';
const width = Dimensions.get('screen').width;

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: MainNavigator,
      path: 'app',
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
  },
  //@ts-ignore
  {
    contentComponent: CustomDrawerContentComponent,
    drawerWidth: width * 0.77,
  },
);
export default DrawerNavigator;
