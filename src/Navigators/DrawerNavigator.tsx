import {Dimensions} from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {CustomDrawerContentComponent} from '../Screens/App/Menu';
import HomeScreen from '../Screens/App/HomeScreen';
const width = Dimensions.get('screen').width;

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
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
