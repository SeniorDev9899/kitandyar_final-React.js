import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import StarRating from 'react-native-star-rating';
 
import {
  AppStyles,
  Colors,
  Metrics,
  Fonts,
} from '../../themes';
import Icon from "./Icon";

class RatingLigne extends PureComponent {

  static propTypes = {
    number: PropTypes.number,
    value: PropTypes.number,
  };

  static defaultProps = {
    number: 0,
    value: 0
  };

  render() {

    const { number, value } = this.props;

    return (
      <View style={[
        AppStyles.row,
        styles.container,
      ]}
      >
        <View style={[
          AppStyles.row,
          AppStyles.center,
          { width: 50 }
        ]}>
          <Text style={[
            styles.title,
          ]}>
            {number}
          </Text>
          <Icon
            width={25}
            tintColor={Colors.black}
            image={require("../../resources/icons/star2.png")}
          />
        </View>

        <View style={[AppStyles.row, { flex: 1, height: 7 }]}>
          <View style={{ flex: value, backgroundColor: Colors.appColor }} />
          <View style={{ flex: 5 - value, backgroundColor: Colors.gray }} />
        </View>
      </View>
    );
  }
}
export default (RatingLigne);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.transparent,
    alignItems: "center"
  },
  title: {
    ...Fonts.style.small,
    color: Colors.black
  },
})
