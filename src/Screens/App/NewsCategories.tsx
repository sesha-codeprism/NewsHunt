import React from 'react';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
} from 'react-native';
import GoSafe from '../../Components/RNSafe';
import {ImageAssets} from '../../assets/images/index';
import {globalColors} from '../../utils/Colors';
import {categoriesObject} from '../../@types/categoriesObject';
import API from '../../API/api';
import {mainNewsCategories, onCatch, updateStore} from '../../utils/helper';
import {GLOBALS} from '../../utils/globals';
import {SharedStyles, GStyle} from '../../utils/styles';
import SimpleToast from 'react-native-simple-toast';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import FastImage from 'react-native-fast-image';
import {MainNewsCategories} from '../../@types/MainNewsCategories';
import {ViewStyle} from 'react-native';

export interface NewsCategoriesProps extends NavigationStackScreenProps {}

const {width, height} = Dimensions.get('window');
export interface NewsCategoriesState {
  category: string;
  categories: categoriesObject[];
  listItems: Array<number>;
  mainNewsCategories: MainNewsCategories[];
  categoryId: number;
}

export default class NewsCategories extends React.Component<
  NewsCategoriesProps,
  NewsCategoriesState
> {
  constructor(props: NewsCategoriesProps) {
    super(props);

    this.state = {
      category: '',
      categories: [],
      listItems: [],
      mainNewsCategories: [],
      categoryId: 0,
    };
  }
  componentDidMount() {
    this.getCategories();
  }

  getCategories = () => {
    GLOBALS.activityIndicator.show();
    API.getCategories()
      .then(({data}) => {
        let x = mainNewsCategories();
        this.setState({categories: data, mainNewsCategories: x});
        GLOBALS.activityIndicator.hide();
      })
      .catch((err) => onCatch(err, 'Getting categories'));
  };

  selectedCategory = (category: number) => {
    if (this.state.listItems.indexOf(category) === -1) {
      let newList = this.state.listItems;
      newList.push(category);
      this.setState({listItems: newList});
    } else {
      let newList = this.state.listItems.filter(
        (element) => element !== category,
      );
      this.setState({listItems: newList});
    }
  };

  onDone = () => {
    GLOBALS.store.newsCategory = this.state.listItems;
    GLOBALS.mainNewsCategoryId = this.state.categoryId;
    // updateStore(JSON.stringify(GLOBALS.store));
    SimpleToast.show('Category selected...Fetching news', SimpleToast.LONG);
    this.props.navigation.goBack();
  };

  public render() {
    const {categories} = this.state;
    console.log(this.state.listItems);
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={[
                styles.headerText,
                {color: 'black', alignSelf: 'flex-start'},
              ]}>
              Main Categories
            </Text>
            <View style={styles.rowStyles}>
              {this.state.mainNewsCategories.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({categoryId: item.category_id});
                    }}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor:
                          this.state.categoryId === item.category_id
                            ? globalColors.themeBlue
                            : globalColors.mediumGrey,
                      },
                    ]}
                    key={`Index${index}`}>
                    <FastImage
                      source={
                        item.imageURI !== null || item.imageURI !== ''
                          ? item.imageURI
                          : ImageAssets.placeholder
                      }
                      resizeMode="cover"
                      style={styles.imageStyles}
                    />
                    <View style={styles.categoryHeader}>
                      <Text style={[styles.titleText, {alignSelf: 'center'}]}>
                        {item.category_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.underlineStyle} />
            <Text
              style={[
                styles.headerText,
                {color: 'black', alignSelf: 'flex-start'},
              ]}>
              Sub categories
            </Text>
            <View style={styles.rowStyles}>
              {categories.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.selectedCategory(parseInt(item.cid));
                    }}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor:
                          this.state.listItems.indexOf(parseInt(item.cid)) !==
                          -1
                            ? globalColors.themeBlue
                            : globalColors.white,
                      },
                    ]}
                    key={`Index${index}`}>
                    <FastImage
                      source={{uri: item.cimage}}
                      resizeMode={FastImage.resizeMode.cover}
                      style={styles.imageStyles}
                    />
                    <View style={styles.categoryHeader}>
                      <Text style={[styles.titleText, {alignSelf: 'center'}]}>
                        {item.cname}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              this.onDone();
            }}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
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
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
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
  rowStyles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: width * 0.05,
  },
  categoryCard: {
    height: 170,
    width: 140,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    margin: 15,
  },
  categoryHeader: {
    height: '20%',
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 3,
    ...SharedStyles.centerAll,
    marginTop: 10,
  },
  imageStyles: {
    height: '70%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 30,
  },
  titleText: {
    fontSize: GStyle.fontSize.small,
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  continueButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: globalColors.themeBlue,
    height: 50,
    width: 170,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  doneText: {
    color: globalColors.white,
    fontSize: GStyle.fontSize.medium,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  underlineStyle: {
    margin: 10,
    height: 2,
    backgroundColor: 'grey',
    width: width - 30,
    alignSelf: 'center',
  },
});
