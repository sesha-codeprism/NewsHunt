import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import {NavigationStackProp} from 'react-navigation-stack';
import {
  NavigationRoute,
  NavigationParams,
  SafeAreaView,
} from 'react-navigation';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import {globalColors} from '../../utils/Colors';
import {ImageAssets} from '../../assets/images';
import GoSafe from '../../Components/RNSafe';
import {TouchableOpacity} from 'react-native-gesture-handler';
import API from '../../API/api';
import {onCatch} from '../../utils/helper';
import {newsObject} from '../../@types/newsObject';
import {GStyle} from '../../utils/styles';
import {GLOBALS} from '../../utils/globals';
import SimpleToast from 'react-native-simple-toast';

export interface HomeScreenProps {
  navigation: NavigationStackProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
}

export interface HomeScreenState {
  newsData: newsObject[];
  category: string;
}
const {width, height} = Dimensions.get('window');
export default class HomeScreen extends React.Component<
  HomeScreenProps,
  HomeScreenState
> {
  constructor(props: HomeScreenProps) {
    super(props);

    this.state = {
      newsData: [],
      category: GLOBALS.store.newsCategory || '',
    };
  }
  componentDidMount() {
    this.getAllNews();
  }

  componentDidFocus = () => {
    console.log(this.state.category, GLOBALS.store.newsCategory);
    if (this.state.category) {
      if (this.state.category !== GLOBALS.store.newsCategory) {
        SimpleToast.show('Getting news by selected category', SimpleToast.LONG);
        this.setState({category: this.state.category}, () => {
          this.getNewsByCategory(this.state.category);
        });
      }
    } else {
      this.setState({category: GLOBALS.store.newsCategory});
    }
  };

  subs = [
    this.props.navigation.addListener('didFocus', this.componentDidFocus),
  ];
  getAllNews = () => {
    GLOBALS.activityIndicator.show();
    API.getNews()
      .then(({data}) => {
        GLOBALS.activityIndicator.hide();
        this.setState({newsData: data});
      })
      .catch((err) => onCatch(err, 'Getting News'));
  };

  getNewsByCategory = (category: string) => {
    GLOBALS.activityIndicator.show();
    API.getNewsByCategory(category)
      .then(({data}) => {
        this.setState({newsData: data});
        GLOBALS.activityIndicator.hide();
      })
      .catch((err) => onCatch(err, 'getting news by category'));
  };
  public render() {
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
          <ScrollView
            pagingEnabled
            horizontal={true}
            snapToInterval={width}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={500}
            decelerationRate="fast"
            snapToAlignment={'center'}>
            {this.state.newsData.map((item, index) => {
              return (
                <View key={`Index${index}`} style={styles.pagingCard}>
                  <Image
                    source={
                      item.news_image.trim() == ''
                        ? {uri: item.news_image}
                        : {
                            uri:
                              'http://www.tookee.in/gaganadmin/images/news/23-02174542.jpg',
                          }
                    }
                    style={styles.newsImage}
                    resizeMethod="auto"
                  />
                  <View style={styles.newsTitle}>
                    <Text style={{fontSize: GStyle.fontSize.medium}}>
                      {item.news_title}
                    </Text>
                  </View>
                  <View style={styles.newsContent}>
                    <Text style={{fontSize: GStyle.fontSize.small}}>
                      {item.news_text}
                    </Text>
                  </View>
                </View>
              );
            })}
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
});
