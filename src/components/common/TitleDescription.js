import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text, 
  StyleSheet,
} from 'react-native';

import { AppStyles, Metrics, Images, Fonts, Colors } from '../../themes';

export default class TitleDescription extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
  };

  static defaultProps = {
    title: "",
    description: "",
  };

  render() {

    const { title, description } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>
          {description}
        </Text>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    marginVertical: Metrics.baseMargin
  },
  title: {
    ...Fonts.style.bold,
    fontSize: 20,
    color: Colors.black,
    marginBottom: Metrics.baseMargin
  },
  description: {
    ...Fonts.style.medium, 
    color: Colors.black
  },
}); 