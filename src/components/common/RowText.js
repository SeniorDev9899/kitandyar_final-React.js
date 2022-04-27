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
    bgColor: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
    height: PropTypes.number
  };

  static defaultProps = {
    bgColor: false,
    title: "",
    quantity: 0,
    description: "",
    height: 50
  };

  render() {

    const { title, quantity, description, height, bgColor } = this.props;
    
    return (
      <View
        style={[
          AppStyles.row,
          AppStyles.spaceBetween,
          styles.container,
          { height: height, 
            backgroundColor: ( bgColor === true ) ? Colors.gray : Colors.white,}
        ]}
      >
        <View style={{ flex: 4 }}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>
        <View style={[AppStyles.row, AppStyles.spaceBetween, { flex: 4, alignItems: 'center' }]}>
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