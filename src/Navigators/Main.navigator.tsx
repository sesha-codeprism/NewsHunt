import {createStackNavigator} from 'react-navigation-stack';
import {Animated, Easing} from 'react-native';
import HomeScreen from '../Screens/App/HomeScreen';
import AudioRecord from '../Screens/App/AudioRecord';
import ReportStory from '../Screens/App/ReportStory';
const MainNavigator = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  AudioRecord: {
    screen: AudioRecord,
    navigationOptions: {
      headerShown: false,
    },
  },
  ReportStory: {
    screen: ReportStory,
    navigationOptions: {
      headerShown: false,
    },
  },
});
export default MainNavigator;
