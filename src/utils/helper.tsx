import {Dimensions, Platform, PixelRatio} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import {GLOBALS} from './globals';

declare var global: any;
export const Log =
  __DEV__ && global && global.console
    ? console.log.bind(global.console)
    : () => {};

export const updateStore = (LocalStore: string) =>
  AsyncStorage.setItem('LocalStore', LocalStore).then(() => {
    Log('Update Store: ', GLOBALS.store);
  });

export const getStore = () => AsyncStorage.getItem('GoFitStore');

export const onCatch = (err: any, str: string) => {
  if (!err.status && !err.response) {
    // network error
  } else {
    if (err.response && err.response.data && err.response.data.message) {
      Log(err.response);
      SimpleToast.show(err.response.data.message, SimpleToast.LONG);
      Log(`Failed to ${str} due to:`, err);
    } else if (err.response && err.response.message) {
      Log(err.response);
      SimpleToast.show(err.response.message, SimpleToast.LONG);
      Log(`Failed to ${str} due to:`, err);
    } else {
      SimpleToast.show(err.toString(), SimpleToast.LONG);
      Log(`Failed to ${str} due to:`, err);
    }
  }
};

export const animateValue = (
  comp: any,
  start: number,
  end: number,
  duration: number,
  valueName: string,
) => {
  const range = end - start;
  let current = start;
  const _increment = Math.abs(Math.round(Math.abs(range) / duration) * 5);
  const increment =
    end > start
      ? _increment === 0
        ? 1
        : _increment
      : _increment === 0
      ? -1
      : -Math.abs(_increment);
  const timer = setInterval(function () {
    const _current = current + increment;
    if (range > 0) {
      current = end >= _current ? _current : end;
    } else {
      current = end <= _current ? _current : end;
    }
    comp.setState({[valueName]: current});
    if (current == end) {
      clearInterval(timer);
    }
  }, 1);
};

export const isValidEmail = (email: string): boolean =>
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    email,
  );

export const isValidMobileNum = (phone: string): boolean =>
  /(^((\+91)|(91)|(0))([6-9][0-9]{9})\b)|(^[6-9][0-9]{9}\b)/.test(phone);

const majorVersionIOS = parseInt(`${Platform.Version}`, 10);
export const isAutoFillSupported =
  Platform.OS === 'ios' && majorVersionIOS >= 12;

export const isValidOTP = (OTP: string): boolean => /^[0-9]{6}$/.test(OTP);

export const HumanRedableDate = (date: Date) =>
  moment(date).calendar(undefined, {
    // when the date is closer, specify custom values
    lastWeek: '[' + moment(date).format('ddd, MMM DD') + ']',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: '[' + moment(date).format('ddd, MMM DD') + ']',
    // when the date is further away, use from-now functionality
    sameElse: function () {
      return '[' + moment(date).format('ddd, MMM DD') + ']';
    },
  });
export const HumanRedableDay = (date: Date) =>
  moment(date).calendar(undefined, {
    // when the date is closer, specify custom values
    lastWeek: '[' + moment(date).format('dddd') + ']',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: '[' + moment(date).format('dddd') + ']',
    // when the date is further away, use from-now functionality
    sameElse: function () {
      return '[' + moment(date).format('dddd') + ']';
    },
  });

export const convertToDiaryDate = (date: Date) =>
  moment(date).format('YYYY-MM-DD');

const mapFromArray = (
  array: Array<any>,
  prop: string,
): {[index: number]: any} => {
  const map: any = {};
  for (let i = 0; i < array.length; i++) {
    map[array[i][prop]] = array[i];
  }
  return map;
};

const isEqual = (a: {id: any}, b: {id: any}): boolean => {
  return a.id === b.id;
};

