import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  ActionSheetIOS,
  KeyboardAvoidingView,
} from 'react-native';
import {NavigationStackProp} from 'react-navigation-stack';
import {NavigationRoute, NavigationParams} from 'react-navigation';
import {globalColors} from '../../utils/Colors';
import {ImageAssets} from '../../assets/images';
import {GStyle, SharedStyles} from '../../utils/styles';
import GoSafe from '../../Components/RNSafe';
//@ts-ignore
import ImagePicker from 'react-native-customized-image-picker';
import {Picker} from '@react-native-community/picker';
import API from '../../API/api';
import {onCatch} from '../../utils/helper';
import {categoriesObject} from 'src/@types/categoriesObject';
import {GLOBALS} from '../../utils/globals';
import FastImage from 'react-native-fast-image';
import {
  ConstituencyObject,
  DistrictObject,
  StateObject,
} from 'src/@types/StateObject';

var FormData = require('form-data');

export interface ReportComplaintProps {
  navigation: NavigationStackProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
}

export interface ReportComplaintState {
  currentLen: number;
  titleBoxHeight: number;
  titleText: string;
  content: string;
  contentLen: number;
  imageList: Array<any>;
  videoURL: string;
  image: any;
  statesArray: StateObject[];
  districtsArray: DistrictObject[];
  constituencyArray: ConstituencyObject[];
  selectedState: StateObject | any;
  selectedDistrict: DistrictObject | any;
  selectedConstituency: ConstituencyObject | any;
}

const {width, height} = Dimensions.get('window');
const titleTextLen = 150;
const ContentLength = 400;
var listArray = [1, 2, 3, 4, 5];
export default class ReportComplaints extends React.Component<
  ReportComplaintProps,
  ReportComplaintState
