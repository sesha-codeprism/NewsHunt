import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from '../Screens/Auth/Login.Screen';
import SplashScreen from '../Screens/Auth/SplashScreen';
import SignUpScreen from '../Screens/Auth/SignUpScreen';

const authNavigation = createStackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen,
    },
    SplashScreen: {
      screen: SplashScreen,
    },
    SignupScreen: {
      screen: SignUpScreen,
    },
  },
  {
    mode: 'card',
    headerMode: 'none',
    initialRouteName: 'SplashScreen',
  },
);

export default createAppContainer(authNavigation);
