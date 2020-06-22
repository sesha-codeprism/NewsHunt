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
import {onCatch, updateStore} from '../../utils/helper';
import {GLOBALS} from '../../utils/globals';
import {SharedStyles, GStyle} from '../../utils/styles';
import SimpleToast from 'react-native-simple-toast';

export interface NewsCategoriesProps extends NavigationStackScreenProps {}

const {width, height} = Dimensions.get('window');
export interface NewsCategoriesState {
  category: String;
  categories: categoriesObject[];
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
    };
  }
  componentDidMount() {
    this.getCategories();
  }

  getCategories = () => {
    GLOBALS.activityIndicator.show();
    API.getCategories()
      .then(({data}) => {
        // console.log(data);
        this.setState({categories: data});
        GLOBALS.activityIndicator.hide();
      })
      .catch((err) => onCatch(err, 'Getting categories'));
  };

  selectedCategory = (category: string) => {
    GLOBALS.store.newsCategory = category;
    updateStore(JSON.stringify(GLOBALS.store));
    SimpleToast.show('Category selected...Fetching news', SimpleToast.LONG);
    this.props.navigation.goBack();
  };

  public render() {
    const {categories} = this.state;
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.rowStyles}>
              {categories.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.selectedCategory(item.cname);
                    }}
                    style={styles.categoryCard}
                    key={`Index${index}`}>
                    <Image
                      source={{uri: item.cimage}}
                      resizeMethod="auto"
                      resizeMode="cover"
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
  rowStyles: {
    flexDirection: 'row',
    ...SharedStyles.centerAll,
    flexWrap: 'wrap',
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
});
