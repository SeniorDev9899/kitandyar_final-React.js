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

class Distance extends PureComponent {

  static propTypes = {
    value: PropTypes.any
  };

  static defaultProps = {
    value: "$"
  };

  render() {

    const {
      value
    } = this.props;

    return (
      <View
        style={styles.container}
      >
        <Text style={[
          styles.title,
        ]}>
          Distance
        </Text>
        <View style={[AppStyles.row, { alignItems: "flex-end" }]}>
          <Text style={[
            styles.description,
          ]}>
            {value}
          </Text>
          <Text style={[
            styles.title,
          ]}>
            km
        </Text>
        </View>
      </View>
    );
  }
}
export default (Distance);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 12,
    marginTop: Metrics.smallMargin
  },
  description: {
    fontSize: 18,
    fontWeight: "bold",
  },
})