> {
  TitleTextBox = React.createRef<TextInput>();
  MessageTextBox = React.createRef<TextInput>();
  userImage?: string;
  userTitle?: string;
  userMessage?: string;
  cameraOptions = ['Camera', 'Gallery'];

  constructor(props: ReportComplaintProps) {
    super(props);

    this.state = {
      titleText: '',
      titleBoxHeight: 35,
      currentLen: 150,
      content: '',
      contentLen: 400,
      imageList: [],
      videoURL: '',
      image: '',
      statesArray: [],
      districtsArray: [],
      constituencyArray: [],
      selectedState: '',
      selectedDistrict: '',
      selectedConstituency: '',
    };
  }
  componentDidMount() {
    this.getStates();
  }
  getStates = () => {
    GLOBALS.activityIndicator.show();
    API.getStates()
      .then(({data}) => {
        //console.log(data);
        this.setState(
          {
            statesArray: data,
            selectedState: data[0],
          },
          () => {
            this.getDistricts(this.state.selectedState);
          },
        );
        GLOBALS.activityIndicator.hide();
      })
      .catch((err) => {
        GLOBALS.activityIndicator.hide();
        onCatch(err, 'Getting categories');
      });
  };
  getDistricts = (stateObject: StateObject) => {
    API.getDistricts({state_id: stateObject.id})
      .then(({data}) => {
        //console.log(data);
        this.setState(
          {
            districtsArray: data,
            selectedDistrict: data[0],
          },
          () => {
            this.getConstituencies(this.state.selectedDistrict);
          },
        );
      })
      .catch((err) => {
        onCatch(err, 'Getting categories');
      });
  };

  getConstituencies = (districtObject: DistrictObject) => {
    API.getConstituencies({
      stateId: parseInt(this.state.selectedState.id),
      districtId: parseInt(districtObject.id),
    })
      .then(({data}) => {
        //console.log(data);
        this.setState({
          constituencyArray: data,
          selectedConstituency: data[0],
        });
      })
      .catch((err) => {
        onCatch(err, 'Getting categories');
      });
  };

  showPicker = () => {
    return Platform.OS !== 'ios' ? (
      <Picker
        onValueChange={(value) => {
          this.onValueChange;
        }}>
        {this.cameraOptions.map((code) => (
          <Picker.Item label={code} value={code} key={code} />
        ))}
      </Picker>
    ) : (
      <TouchableOpacity
        onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: [...this.cameraOptions, 'Cancel'],
              cancelButtonIndex: this.cameraOptions.length,
            },
            (buttonIndex) => {
              this.imagePick(this.cameraOptions[buttonIndex]);
            },
          );
        }}></TouchableOpacity>
    );
  };

  onValueChange = (value: string, index: number) => {
    this.imagePick(value);
  };

  imagePick = (option: string) => {
    if (option === 'Camera') {
      ImagePicker.openCamera({
        cropping: true,
      }).then((image: any) => {
        this.setState({image: image.path});
      });
    } else {
      ImagePicker.openPicker({
        multiple: true,
      }).then((images: any) => {
        console.log(images[0].path);
        // this.setState({imageList: images});
      });
    }
  };
  selectImage = (index: number) => {
    ImagePicker.openPicker({
      maxSize: 5,
      multiple: true,
    }).then((images: any) => {
      // console.log(images[0].path);
      this.setState({imageList: images});
    });
  };

  selectVideo = () => {
    ImagePicker.openPicker({
      isVideo: true,
    })
      .then((image: any) => {
        this.setState({videoURL: image[0].path});
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  uploadStory = () => {
    var formData = new FormData();
    var imagelist = this.state.imageList;
    var a: any[] = [];
    imagelist.forEach((item, index) => {
      const cleanPath = item.path.replace('file://', '');
      const newFile = {
        uri: cleanPath,
        type: 'image/jpeg',
      };
      a.push(newFile);
    });
    this.state.imageList.forEach((item, i) => {
      var filename = item.path.split('/');
      const name = filename[filename.length - 1];
      formData.append('postingImages[]', {
        uri: item.path,
        type: item.mime,
        name: item.filename || name,
      });
    });
    // formData.append('ncate', this.state.categoryItem.cid);
    // formData.append('posttype', this.state.categoryItem.id);
    formData.append('ntitle', this.state.titleText);
    formData.append('ntext', this.state.content);
    formData.append('nmtype', 'image');
    formData.append('nuid', GLOBALS.store.userId);
    if (
      this.state.videoURL !== null &&
      this.state.videoURL !== undefined &&
      this.state.videoURL !== ''
    ) {
      formData.append('video_files', this.state.videoURL);
    }
    console.log('FormData set...Calling API');

    API.userStoryUpload(formData)
      .then(({data}) => {
        console.log(data);
        this.props.navigation.goBack();
      })
      .catch((err) => onCatch(err, 'Uploading user story'));
  };

  reportStory = () => {
    var imagelist = this.state.imageList;
    var a: any[] = [];
    imagelist.forEach((item, index) => {
      a.push(item.path);
    });

    API.userReportStory({
      posting_images: a,
      ntitle: this.state.titleText,
      ntext: this.state.content,
      nmtype: 'image',
      nuid: 1,
      videoFiles: this.state.videoURL,
    })
      .then(({data}) => {
        console.log(data);
        this.props.navigation.goBack();
      })
      .catch((err) => onCatch(err, 'reporting story'));
  };

  public render() {
    const {
      state: {titleBoxHeight, imageList},
    } = this;
    return (
      <GoSafe hideStatusBar>
        <View style={styles.main}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => {
                this.props.navigation.openDrawer();
              }}>
              <FastImage source={ImageAssets.menu} style={styles.img} />
            </TouchableOpacity>
            <Text style={styles.headerText}>News Hunt</Text>
          </View>
          <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
            <ScrollView style={styles.contentholder}>
              <View style={styles.headerContainer}>
                <Text style={styles.labelText}>Complaint Title</Text>
                <TextInput
                  ref={this.TitleTextBox}
                  style={[styles.textInputStyles, {height: titleBoxHeight}]}
                  placeholder="Add complaint title Here"
                  maxLength={titleTextLen}
                  multiline={true}
                  numberOfLines={5}
                  placeholderTextColor={globalColors.sleepGrey}
                  onChangeText={(value) => {
                    this.userTitle = value;
                    this.setState({
                      titleText: value,
                      currentLen: titleTextLen - value.length,
                    });
                  }}
                  selectionColor={globalColors.primary}
                />
                <Text style={styles.lengthHolder}>
                  {this.state.currentLen}/{titleTextLen}
                </Text>
              </View>
              <Text style={[styles.labelText, {marginTop: 15}]}>
                Tap on Images to upload
              </Text>
              <View style={styles.rowStyles}>
                {imageList.length <= 0
                  ? listArray.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.selectImage(index);
                          }}
                          key={`Index${index}`}>
                          <FastImage
                            source={ImageAssets.placeholder}
                            style={styles.imageStyles}
                          />
                        </TouchableOpacity>
                      );
                    })
                  : imageList.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.selectImage(index);
                          }}
                          key={`Index${index}`}>
                          <FastImage
                            source={{uri: imageList[index].path}}
                            style={styles.imageStyles}
                          />
                        </TouchableOpacity>
                      );
                    })}
              </View>
              <View style={{flexDirection: 'column', marginTop: 50}}>
                <Text style={[styles.labelText, {marginBottom: 10}]}>
                  Select state
                </Text>
                <View style={styles.boxControl}>
                  {Platform.OS !== 'ios' ? (
                    <Picker
                      mode="dropdown"
                      selectedValue={this.state.selectedState.id}
                      style={{
                        height: '100%',
                        width: '100%',
                        color: 'white',
                        backgroundColor: globalColors.darkGrey,
                      }}
                      onValueChange={(value, itemIndex: number) => {
                        this.setState(
                          {
                            selectedState: this.state.statesArray[itemIndex],
                          },
                          () => {
                            this.getDistricts(this.state.selectedState);
                          },
                        );
                      }}>
                      {this.state.statesArray.map((item, index) => {
                        return (
                          <Picker.Item
                            key={`Item${index}`}
                            label={item.state_name}
                            value={item.id}></Picker.Item>
                        );
                      })}
                    </Picker>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        ActionSheetIOS.showActionSheetWithOptions(
                          {
                            options: [
                              ...this.state.statesArray.map(
                                (item) => item.state_name,
                              ),
                              'Cancel',
                            ],
                            cancelButtonIndex: this.state.statesArray.length,
                          },
                          (buttonIndex) => {
                            this.setState({});
                          },
                        );
                      }}>
                      <Text style={styles.textInputText}>
                        {this.state.selectedState.state_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={{flexDirection: 'column', marginTop: 20}}>
                <Text style={[styles.labelText, {marginBottom: 10}]}>
                  Select district
                </Text>
                <View style={styles.boxControl}>
                  {Platform.OS !== 'ios' ? (
                    <Picker
                      mode="dropdown"
                      selectedValue={this.state.selectedDistrict.district_name}
                      style={{
                        height: '100%',
                        width: '100%',
                        color: 'white',
                        backgroundColor: globalColors.darkGrey,
                      }}
                      onValueChange={(value, itemIndex: number) => {
                        this.setState(
                          {
                            selectedDistrict: this.state.districtsArray[
                              itemIndex
                            ],
                          },
                          () => {
                            this.getConstituencies(this.state.selectedDistrict);
                          },
                        );
                      }}>
                      {this.state.districtsArray.map((item, index) => {
                        return (
                          <Picker.Item
                            key={`Item${index}`}
                            label={item.district_name}
                            value={item.id}></Picker.Item>
                        );
                      })}
                    </Picker>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        ActionSheetIOS.showActionSheetWithOptions(
                          {
                            options: [
                              ...this.state.statesArray.map(
                                (item) => item.state_name,
                              ),
                              'Cancel',
                            ],
                            cancelButtonIndex: this.state.statesArray.length,
                          },
                          (buttonIndex) => {
                            this.setState({});
                          },
                        );
                      }}>
                      <Text style={styles.textInputText}>
                        {this.state.selectedDistrict.district_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={{flexDirection: 'column', marginTop: 20}}>
                <Text style={[styles.labelText, {marginBottom: 10}]}>
                  Select constituency
                </Text>
                <View style={styles.boxControl}>
                  {Platform.OS !== 'ios' ? (
                    <Picker
                      mode="dropdown"
                      selectedValue={
                        this.state.selectedConstituency.constituency_name
                      }
                      style={{
                        height: '100%',
                        width: '100%',
                        color: 'white',
                        backgroundColor: globalColors.darkGrey,
                      }}
                      onValueChange={(value, itemIndex: number) => {
                        this.setState({});
                      }}>
                      {this.state.constituencyArray.map((item, index) => {
                        return (
                          <Picker.Item
                            key={`Item${index}`}
                            label={item.constituency_name}
                            value={item.id}></Picker.Item>
                        );
                      })}
                    </Picker>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        ActionSheetIOS.showActionSheetWithOptions(
                          {
                            options: [
                              ...this.state.statesArray.map(
                                (item) => item.state_name,
                              ),
                              'Cancel',
                            ],
                            cancelButtonIndex: this.state.constituencyArray
                              .length,
                          },
                          (buttonIndex) => {
                            this.setState({});
                          },
                        );
                      }}>
                      <Text style={styles.textInputText}>
                        {this.state.selectedConstituency.constituency_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <Text style={[styles.labelText, {marginTop: 20}]}>
                Tap on Image to upload a video
              </Text>
              <View style={styles.rowStyles}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectVideo();
                  }}>
                  <FastImage
                    source={
                      this.state.videoURL !== ''
                        ? {uri: this.state.videoURL}
                        : ImageAssets.placeholder
                    }
                    style={styles.imageStyles}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.labelText}>Complaint details</Text>
                <TextInput
                  ref={this.MessageTextBox}
                  placeholder="Enter the complaint details here"
                  multiline={true}
                  numberOfLines={20}
                  maxLength={ContentLength}
                  placeholderTextColor={globalColors.sleepGrey}
                  style={styles.textInputStyles1}
                  onChangeText={(i) => {
                    this.userMessage = i;
                    this.setState({
                      content: i,
                      contentLen: ContentLength - i.length,
                    });
                  }}
                />
                <Text style={styles.lengthHolder}>
                  {this.state.contentLen}/{ContentLength}
                </Text>
              </View>
              <View style={styles.bottomContainer}>
                <View style={styles.horizontalContentContainer}>
                  <View style={styles.imageContainer}>
                    <TouchableOpacity>
                      {/* <Image
											source={GoImages.camera}
											style={styles.image}
											resizeMode="contain"
										/> */}
                    </TouchableOpacity>
                    {/* <TouchableOpacity>
									<FastImage  source={GoImages.video} style={styles.image} resizeMode={FastImage.resizeMode.contain} />
								</TouchableOpacity> */}
                  </View>
                  <TouchableOpacity
                    style={styles.postButton}
                    onPress={() => {
                      this.uploadStory();
                    }}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{height: height * 0.1}}></View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </GoSafe>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    width: width,
    height: height,
  },
  header: {
    height: 60,
    width: width,
    backgroundColor: globalColors.themeBlue,
    flexDirection: 'row',
  },
  img: {
    height: 24,
    width: 24,
    marginLeft: 10,
    marginBottom: '38%',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 20,
    marginLeft: 5,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 18,
    marginLeft: '10%',
    letterSpacing: 1.2,
  },
  pagingCard: {
    height: height * 1,
    width: width,
  },
  newsImage: {
    height: '35%',
    width: width,
    top: -0.8,
  },
  newsTitle: {
    width: width,
    padding: 10,
  },
  newsContent: {
    width: width,
    padding: 10,
  },
  contentholder: {
    width: width - 10,
    height: '100%',
    padding: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    height: 70,
    width: '95%',
    justifyContent: 'space-evenly',
  },
  labelText: {
    color: globalColors.darkest,
    fontSize: GStyle.fontSize.mini,
    marginBottom: 5,
  },
  textInputStyles: {
    width: '100%',
    borderRadius: 20,
    height: 35,
    borderWidth: 1,
    borderColor: globalColors.sleepGrey,
    padding: 10,
    fontSize: GStyle.fontSize.mini,
    color: globalColors.darkest,
  },
  lengthHolder: {
    color: globalColors.sleepGrey,
    fontSize: GStyle.fontSize.mini,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  contentContainer: {
    justifyContent: 'space-evenly',
    width: '95%',
  },
  textInputStyles1: {
    width: '100%',
    borderRadius: 20,
    height: 120,
    borderWidth: 1,
    borderColor: globalColors.sleepGrey,
    padding: 10,
    fontSize: GStyle.fontSize.mini,
    color: globalColors.darkest,
    maxWidth: width - 60,
    marginTop: 5,
    marginBottom: 5,
    marginVertical: -10,
  },
  bottomContainer: {
    marginTop: 10,
  },
  horizontalContentContainer: {
    height: 50,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: GStyle.fontSize.mini,
    color: globalColors.white,
    textTransform: 'capitalize',
  },
  postButton: {
    width: 120,
    height: 30,
    borderRadius: 25,
    backgroundColor: globalColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -8,
  },
  image: {
    height: 20,
    width: 20,
  },
  rowStyles: {
    flexDirection: 'row',
    height: 80,
    margin: 5,
    flexWrap: 'wrap',
  },
  imageStyles: {
    height: 50,
    width: 50,
    margin: 10,
  },
  boxControl: {
    height: 40,
    width: '100%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: globalColors.primary,
    backgroundColor: globalColors.darkGrey,
    paddingHorizontal: 10,
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
