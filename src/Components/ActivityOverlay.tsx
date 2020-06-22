import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

interface Props {
  isVisible?: boolean;
}
interface State {
  isVisible: boolean;
}

class ActivityOverlay extends Component<Props, State> {
  state = {
    isVisible: this.props.isVisible || false,
  };

  public show = () => {
    this.setState({isVisible: true});
  };

  public hide = () => {
    this.setState({isVisible: false});
  };

  render() {
    const {isVisible} = this.state;
    return isVisible ? (
      <View style={styles.overlay}>
        <LottieView
          style={styles.indicatorStyles}
          source={require('../assets/animations/loading_animation.json')}
          autoPlay
          loop
        />
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorStyles: {
    width: 70,
    height: 70,
  },
});

export default ActivityOverlay;
