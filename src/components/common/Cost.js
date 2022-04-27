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

class Cost extends PureComponent {

  static propTypes = {
    value: PropTypes.string
  };

  static defaultProps = {
    value: "$"
  };

  render() {

    const { value } = this.props;

    return (
      <View
        style={styles.container}
      >
        <Text style={[
          styles.title,
        ]}>
          Start from
        </Text>
        <Text style={[
          styles.description,
        ]}>
          {value}
        </Text>
      </View>
    );
  }
}
export default (Cost);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 12,
    marginTop: Metrics.smallMargin
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
  },
})