const getDelta = (
  o: Array<any>,
  n: Array<any>,
  comparator: (a: any, b: any) => boolean,
): {added: Array<any>; deleted: Array<any>; changed: Array<any>} => {
  const delta = {
    added: [],
    deleted: [],
    changed: [],
  };
  const mapO = mapFromArray(o, 'id');
  const mapN = mapFromArray(n, 'id');
  for (const id in mapO) {
    if (!mapN.hasOwnProperty(id)) {
      // @ts-ignore 😑
      delta.deleted.push(mapO[id]);
    } else if (!comparator(mapN[id], mapO[id])) {
      // @ts-ignore 😑
      delta.changed.push(mapN[id]);
    }
  }

  for (const id in mapN) {
    if (!mapO.hasOwnProperty(id)) {
      // @ts-ignore 😑
      delta.added.push(mapN[id]);
    }
  }
  return delta;
};

export const getItemsOutOfSync = (localItem: any, remoteItem: any) =>
  getDelta(localItem, remoteItem, isEqual);

export const mealBreakDown = (hour: number) => {
  if (hour >= 4 && hour <= 9) {
    return 'BREAKFAST';
  } else if (hour >= 10 && hour <= 12) {
    return 'MID MORNING SNACK';
  } else if (hour > 12 && hour <= 16) {
    return 'LUNCH';
  } else if (hour > 16 && hour <= 18) {
    return 'EVENING SNACK';
  } else if (hour > 18 || hour <= 3) {
    return 'DINNER';
  } else {
    return 'DINNER';
  }
};

// export const getGloablStore = () => GLOBALS.store;

export const randColor = () =>
  '#000000'.replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });

export const isLightColor = (color: string) => {
  const hex = color.replace('#', '');
  const c_r = parseInt(hex.substr(0, 2), 16);
  const c_g = parseInt(hex.substr(2, 2), 16);
  const c_b = parseInt(hex.substr(4, 2), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 155;
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
export const getRandomDarkColor = () => {
  let letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 10)];
  }
  return color;
};

// export const translate = (contentObj: any) =>
//   contentObj
//     ? contentObj.content &&
//       contentObj.content[GLOBALS.store.user?.preferredLanguage || 'en']
//       ? contentObj.content[GLOBALS.store.user?.preferredLanguage || 'en']
//       : contentObj.defValue
//       ? contentObj.defValue
//       : ''
//     : '';

export const calcuateCaloriesForQuantity = (
  userQuantity: number,
  caloriesFor100Grms: number,
  measureQuantity: number,
) => (userQuantity * caloriesFor100Grms * measureQuantity) / 100;
export const range = (
  start: number,
  end: number,
  isDecimal: boolean,
  decimalUpto: number = 10,
) => {
  return Array.from(
    {length: end + 1 - start},
    (i, x) =>
      isDecimal
        ? Array.from({length: decimalUpto}, (v, vx) =>
            vx <= 9
              ? (start + x + vx / 10).toFixed(1)
              : (start + x + vx / 100).toFixed(2),
          )
        : (start + x).toString(),
    // @ts-ignore
  ).flat();
};

