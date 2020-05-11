import React from 'react';
import 'react-native-gesture-handler';
import Root from './src/Navigators/RootNavigator';
import RootNavigationService from './src/Navigators/RootNavigationService';
import {Platform, NativeModules} from 'react-native';
import ActivityOverlay from './src/Components/ActivityOverlay';
import {GLOBALS} from './src/utils/globals';

export default class App extends React.Component {
  // componentDidMount() {
  //   Platform.OS === 'android' && NativeModules.SplashScreen.disable();
  // }
  render() {
    return (
      <>
        <Root
          ref={(rootNavigationRef) => {
            RootNavigationService.setRootNavigator(rootNavigationRef);
          }}
        />
        <ActivityOverlay
          ref={(activityOverlay: ActivityOverlay) => {
            GLOBALS.activityIndicator = activityOverlay;
          }}
        />
      </>
    );
  }
}
