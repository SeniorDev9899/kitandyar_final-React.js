import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';

import {
  AppStyles,
  Metrics,
  Images,
  Fonts,
  Colors
} from '../../themes';


export default class Layout extends PureComponent {

  static propTypes = {
    item: PropTypes.any,
    select: PropTypes.integer,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    item: null,
    select: 1,
    onPress: () => { },
  };

  render() {

    const {
      item,
      select,
      onPress
    } = this.props;

    return (
      <TouchableOpacity
        style={[
          AppStyles.center,
          styles.container,
          select === item.layout ? styles.select : styles.deselect
        ]}
        onPress={onPress}
      >
        <Image
          resizeMode={'contain'}
          style={[
            {
              width: 40,
              height: 40,
              tintColor: select === item.layout ? Colors.white : Colors.black
            }
          ]}
          source={item.image}
        />
        <Text style={[
          styles.name,
          { color: select === item.layout ? Colors.white : Colors.black }
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Metrics.baseMargin,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    padding: Metrics.baseMargin
  },
  select: {
    backgroundColor: Colors.appColor,
  },
  deselect: {
    backgroundColor: Colors.white,
  },
  name: {
    ...Fonts.style.small,
    textAlign: "center", 
    marginTop: Metrics.smallMargin
  }
})
