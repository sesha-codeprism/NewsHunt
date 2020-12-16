import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
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
import API from '../../API/api';
import {onCatch} from '../../utils/helper';
import {newsObject} from '../../@types/newsObject';
import {GStyle} from '../../utils/styles';
import {GLOBALS} from '../../utils/globals';
import SimpleToast from 'react-native-simple-toast';
import {categoryNewsObject, UserNewsObject} from '../../@types/UserNewsObject';
import FastImage from 'react-native-fast-image';

export interface HomeScreenProps {
  navigation: NavigationStackProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
}

export interface HomeScreenState {
  newsData: newsObject[];
  category: Array<number>;
  userNews: boolean;
  userNewsObject: categoryNewsObject[];
  startindex: number;
  size: number;
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
      category: GLOBALS.store.newsCategory || [],
      userNews: false,
      userNewsObject: [],
      startindex: 1,
      size: 40,
    };
  }
  componentDidMount() {
    this.getAllNews();
  }

  componentDidFocus = () => {
    let x: string = this.state.category.join(',');
    let y: string = GLOBALS.store.newsCategory.join(',');
    if (this.state.category) {
      if (x !== y) {
        SimpleToast.show('Getting news by selected category', SimpleToast.LONG);
        this.setState({category: GLOBALS.store.newsCategory}, () => {
          this.getNewsByCategory(GLOBALS.store.newsCategory);
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

  getNewsByCategory = (category: any) => {
    GLOBALS.activityIndicator.show();
    API.newsByCategory({
      ncate: GLOBALS.store.newsCategory,
      size: this.state.size,
      startindex: this.state.startindex,
      posttype: GLOBALS.mainNewsCategoryId,
      nuid: GLOBALS.store.userId,
    })
      .then(({data}) => {
        console.log(JSON.stringify(data[0]));
        this.setState({userNews: true, userNewsObject: data});
        GLOBALS.activityIndicator.hide();
      })
      .catch((err) => onCatch(err, 'getting news by category'));
  };

  renderUserNewsItem = ({item}) => (
    <View style={styles.pagingCard}>
      <FastImage
        source={
          item.news_image !== null && item.news_image !== ''
            ? {uri: item.news_image, priority: 'high', cache: 'immutable'}
            : // : {
              //     uri:
              //       'http://www.tookee.in/gaganadmin/images/news/23-02174542.jpg',
              //   }
              ImageAssets.placeholder
        }
        style={styles.newsImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.newsTitle}>
        <Text style={{fontSize: GStyle.fontSize.large}}>{item.news_title}</Text>
      </View>
      <View style={styles.newsContent}>
        <Text style={{fontSize: GStyle.fontSize.medium}}>{item.news_text}</Text>
      </View>
    </View>
  );

  renderNewsItem = ({item}) => (
    <View style={styles.pagingCard}>
      <FastImage
        source={
          item.news_image !== null && item.news_image !== ''
            ? {uri: item.news_image, priority: 'high', cache: 'immutable'}
            : ImageAssets.placeholder
        }
        style={styles.newsImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.newsTitle}>
        <Text style={{fontSize: GStyle.fontSize.medium}}>
          {item.news_title}
        </Text>
      </View>
      <View style={styles.newsContent}>
        <Text style={{fontSize: GStyle.fontSize.small}}>{item.news_text}</Text>
      </View>
    </View>
  );
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
              <FastImage
                source={ImageAssets.menu}
                style={styles.img}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>News Hunt</Text>
          </View>
          {this.state.userNews && (
            <FlatList
              horizontal
              pagingEnabled={true}
              snapToInterval={width}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={500}
              decelerationRate="fast"
              snapToAlignment="center"
              data={this.state.userNewsObject}
              keyExtractor={(item) => item.news_id}
              renderItem={this.renderUserNewsItem}
              windowSize={10}
            />
          )}
          {!this.state.userNews && (
            <FlatList
              horizontal
              pagingEnabled={true}
              snapToInterval={width}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={500}
              decelerationRate="fast"
              snapToAlignment="center"
              data={this.state.newsData}
              keyExtractor={(item) => item.news_id}
              renderItem={this.renderNewsItem}
              windowSize={10}
              maxToRenderPerBatch={5}
              onEndReachedThreshold={35}
              onEndReached={() => {
                this.getNewsByCategory(GLOBALS.store.newsCategory);
              }}
            />
          )}
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
