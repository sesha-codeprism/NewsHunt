import {createStackNavigator} from 'react-navigation-stack';
import {Animated, Easing} from 'react-native';
import HomeScreen from '../Screens/App/HomeScreen';
import AudioRecord from '../Screens/App/AudioRecord';
import ReportStory from '../Screens/App/ReportStory';
import NewsCategories from '../Screens/App/NewsCategories';
import ReportComplaints from '../Screens/App/ReportComplaint';
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
  ReportConplaint: {
    screen: ReportComplaints,
    navigationOptions: {
      headerShown: false,
    },
  },
  NewsCategories: {
    screen: NewsCategories,
    navigationOptions: {
      headerShown: false,
    },
  },
});
export default MainNavigator;
