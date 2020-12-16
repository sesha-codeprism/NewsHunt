import {NavigationStackScreenProps} from 'react-navigation-stack';
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Image,
  ActionSheetIOS,
  ImageBackground,
} from 'react-native';
import {globalColors} from '../../utils/Colors';
import React from 'react';
import {GStyle, SharedStyles} from '../../utils/styles';
import {ImageAssets} from '../../assets/images';
import {Platform} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {
  isValidEmail,
  isValidMobileNum,
  onCatch,
  updateStore,
} from '../../utils/helper';
import API from '../../API/api';
import {GLOBALS} from '../../utils/globals';
import {Picker} from '@react-native-community/picker';
import FastImage from 'react-native-fast-image';

export interface SignUpScreenProps extends NavigationStackScreenProps {}

export interface SignUpScreenState {
  email: string;
  password: string;
  phone: string;
  username: string;
  fname: string;
  profile: any;
}

const {width, height} = Dimensions.get('window');
export default class SignUpScreen extends React.Component<
  SignUpScreenProps,
  SignUpScreenState
> {
  private nameTextInput = React.createRef<TextInput>();
  private emailTextInput = React.createRef<TextInput>();
  private fnameRef = React.createRef<TextInput>();
  private passwordTextInput = React.createRef<TextInput>();
  private verifyPasswordTextInput = React.createRef<TextInput>();
  profiles = ['Please Pick a profile', 'User', 'Reporter', 'Editor'];

  constructor(props: SignUpScreenProps) {
    super(props);

    this.state = {
      email: '',
      password: '',
      phone: '',
      fname: '',
      username: '',
      profile: 1,
    };
  }
  componentDidMount() {}

  componentDidFocus = () => {
    console.log('Signup Screen');
  };

  componentWillBlur = () => {
    console.log('Signup Screen Screen blurred');
  };
  subs = [
    this.props.navigation.addListener('didFocus', this.componentDidFocus),
    this.props.navigation.addListener('willBlur', this.componentWillBlur),
  ];

  onSignUP = () => {
    console.log(this.state);
    const {email, password, phone, username, fname, profile} = this.state;
    if (!email && !phone) {
      SimpleToast.show('Enter Valid Email or Mobile Number', SimpleToast.LONG);
    } else if (email && !isValidEmail(email)) {
      SimpleToast.show('Enter a valid email address', SimpleToast.LONG);
    } else if (phone && !isValidMobileNum(phone)) {
      SimpleToast.show('Enter a valid Mobile number', SimpleToast.LONG);
    } else if (!username) {
      SimpleToast.show('Enter a valid Name', SimpleToast.LONG);
    } else if (!fname) {
      SimpleToast.show('Enter your first name.', SimpleToast.LONG);
    } else if (!password) {
      SimpleToast.show('Enter a valid password', SimpleToast.LONG);
    } else if (profile === 0) {
      SimpleToast.show('Select a profile type.', SimpleToast.LONG);
    } else {
      this.SignUp(username, password, email, phone);
      // console.log('This is response.', this.state);
    }
  };

  SignUp = (
    username: string,
    password: string,
    email: string,
    phone: string,
  ) => {
    const payload = {
      uname: username,
      upass: password,
      user_type: this.state.profile,
      ufname: this.state.fname,
      uphone: phone,
      uemail: email,
    };
    SimpleToast.show('Signup called....Signing you up', SimpleToast.LONG);
    GLOBALS.activityIndicator.show();
    API.userSignUp(payload)
      .then(({data}) => {
        console.log(data);
        GLOBALS.activityIndicator.hide();
        SimpleToast.show(
          'Sign up Success..Taking you to the app',
          SimpleToast.LONG,
        );
        // GLOBALS.store.userLoggedIn = true;
        // updateStore(JSON.stringify(GLOBALS.store));
        this.props.navigation.navigate('LoginScreen');
      })
      .catch((err) => {
        SimpleToast.show(`Signup failed due to ${err}.`, SimpleToast.LONG);
        onCatch(err, 'signUp');
      });
  };

  public render() {
    return (
      <ImageBackground
        source={ImageAssets.smallLoginBG}
        resizeMode="cover"
        style={styles.imageBG}>
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
          <View style={styles.mainContainer}>
            <View style={styles.innerContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                  <View style={styles.textContainer}>
                    <Text style={styles.textStyle}>
                      Please enter your details
                    </Text>
                    <View style={styles.hr} />
                  </View>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      ref={this.nameTextInput}
                      style={styles.LanguageContainer}
                      autoCapitalize="words"
                      placeholder="Enter your name"
                      placeholderTextColor="white"
                      onChangeText={(text) => {
                        this.setState({username: text});
                      }}
                      onSubmitEditing={() => {
                        this.fnameRef.current?.focus();
                      }}
                      blurOnSubmit
                      selectionColor={globalColors.primary}
                      returnKeyType="next"
                      returnKeyLabel="next"
                    />
                    <View style={styles.tinyContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('ForgotPassword');
                        }}>
                        <View style={styles.rowStyles}>
                          <Text style={styles.errorText}>
                            * This username is used whenever you login in place
                            of email.
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      ref={this.fnameRef}
                      style={styles.LanguageContainer}
                      autoCapitalize="words"
                      placeholder="Enter your first name"
                      placeholderTextColor="white"
                      onChangeText={(text) => {
                        this.setState({fname: text});
                      }}
                      onSubmitEditing={() => {
                        this.emailTextInput.current?.focus();
                      }}
                      blurOnSubmit
                      selectionColor={globalColors.primary}
                      returnKeyType="next"
                      returnKeyLabel="next"
                    />
                    <TextInput
                      ref={this.emailTextInput}
                      style={styles.LanguageContainer}
                      autoCapitalize="none"
                      placeholder="Enter your email"
                      placeholderTextColor="white"
                      keyboardType="email-address"
                      onSubmitEditing={() => {
                        this.passwordTextInput.current?.focus();
                      }}
                      blurOnSubmit
                      selectionColor={globalColors.primary}
                      returnKeyType="next"
                      returnKeyLabel="next"
                      onChangeText={(text) => {
                        this.setState({email: text});
                      }}
                    />
                    <TextInput
                      ref={this.passwordTextInput}
                      autoCompleteType="off"
                      textContentType="none"
                      style={styles.LanguageContainer}
                      placeholder="Enter your password"
                      placeholderTextColor="white"
                      onChangeText={(text) => {
                        this.setState({password: text});
                      }}
                      onSubmitEditing={() => {
                        this.verifyPasswordTextInput.current?.focus();
                      }}
                      blurOnSubmit
                      keyboardType="default"
                      selectionColor={globalColors.primary}
                      returnKeyType="next"
                      returnKeyLabel="next"
                      secureTextEntry
                    />
                    <TextInput
                      ref={this.verifyPasswordTextInput}
                      style={styles.LanguageContainer}
                      placeholder="Enter mobile Number"
                      placeholderTextColor="white"
                      onChangeText={(text) => {
                        this.setState({phone: text});
                      }}
                      maxLength={10}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        console.log('Response', this.state);
                      }}
                      selectionColor={globalColors.primary}
                    />

                    {/* <View style={styles.boxControl}>
                      {Platform.OS !== 'ios' ? (
                        <Picker
                          enabled={false}
                          selectedValue={this.profiles[this.state.profile]}
                          style={{
                            height: '100%',
                            width: '100%',
                            color: 'white',
                          }}
                          onValueChange={(itemValue) =>
                            this.setState(
                              {
                                profile: this.profiles.indexOf(
                                  itemValue.toString(),
                                ),
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
                    </View> */}
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      alignContent: 'center',
                      flexDirection: 'row',
                      marginTop: 20,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.goBack();
                      }}>
                      <Text style={styles.loginText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={this.onSignUP}>
                      <FastImage
                        source={ImageAssets.rightArrow}
                        style={{height: 15, width: 15}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    ...SharedStyles.centerAll,
  },
  container: {
    width: width,
    height: height - 130,
  },
  textStyle: {
    fontSize: GStyle.fontSize.medium,
    color: globalColors.white,
  },
  textContainer: {
    alignItems: 'center',
    alignContent: 'center',
    marginTop: Platform.OS === 'android' ? '0%' : '8%',
  },
  hr: {
    height: 1,
    width: '40%',
    backgroundColor: globalColors.primary,
    marginTop: 10,
    marginBottom: 10,
  },
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? '5%' : '10%',
  },
  LanguageContainer: {
    ...SharedStyles.authTextInput,
  },
  buttonContainer: {
    backgroundColor: globalColors.primary,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 50,
    zIndex: 100,
  },
  innerContainer: {
    ...SharedStyles.centerAll,
    marginTop: height * 0.25,
    alignSelf: 'center',
  },
  loginText: {
    fontSize: GStyle.fontSize.small,
    color: globalColors.darkest,
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
    backgroundColor: globalColors.textInputBG,
    paddingHorizontal: 25,
  },
  rightContainer: {
    alignSelf: 'flex-end',
    width: '50%',
    marginTop: 20,
  },
  icon: {
    height: 50,
    width: 50,
  },
  signInText: {
    color: 'black',
    fontSize: GStyle.fontSize.small,
    textAlign: 'center',
  },
  imageBG: {
    width: width,
    height: height,
  },
  tinyContainer: {
    justifyContent: 'center',
    overflow: 'scroll',
    alignContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: '5%',
    width: '90%',
  },
  errorText: {
    fontSize: GStyle.fontSize.xmini,
    color: globalColors.darkest,
    textAlign: 'center',
  },
  rowStyles: {
    flexDirection: 'row',
  },
});
