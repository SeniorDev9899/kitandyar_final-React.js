import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { AppStyles, Metrics, Colors, Fonts } from '../../themes';

export default class Categorie extends PureComponent {

  static propTypes = {
    item: PropTypes.any,
    changeStateCategorie: PropTypes.func 
  };

  static defaultProps = {
    item: null,
    changeStateCategorie: () => { } 
  };

  state = {
    selected: false,
  }

  changeState = (value) => {
    const { item } = this.props;
    this.setState({ selected: value });
    this.props.changeStateCategorie(item);
  }
 
  render() {

    const {
      item 
    } = this.props;

    const { selected } = this.state;

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => this.changeState(!selected)}
        style={[
          AppStyles.center,
          styles.container,
          selected === true ? styles.enable : styles.disable,
        ]}
      >
        <Text
          style={[
            Fonts.style.normal,
            Fonts.style.center,
            {
              marginHorizontal: Metrics.baseMargin
            },
            selected === true ? styles.enableText : styles.disableText,
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    borderRadius: 10,
    marginRight: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin, 
    borderWidth: 1,
  },
  enable: {
    borderColor: Colors.appColor,
    backgroundColor: Colors.appColor,
  },
  disable: {
    borderColor: Colors.appColor,
    backgroundColor: Colors.white
  },
  enableText: {
    color: Colors.white,
  },
  disableText: {
    color: Colors.appColor,
  },
});
