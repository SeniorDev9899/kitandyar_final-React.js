import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  FlatList
} from 'react-native';
import { withNavigation } from 'react-navigation';

import CategorieItemSmall from "./CategorieItemSmall";
import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
 
class CategorieList extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    list: PropTypes.any
  };

  static defaultProps = {
    title: "",
    list: []
  };

  render() {

    const { title, list } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {title}
        </Text>
        <FlatList
          removeClippedSubviews={true}
          contentContainerStyle={[AppStyles.row]}
          horizontal
          bounces={false}
          data={list}
          alwaysBounceHorizontal={false}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          renderItem={({ item }) => <CategorieItemSmall item={item} />}
          keyExtractor={(item, i) => i}
        />
      </View>
    );
  }
}

export default withNavigation(CategorieList);

const styles = StyleSheet.create({
  container: {
    margin: Metrics.smallMargin
  },
  title: {
    ...Fonts.style.h4,
    ...Fonts.style.bold,
    color: Colors.black, 
    marginVertical: Metrics.baseMargin,
    
  },
});
