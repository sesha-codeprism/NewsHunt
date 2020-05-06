import {normalize} from './helper';
import {StyleSheet} from 'react-native';
import {globalColors} from './Colors';

const GStyle = {
  fontSize: {
    xxmini: normalize(8),
    xmini: normalize(10),
    mini: normalize(12),
    small: normalize(13),
    medium: normalize(15),
    large: normalize(20),
    xlarge: normalize(24),
  },
  size: {
    mini: normalize(12),
    small: normalize(14),
    medium: normalize(15),
    large: normalize(20),
    xlarge: normalize(24),
  },
};

const CardShadow = {
  shadowColor: '#000000',
  shadowOffset: {
    width: 2,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,
};

const SharedStyles = StyleSheet.create({
  bottomStackNavBtnContainer: {
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  authTextInput: {
    height: 40,
    width: '80%',
    marginBottom: 5,
    borderRadius: 25,
    backgroundColor: globalColors.textInputBG,
    justifyContent: 'center',
    paddingHorizontal: 25,
    color: globalColors.white,
    fontSize: GStyle.fontSize.small,
    marginTop: 10,
    letterSpacing: 1,
  },
  authTextInput1: {
    height: 40,
    width: '80%',
    marginBottom: 5,
    borderRadius: 25,
    backgroundColor: globalColors.darkGrey,
    justifyContent: 'center',
    paddingHorizontal: 25,
    color: globalColors.white,
    fontSize: GStyle.fontSize.small,
    marginTop: 10,
    letterSpacing: 1,
  },
});

export {GStyle, CardShadow, SharedStyles};
