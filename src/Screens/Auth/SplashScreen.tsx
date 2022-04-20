import * as React from 'react';
import {View, StyleSheet, Dimensions, ImageBackground} from 'react-native';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import {ImageAssets} from '../../assets/images/index';
import AsyncStorage from '@react-native-community/async-storage';
import {GLOBALS} from '../../utils/globals';
import {Log} from '../../utils/helper';
import Permissions from 'react-native-permissions';
import FastImage from 'react-native-fast-image';

export interface SplashScreenProps extends NavigationStackScreenProps {}

export interface SplashScreenState {}

const {width, height} = Dimensions.get('window');
export default class SplashScreen extends React.Component<
  SplashScreenProps,
  SplashScreenState
> {
  constructor(props: SplashScreenProps) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.func();

    this.checkStore();
  }
  componentDidFocus = () => {
    console.log('Splash Screen');
  };
  func = () => {
    this.checkPermission();
  };
  checkPermission = async () => {
    const p = await Permissions.check('microphone');
    console.log('permission check', p);
    if (p === 'granted') return;
    return this.requestPermission();
  };

  requestPermission = async () => {
    const p = await Permissions.request('microphone');
    console.log('permission request', p);
  };

  subs = [
    this.props.navigation.addListener('didFocus', this.componentDidFocus),
  ];

  checkStore = async () => {
    const store = await AsyncStorage.getItem('LocalStore');
    if (store) {
      GLOBALS.store = JSON.parse(store);
      Log('Got All user details -> Going to APP');
      this.props.navigation.navigate('App');
    } else {
      Log('Could not get User ID from store as well', GLOBALS.store);
      this.props.navigation.replace('LoginScreen');
    }
  };

  public render() {
    return (
      <FastImage
        source={ImageAssets.splashBG}
        resizeMode="cover"
        style={styles.mainContainer}></FastImage>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: width,
    height: height,
  },
});