export const formatTimeString = (time: number, showMsecs: number) => {
  let msecs: number | string = time % 1000;

  if (msecs < 10) {
    msecs = `00${msecs}`;
  } else if (msecs < 100) {
    msecs = `0${msecs}`;
  }

  let seconds = Math.floor(time / 1000);
  let minutes = Math.floor(time / 60000);
  let hours = Math.floor(time / 3600000);
  seconds = seconds - minutes * 60;
  minutes = minutes - hours * 60;
  let formatted: string;
  if (showMsecs) {
    formatted = `${hours < 10 ? 0 : ''}${hours}:${
      minutes < 10 ? 0 : ''
    }${minutes}:${seconds < 10 ? 0 : ''}${seconds}:${msecs}`;
  } else {
    formatted = `${hours < 10 ? 0 : ''}${hours}:${
      minutes < 10 ? 0 : ''
    }${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
  }

  return formatted;
};

export const convertToMinutes = (duration: string) =>
  moment.duration(duration).asMinutes();

export const heightInft = (array: Array<number>) => {
  return array.map((i) => {
    (i / 30.48).toFixed(1);
  });
};

export const rangeBetween = (start: number, end: number) => {
  let resultarr = Array();
  if (start > end) {
    var arr = new Array(start - end + 1);
    for (var i = 0; i < arr.length; i++, start--) {
      resultarr[i] = start;
    }
    return arr;
  } else {
    var arro = new Array(end - start + 1);
    for (var j = 0; j < arro.length; j++, start++) {
      arro[j] = start;
    }
    return arro;
  }
};

// export const languageArray = () => {
//   const A = GLOBALS.store.appProperties?.languages;
//   let LanguagesArray = Array();

//   A?.map((i) => {
//     LanguagesArray.push(i.nativeLanguageName);
//   });

//   return LanguagesArray;
// };

// export const FitnessArray = () => {
//   const A = GLOBALS.store.appProperties?.activityStatusList;
//   let fitnessArray = Array();

//   A?.map((i) => {
//     fitnessArray.push(translate(i.activityStatus));
//   });
//   return fitnessArray;
// };

export const shuffleArray = (arr: any[]) =>
  arr
    .map((a: any) => [Math.random(), a])
    .sort((a: number[], b: number[]) => a[0] - b[0])
    .map((a: any[]) => a[1]);

export const serializeDuration = (time: string) =>
  time
    .split(':')
    .map((i) => (i.length < 2 ? `0${i}` : i))
    .join(':');

export const daysInMonth = (
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
) => new Date(year, month, 0).getDate();

export const getAllDatesForTheMonth = (month: number) => {
  const datesArray = Array.from({length: daysInMonth(month)}, (i, x) => {
    const d = new Date();
    d.setMonth(month - 1);
    d.setDate(x + 1);
    return convertToDiaryDate(new Date(d));
  });

  return datesArray;
};

export const getAllDatesForTheWeek = (date: Date) => {
  let prevDate = new Date(date);
  const datesArray = Array.from({length: 7}, (i, x) => {
    prevDate.setDate(prevDate.getDate() + (x === 0 ? x : 1));
    return convertToDiaryDate(new Date(prevDate));
  });

  return datesArray;
};

export const weeksInMonth = (month?: number, year?: number) =>
  Math.round(daysInMonth(month, year) / 7);

// export const largest = (arr: FoodDiaryObject[] = []) => {
//   let highestValue = 0;
//   let highestItem: FoodDiaryObject | null = null;
//   arr.forEach((entry) => {
//     if (entry.totalNutrients.calories > highestValue) {
//       highestValue = entry.totalNutrients.calories;
//       highestItem = entry;
//     }
//   });
//   return highestItem;
// };

// export const getTotalObject = (foodDiary: FoodDiaryObject[] = []) => {
//   var nutrientsArr = Object.keys(foodDiary[0].totalNutrients);

//   var mealTypes = foodDiary.reduce((acc, curVal) => {
//     if (acc.indexOf(curVal.mealType) === -1) {
//       acc.push(curVal.mealType);
//     }

//     return acc;
//   }, Array());

//   var totalObject = nutrientsArr.reduce((acc, currVal) => {
//     acc.push({
//       displayName: currVal,
//       mealTypes: mealTypes.map((type: any) => ({
//         type: type,
//         nutrient: 0,
//       })),
//     });

//     return acc;
//   }, Array());

//   var calcuateCaloriesForQuantity = (
//     userQuantity: number,
//     caloriesFor100Grms: number,
//     measureQuantity: number,
//   ) => (userQuantity * caloriesFor100Grms * measureQuantity) / 100;

//   // All set! Add up the things now.

//   foodDiary.forEach((entry) => {
//     totalObject.forEach((card) => {
//       const currentMealTypeIndex = card.mealTypes.findIndex(
//         (type: { type: any; }) => type.type === entry.mealType,
//       );

//       if (card.displayName === 'calories') {
//         card.mealTypes[currentMealTypeIndex].nutrient +=
//           entry.totalNutrients[card.displayName];
//       } else {
//         card.mealTypes[
//           currentMealTypeIndex
//         ].nutrient += calcuateCaloriesForQuantity(
//           entry.totalQuantity,
//           entry.foodItem?.unitQuantityFoodItemNutrients[card.displayName],
//           entry.foodItemQuantityMeasure?.quantity,
//         );
//       }
//     });
//   });
//   return totalObject;
// };

export const Captalize = (str: string) =>
  str
    .split(' ')
    .map(
      (i) =>
        i.charAt(0).toUpperCase() + i.substr(1, i.length - 1).toLowerCase(),
    )
    .join(' ');

export const timeDiff = (endTime: number, startTime: number) =>
  moment(endTime).diff(startTime, 'hours', true);

// 👺CALL BACK HELL
// export const registerAppWithFCM = () => {
//   return new Promise<string | null>((resolve, reject) => {
//     messaging()
//       .registerForRemoteNotifications()
//       .then(() => {
//         // then check for Permission
//         messaging()
//           .hasPermission()
//           .then((granted: any) => {
//             if (granted) {
//               AsyncStorage.getItem('fcmToken')
//                 .then((token: string | PromiseLike<string | null> | null | undefined) => {
//                   if (token) {
//                     resolve(token);
//                   } else {
//                     messaging()
//                       .getToken()
//                       .then((freshToken: string | PromiseLike<string | null> | null | undefined) => {
//                         if (freshToken) {
//                           AsyncStorage.setItem('fcmToken', freshToken)
//                             .then(() => {
//                               resolve(freshToken);
//                             })
//                             .catch((err: any) => {
//                               reject({
//                                 error: err,
//                                 message:
//                                   'Failed to save fresh FCM token to Async Storage',
//                               });
//                             });
//                         } else {
//                           reject({
//                             error: "Don't know",
//                             message: 'Got Token as null',
//                           });
//                         }
//                       })
//                       .catch((err: any) => {
//                         Log(err, 'Failed to get fresh FCM token');
//                         reject({
//                           error: err,
//                           message: 'Failed to get fresh FCM token',
//                         });
//                       });
//                   }
//                 })
//                 .catch((err: any) => {
//                   reject({
//                     error: err,
//                     message: 'Failed to get stored token from Async Storage',
//                   });
//                 });
//             } else {
//               messaging()
//                 .requestPermission()
//                 .then(() => {
//                   AsyncStorage.getItem('fcmToken').then((token: string | PromiseLike<string | null> | null | undefined) => {
//                     if (token) {
//                       resolve(token);
//                     } else {
//                       messaging()
//                         .getToken()
//                         .then((freshToken: string | PromiseLike<string | null> | null | undefined) => {
//                           if (freshToken) {
//                             AsyncStorage.setItem('fcmToken', freshToken)
//                               .then(() => {
//                                 resolve(freshToken);
//                               })
//                               .catch((err: any) => {
//                                 reject({
//                                   error: err,
//                                   message:
//                                     'Failed to save fresh FCM token to Async Storage',
//                                 });
//                               });
//                           }
//                         })
//                         .catch((err: any) => {
//                           Log(err, 'Failed to get fresh FCM token');
//                           reject({
//                             error: err,
//                             message: 'Failed to get fresh FCM token',
//                           });
//                         });
//                     }
//                   });
//                 })
//                 .catch((err: any) => {
//                   Log('Rejected Notification Permission', err);
//                   reject({
//                     error: err,
//                     message: 'Rejected Notification Permission',
//                   });
//                 });
//             }
//           })
//           .catch((err: any) => {
//             reject({
//               error: err,
//               message: 'Failed to check notification permission',
//             });
//           });
//       })
//       .catch((err: any) => {
//         Log('Failed registerForRemoteNotifications');
//         reject({
//           error: err,
//           message: 'Failed registerForRemoteNotifications',
//         });
//       });
//   });
// };
