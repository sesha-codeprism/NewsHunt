import React, {Props} from 'react';
import {
  View,
  Text,
  ViewProps,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {globalColors} from '../utils/Colors';

interface GoSafeProps extends Props<ViewProps> {
  fullscreen?: boolean;
  statusBarBackground?: string;
  hideStatusBar?: boolean;
}

const GoSafe = (props: GoSafeProps) => {
  return (
    <>
      {!props.fullscreen && Platform.OS === 'ios' && (
        <View
          style={
            DeviceInfo.hasNotch()
              ? styles.fakeStatusBarWithNotch
              : styles.fakeStatusBar
          }>
          <StatusBar barStyle="light-content" />
        </View>
      )}
      {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
      {Platform.OS === 'android' ? (
        <StatusBar
          backgroundColor={
            props.statusBarBackground || globalColors.androidStatusBar
          }
          hidden={props.hideStatusBar}
        />
      ) : null}
      <SafeAreaView style={styles.goFlex}>{props.children}</SafeAreaView>
    </>
  );
};

export default GoSafe;

const styles = StyleSheet.create({
  goFlex: {
    flex: 1,
  },
  fakeStatusBar: {
    backgroundColor: globalColors.androidStatusBar,
    height: 25,
    width: '100%',
  },
  fakeStatusBarWithNotch: {
    backgroundColor: globalColors.androidStatusBar,
    height: 50,
    width: '100%',
  },
});
