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
    status: PropTypes.string,
    quantity: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    title: "",
    quantity: 0,
    status: "",
    height: 50
  };

  renderColor = (type) => {
    //Received /Confirmed /OutDelivery /Delivered
    if (type === "Received") {
      return ("#fab63f");
    } else if (type === "Confirmed") {
      return ("#75a53c");
    } else if (type === "OutDelivery") {
      return ("#40a2c7");
    } else {
      return ("#999999");
    }
  }

  render() {

    const { title, quantity, status, height } = this.props;

    return (
      <View
        style={[
          AppStyles.row,
          AppStyles.spaceBetween,
          styles.container,
          { height: height }
        ]}
      >
        <Text style={styles.title}>
          {title}
        </Text>
        <View style={[
          styles.status,
          AppStyles.center,
          AppStyles.blockRadius,
          { backgroundColor: this.renderColor(status)}
        ]} >
          <Text style={styles.textStatus}>
            {status}
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
  status: {
    width: Metrics.deviceWidth * 0.4,
    height: 50
  },
  textStatus: {
    ...Fonts.style.normal,
    color: Colors.white,
    textAlign: "right",
    marginRight: 5
  }
}); 