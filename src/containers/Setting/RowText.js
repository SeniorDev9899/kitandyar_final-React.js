import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { AppStyles, Metrics, Images, Fonts, Colors } from '../../themes';

export default class RowText extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
    height: PropTypes.number
  };

  static defaultProps = {
    title: "",
    quantity: 0,
    description: "",
    height: 30
  };

  render() {

    const { title, quantity, description, height } = this.props;

    return (
      <View
        style={[
          AppStyles.row,
          AppStyles.spaceBetween,
          styles.container,
          { height: height }
        ]}
      >
        <View style={{ flex: 4 }}>
          <Text style={styles.title}>
            {title}
          </Text>
        </View>
        <View style={[AppStyles.row, AppStyles.spaceBetween, { flex: 2, alignItems: 'center' }]}>
          <View>
            {
              quantity != 0 &&
              <Text style={styles.description}>
                X {quantity}
              </Text>
            } 
          </View>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingVertical: Metrics.smallMargin,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
  description: {
    ...Fonts.style.normal,
    color: Colors.black
  },
}); 