interface GLOBALSType {
  activityIndicator: {
    show: () => void;
    hide: () => void;
  };
  store: {
    userLoggedIn: boolean;
    newsCategory: string;
  };
}

export const GLOBALS: GLOBALSType = {
  activityIndicator: {
    show: () => {},
    hide: () => {},
  },
  store: {
    userLoggedIn: false,
    newsCategory: '',
  },
};

export const resetGlobalStore = () => {
  GLOBALS.store = {
    userLoggedIn: false,
    newsCategory: '',
  };
};
