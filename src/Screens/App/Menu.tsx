import React, {Component} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {SharedStyles, GStyle} from '../../utils/styles';
import {globalColors} from '../../utils/Colors';
import GoSafe from '../../Components/RNSafe';
import {DrawerNavigatorItemsProps} from '../..//@types/DrawerNavigationItemProps';
import {ImageAssets} from '../../assets/images';
import AsyncStorage from '@react-native-community/async-storage';
import {resetGlobalStore} from '../../utils/globals';

const drawerItems = () => [
  // {title: 'Regional', screen: 'NewRemindersScreen'},
  // {title: 'National', screen: 'HealthLog'},
  // {title: 'International', screen: 'AllPlans'},
  {title: 'News Categories', screen: 'NewsCategories'},
  {title: 'Settings', screen: 'Subscription'},
  {title: 'Audio Record', screen: 'AudioRecord'},
  {title: 'Report Story', screen: 'ReportStory'},
  // {title: 'About Us', screen: 'AboutUs'},
  // {title: 'Privacy y', screen: 'PrivacyPolicy'},
  // {title: 'Terms of', screen: 'TermsOfUse'},
  // {title: 'Contact', screen: 'Contact Us'},
];

const renderListItem = (data: any, props: any) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          props.navigation.closeDrawer();
          props.navigation.navigate(data.item.screen);
        }}
        style={styles.rowStyle}>
        <Image
          source={ImageAssets.androidW}
          resizeMode="contain"
          style={styles.img}
        />
        <Text style={{color: globalColors.white, fontSize: 16, marginLeft: 30}}>
          {data.item.title}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          width: '80%',
          height: 1,
          backgroundColor: 'white',
          alignSelf: 'center',
        }}
      />
    </>
  );
};
const logout = async (props: any) => {
  console.log('Logout called');
  const asyncStorageKeys = await AsyncStorage.getAllKeys();
  if (asyncStorageKeys.length > 0) {
    AsyncStorage.clear()
      .then(() => {
        console.log('AsyncStorage Cleared');
        resetGlobalStore();
        props.navigation.navigate('Auth');
      })
      .catch((err) => {
        resetGlobalStore();
        props.navigation.navigate('Auth');
      });
  } else {
    console.log('Nothing to clear');
    resetGlobalStore();
    props.navigation.navigate('Auth');
  }
};

interface State {
  hasplan: boolean;
}
export class CustomDrawerContentComponent extends Component<
  DrawerNavigatorItemsProps,
  State
> {
  constructor(props: DrawerNavigatorItemsProps) {
    super(props);
    this.state = {
      hasplan: false,
    };
  }

  componentDidMount() {}
  public render() {
    const items = [...drawerItems()];

    return (
      <View style={{backgroundColor: '#5dbcd2', flex: 1, overflow: 'hidden'}}>
        <GoSafe>
          <FlatList
            style={{backgroundColor: '#5dbcd2', height: '100%'}}
            data={['SideMenu']}
            keyExtractor={(item) => item}
            renderItem={() => (
              <>
                <FlatList
                  data={items}
                  renderItem={(data) => renderListItem(data, this.props)}
                  keyExtractor={(item) => item.title}
                />
                <TouchableOpacity
                  onPress={() => {
                    logout(this.props);
                  }}
                  style={styles.rowStyle}>
                  <Image
                    source={ImageAssets.androidW}
                    resizeMode="contain"
                    style={styles.img}
                  />
                  <Text
                    style={{
                      color: globalColors.white,
                      fontSize: 16,
                      marginLeft: 30,
                    }}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </>
            )}
          />
        </GoSafe>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowStyle: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 25,
    height: 25,
    marginHorizontal: 25,
  },
  bigImageStyle: {
    width: 70,
    height: 70,
    borderRadius: 500,
    overflow: 'hidden',
    marginTop: 30,
  },
  planStyle: {
    width: 35,
    height: 35,
    marginHorizontal: 25,
  },
  upgradeiconStyles: {
    width: 35,
    height: 50,
    marginHorizontal: 10,
  },
  porfileStripParent: {
    width: '100%',
    height: 90,
  },
  porfileStrip: {
    backgroundColor: globalColors.primary,
    width: '100%',
    height: 70,
    overflow: 'visible',
    flexDirection: 'row',
  },
  ppContianer: {
    flex: 30,
    ...SharedStyles.centerAll,
  },
  usernameContainer: {
    flex: 60,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  settingsIconContainer: {
    flex: 10,
    ...SharedStyles.centerAll,
  },
  usernameText: {
    color: globalColors.white,
    fontSize: GStyle.fontSize.small,
  },
  emailText: {
    color: globalColors.white,
    fontSize: GStyle.fontSize.mini,
  },
  gearBtn: {
    width: '100%',
    height: '100%',
    ...SharedStyles.centerAll,
  },
  gearIcon: {
    height: 20,
    width: 20,
  },
  img: {
    height: 30,
    width: 30,
    marginLeft: '12%',
  },
});
