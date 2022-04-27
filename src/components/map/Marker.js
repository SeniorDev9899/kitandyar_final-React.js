import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground
} from 'react-native';

import {
  AppStyles,
  Colors,
  Metrics,
  Fonts,
} from '../../themes';

class Marker extends PureComponent {

  static propTypes = {
    width: PropTypes.number,
    image: PropTypes.any,
    color: PropTypes.string,
    onPress: PropTypes.func
  };

  static defaultProps = {
    width: 80,
    image: require("../../resources/images/placeholder.png"),
    color: false,
    onPress: () => { }
  };

  render() {

    const {
      width,
      image,
      color,
      onPress
    } = this.props;

    return (
      <TouchableOpacity
        style={[
          AppStyles.center,
          styles.container
        ]}
        onPress={onPress}
      >
        <ImageBackground
          resizeMode={'cover'}
          style={[
            AppStyles.center,
            { width: width, height: width }
          ]}
          source={require("../../resources/images/placeholder.png")}
        > 
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}
export default (Marker);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  }
})
