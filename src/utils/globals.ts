interface GLOBALSType {
  activityIndicator: {
    show: () => void;
    hide: () => void;
  };
  mainNewsCategoryId: number;
  store: {
    userLoggedIn: boolean;
    newsCategory: Array<number>;
    userId: number;
    mainNewsCategoryId: number;
  };
}

export const GLOBALS: GLOBALSType = {
  activityIndicator: {
    show: () => {},
    hide: () => {},
  },
  mainNewsCategoryId: 0,
  store: {
    userLoggedIn: false,
    newsCategory: [],
    userId: 0,
    mainNewsCategoryId: 0,
  },
};

export const resetGlobalStore = () => {
  GLOBALS.store = {
    userLoggedIn: false,
    newsCategory: [],
    userId: 0,
    mainNewsCategoryId: 0,
  };
};
