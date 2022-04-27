import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import {
  AppStyles,
  Colors,
  Metrics,
  Fonts,
} from '../../themes';

class Promo extends PureComponent {

  static propTypes = {
    value: PropTypes.number,
    style: PropTypes.any,
    styleText: PropTypes
  };

  static defaultProps = {
    value: 0,
    style: {},
    styleText: {}
  };

  render() {

    const {
      value,
      style,
      styleText
    } = this.props;

    return (
      <View style={[
        styles.container,
        AppStyles.center,
        AppStyles.blockRadius,
        style
      ]} >
        <Text style={[
          styles.text,
          styleText
        ]}>
          -{value}%
        </Text>
      </View>
    );
  }
}
export default (Promo);

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 25,
    backgroundColor: Colors.red,
    marginHorizontal: Metrics.baseMargin,
  },
  text: {
    ...Fonts.style.normal,
    color: Colors.white,
  }
})
