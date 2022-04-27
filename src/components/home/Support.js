import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import Icon from "../common/Icon";
import {
  AppStyles,
  Colors,
  Metrics,
  Fonts,
} from '../../themes';

class Support extends PureComponent {

  static propTypes = {
    item: PropTypes.any
  };

  static defaultProps = {
    item: null
  };

  render() {

    const { item } = this.props;

    return (
      <View
        style={[
          AppStyles.center,
          styles.container,
        ]}
      >
        <Icon
          width={30}
          image={item.image}
        />
        <Text style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.text}>
          {item.description}
        </Text>
      </View>
    );
  }
}
export default (Support);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.deviceWidth / 2 - Metrics.smallMargin *4,
    backgroundColor: Colors.gray,
    margin: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin
  },
  title: {
    ...Fonts.style.small,
    color: Colors.appColor,
    marginVertical: Metrics.smallMargin,
    textAlign: "center"
  },
  text: {
    ...Fonts.style.tiny,
    color: Colors.appColor,
    textAlign: "center"
  }
})
