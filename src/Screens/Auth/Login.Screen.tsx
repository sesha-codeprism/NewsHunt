import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import GoSafe from '../../Components/RNSafe';
import {globalColors} from '../../utils/Colors';
import {SharedStyles, GStyle} from '../../utils/styles';
import {ImageAssets} from '../../assets/images/index';
import SimpleToast from 'react-native-simple-toast';
import {isValidEmail, onCatch, updateStore} from '../../utils/helper';
import {UserLoginPayload} from '../../API/api';
import API from '../../API/api';
import {GLOBALS} from '../../utils/globals';

export interface LoginScreenProps extends NavigationStackScreenProps {}

export interface LoginScreenState {
  email: string;
  password: string;
}

const {width, height} = Dimensions.get('window');

export default class LoginScreen extends React.Component<
  LoginScreenProps,
  LoginScreenState
> {
  private passwordTextInputRef = React.createRef<TextInput>();
  constructor(props: LoginScreenProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  // componentDidFocus = () => {
  //   console.log('Screen Focused');
  // };

  // componentWillBlur = () => {
  //   console.log('Screen blurred');
  // };
  // subs = [
  //   this.props.navigation.addListener('didFocus', this.componentDidFocus),
  //   this.props.navigation.addListener('willBlur', this.componentWillBlur),
  // ];

  onLogin = () => {
    const {email, password} = this.state;
    if (!email && !password) {
      SimpleToast.show('Enter data to login', SimpleToast.LONG);
    } else if (email && !isValidEmail(email)) {
      SimpleToast.show('Enter a valid email', SimpleToast.LONG);
    } else {
      this.loginUser(email, password);
    }
  };
  loginUser = (username: string, password: string) => {
    const loginPayload: UserLoginPayload = {
      uname: username,
      upass: password,
    };
    SimpleToast.show('Login being called', SimpleToast.LONG);
    API.userLogin(loginPayload)
      .then((data) => {
        SimpleToast.show('Login Success, Navigating to App', SimpleToast.LONG);
        GLOBALS.store.userLoggedIn = true;
        updateStore(JSON.stringify(GLOBALS.store));
        this.props.navigation.navigate('App');
      })
      .catch((err) => {
        SimpleToast.show(`Login failed due to ${err}`);
        onCatch(err, 'user login');
      });
  };
  public render() {
    return (
      <GoSafe>
        <ImageBackground
          source={ImageAssets.smallLoginBG}
          style={styles.imageBG}
          resizeMode="cover">
          <View style={styles.mainContainer}>
            <Text style={styles.text1}>Login</Text>
            <View style={styles.inputContainer}>
              <TextInput
                autoCorrect={false}
                autoCompleteType="off"
                style={styles.textInputContainer}
                autoCapitalize="none"
                placeholder={'Enter your email'}
                placeholderTextColor="white"
                keyboardType="email-address"
                textContentType="emailAddress"
                selectionColor={globalColors.primary}
                returnKeyLabel="Next"
                returnKeyType="next"
                onChangeText={(text) => {
                  this.setState({email: text});
                }}
                onSubmitEditing={() => {
                  this.passwordTextInputRef.current?.focus();
                }}
              />
              <TextInput
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                ref={this.passwordTextInputRef}
                style={styles.textInputContainer}
                placeholder={'Enter you password'}
                textContentType="password"
                placeholderTextColor="white"
                onChangeText={(text) => {
                  this.setState({password: text});
                }}
                selectionColor={globalColors.primary}
                secureTextEntry
                returnKeyType="done"
                returnKeyLabel="Login"
              />
              <View style={styles.rowStyles}>
                <Text style={styles.text1}>Don't have an email?</Text>
                <TouchableOpacity
                  style={{marginLeft: 10}}
                  onPress={() => {
                    this.props.navigation.navigate('SignupScreen');
                  }}>
                  <Text
                    style={[styles.text1, {textDecorationLine: 'underline'}]}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rightContainer}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: -30,
                  }}
                  onPress={() => {
                    this.onLogin();
                  }}>
                  <Text style={styles.signInText}>User Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    this.onLogin();
                  }}>
                  <Text style={styles.signInText}>Reporter Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('App');
                  }}>
                  <Text style={styles.signInText}>Skip Login as User</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </GoSafe>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: width,
    height: height - 200,
    position: 'absolute',
    top: '22%',
  },
  text1: {
    color: 'black',
    fontSize: GStyle.fontSize.medium,
    textAlign: 'center',
    marginTop: 30,
  },
  textInputContainer: {
    ...SharedStyles.authTextInput1,
  },
  inputContainer: {
    ...SharedStyles.centerAll,
    marginTop: 30,
  },
  rowStyles: {
    flexDirection: 'row',
    ...SharedStyles.centerAll,
  },
  rightContainer: {
    alignSelf: 'center',
    width: '50%',
    marginTop: 20,
    ...SharedStyles.centerAll,
  },
  icon: {
    height: 50,
    width: 50,
  },
  signInText: {
    color: 'black',
    fontSize: GStyle.fontSize.medium,
    textAlign: 'center',
  },
  imageBG: {
    width: width,
    height: height,
  },
});
