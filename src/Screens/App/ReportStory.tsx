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
  KeyboardAvoidingView,
} from 'react-native';
import {NavigationStackProp} from 'react-navigation-stack';
import {NavigationRoute, NavigationParams} from 'react-navigation';
import {globalColors} from '../../utils/Colors';
import {ImageAssets} from '../../assets/images';
import {GStyle, SharedStyles} from '../../utils/styles';
import GoSafe from '../../Components/RNSafe';
import ImagePicker from 'react-native-customized-image-picker';

export interface ReportStoryProps {
  navigation: NavigationStackProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
}

export interface ReportStoryState {
  currentLen: number;
  titleBoxHeight: number;
  titleText: string;
  content: string;
  contentLen: number;
  imageList: Array<any>;
}

const {width, height} = Dimensions.get('window');
const titleTextLen = 150;
const ContentLength = 400;
var listArray = [1, 2, 3, 4, 5];
export default class ReportStory extends React.Component<
  ReportStoryProps,
  ReportStoryState
> {
  TitleTextBox = React.createRef<TextInput>();
  MessageTextBox = React.createRef<TextInput>();
  userImage?: string;
  userTitle?: string;
  userMessage?: string;

  constructor(props: ReportStoryProps) {
    super(props);

    this.state = {
      titleText: '',
      titleBoxHeight: 35,
      currentLen: 150,
      content: '',
      contentLen: 400,
      imageList: [],
    };
  }

  selectImage = (index: number) => {
    ImagePicker.openPicker({
      multiple: true,
    }).then((images: any) => {
      console.log(images);
      this.setState({imageList: images});
    });
  };

  public render() {
    const {
      state: {titleBoxHeight},
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
              <Image source={ImageAssets.menu} style={styles.img} />
            </TouchableOpacity>
            <Text style={styles.headerText}>News Hunt</Text>
          </View>
          <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
            <ScrollView style={styles.contentholder}>
              <View style={styles.headerContainer}>
                <Text style={styles.labelText}>Title</Text>
                <TextInput
                  ref={this.TitleTextBox}
                  style={[styles.textInputStyles, {height: titleBoxHeight}]}
                  placeholder="Add title Here"
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
              <Text style={[styles.labelText,{marginTop:15}]}>Tap on Images to upload</Text>
              <View style={styles.rowStyles}>
                {listArray.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.selectImage(index);
                      }}>
                      <Image
                        source={
                          this.state.imageList.length <= 0
                            ? ImageAssets.androidLogo
                            : {uri: this.state.imageList[index].path}
                        }
                        style={styles.imageStyles}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.labelText}>News Article</Text>
                <TextInput
                  ref={this.MessageTextBox}
                  placeholder="Enter the story details here"
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
                  <TouchableOpacity style={styles.postButton}>
                    <Text style={styles.buttonText}>Post Story</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    marginTop: 30,
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
    height: 100,
    margin:5,
    flexWrap:"wrap"
  },
  imageStyles: {
    height: 50,
    width: 50,
    margin: 10,
  },
});
