import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

export default class Size extends PureComponent {

  static propTypes = {
    selected: PropTypes.bool,
    size: PropTypes.string,
    onPress: PropTypes.any,
  };

  static defaultProps = {
    selected: false,
    size: "",
    onPress: () => { },
  };

  render() {
    const { selected, size, onPress } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          AppStyles.center,
          styles.container,
          {
            backgroundColor: selected ? Colors.appColor : Colors.white,
            borderColor: selected ? Colors.appColor : Colors.border,
          }
        ]}
      >
        <Text style={[
          styles.text,
          { color: selected ? Colors.white : Colors.dark_gray }
        ]}>
          {size}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: Metrics.smallMargin,
    borderWidth: 1,
  },
  text: {
    ...Fonts.style.normal,
    textAlign: "center",
  }
});
