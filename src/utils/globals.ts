interface GLOBALSType {
  activityIndicator: {
    show: () => void;
    hide: () => void;
  };
  store: {
    userLoggedIn: boolean;
  };
}

export const GLOBALS: GLOBALSType = {
  activityIndicator: {
    show: () => {},
    hide: () => {},
  },
  store: {
    userLoggedIn: false,
  },
};

export const resetGlobalStore = () => {
  GLOBALS.store = {
    userLoggedIn: false,
  };
};
