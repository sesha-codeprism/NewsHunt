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
  Platform,
  ActionSheetIOS,
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
import {Picker} from '@react-native-community/picker';

export interface LoginScreenProps extends NavigationStackScreenProps {}

export interface LoginScreenState {
  email: string;
  password: string;
  profile: any;
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
      profile: 0,
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
  profiles = ['Please Pick a profile', 'User', 'Reporter', 'Editor'];

  onLogin = () => {
    const {email, password, profile} = this.state;
    if (!email && !password) {
      SimpleToast.show('Enter data to login', SimpleToast.LONG);
    } else if (!email) {
      SimpleToast.show('Enter username used to register', SimpleToast.LONG);
    } else if (!password) {
      SimpleToast.show('Enter a valid password', SimpleToast.LONG);
    } else if (profile === 0) {
      SimpleToast.show('Select a profile type.', SimpleToast.LONG);
    } else {
      this.loginUser(email, password, profile);
    }
  };
  loginUser = (username: string, password: string, user_type: number) => {
    const loginPayload: UserLoginPayload = {
      uname: username,
      upass: password,
      user_type: user_type,
    };
    SimpleToast.show('Login being called', SimpleToast.LONG);
    API.userLogin(loginPayload)
      .then(({data}) => {
        console.log(data);
        if (data.status !== 400) {
          // SimpleToast.show(
          //   'Login Success, Navigating to App',
          //   SimpleToast.LONG,
          // );
          GLOBALS.store.userLoggedIn = true;
          GLOBALS.store.userId = data.uid;
          updateStore(JSON.stringify(GLOBALS.store));
          this.props.navigation.navigate('App');
        } else {
          SimpleToast.show(`${data.success}`, SimpleToast.LONG);
        }
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
                placeholder={'Enter your username'}
                placeholderTextColor="white"
                keyboardType="web-search"
                textContentType="name"
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
              <View style={styles.boxControl}>
                {Platform.OS !== 'ios' ? (
                  <Picker
                    selectedValue={this.profiles[this.state.profile]}
                    style={{
                      height: '100%',
                      width: '100%',
                      color: 'white',
                      backgroundColor: globalColors.darkGrey,
                    }}
                    onValueChange={(itemValue) =>
                      this.setState(
                        {
                          profile: this.profiles.indexOf(itemValue.toString()),
                        },
                        () => {
                          console.log(
                            this.profiles.indexOf(itemValue.toString()),
                          );
                        },
                      )
                    }>
                    {this.profiles.map((item, index) => {
                      return (
                        <Picker.Item
                          key={`Item${index}`}
                          label={item}
                          value={item}></Picker.Item>
                      );
                    })}
                  </Picker>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      ActionSheetIOS.showActionSheetWithOptions(
                        {
                          options: [...this.profiles, 'Cancel'],
                          cancelButtonIndex: this.profiles.length,
                        },
                        (buttonIndex) => {
                          this.setState({
                            profile: buttonIndex,
                          });
                        },
                      );
                    }}>
                    <Text style={styles.textInputText}>
                      {this.profiles[this.state.profile]}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
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
                    height: 50,
                    width: 120,
                    backgroundColor: globalColors.themeBlue,
                  }}
                  onPress={() => {
                    this.onLogin();
                  }}>
                  <Text style={styles.signInText}>Login</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
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
    color: globalColors.white,
    fontSize: GStyle.fontSize.medium,
    textAlign: 'center',
    fontWeight: '600',
  },
  imageBG: {
    width: width,
    height: height,
  },
  boxControl: {
    margin: 10,
    height: 40,
    width: '80%',
    marginBottom: 5,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: globalColors.primary,
    backgroundColor: globalColors.darkGrey,
    paddingHorizontal: 25,
  },
  textInputText: {
    fontSize: 16,
    width: '100%',
    height: '100%',
    paddingLeft: 10,
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 5,
  },
});
