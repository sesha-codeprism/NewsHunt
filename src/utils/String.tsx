import LocalizedStrings from 'react-native-localization';

const strings: any = new LocalizedStrings({
  en: {
    TITLE: 'Audio Recorder Player',
    PLAY: 'Play',
    PAUSE: 'Pause',
    STOP: 'Stop',
    RECORD: 'Record',
  },
});

export const getString = (str: string) => {
  return strings[str];
};
