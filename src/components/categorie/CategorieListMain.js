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

import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
import CategorieItem from './CategorieItem';
import CategorieItemMain from './CategorieItemMain';

class CategorieListMain extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    list: PropTypes.any,
    layout: PropTypes.number,
    styleList: PropTypes.any
  };

  static defaultProps = {
    title: "",
    list: [],
    layout: 2,
    atyleList: {}
  };

  _renderItem(item) {
      return (
       <CategorieItemMain item={item} layout={this.props.layout}/>
      )
  }

  render() {
    const { title, list, styleList } = this.props;
    console.log("category main list = ", list);
    return (
      <View style={[
        styles.container,
        styleList
      ]}>
        <View style={[
          AppStyles.row,
          AppStyles.spaceBetween,
          styles.containerTitle
        ]}>
          <Text style={styles.title}>
            {title}
          </Text>
          {/**<Icon
            width={30}
            tintColor={Colors.black}
            image={require("../../resources/icons/more.png")}
            onPress={() => { this.props.navigation.navigate("Offer") }}
          />*/}
        </View>
        <FlatList
          removeClippedSubviews={true}
          contentContainerStyle={[
            {
              paddingBottom: Metrics.baseMargin
            },
            this.props.layout === 4 ? {} : styles.wrap
          ]}
          data={list}
          renderItem={({ item }) => this._renderItem(item) }
          keyExtractor={(item, i) => i}
        />
      </View>
    );
  }
}

export default withNavigation(CategorieListMain);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  containerTitle: {
    paddingHorizontal: Metrics.smallMargin,
    marginVertical: Metrics.baseMargin
  },
  title: {
    ...Fonts.style.h4,
    ...Fonts.style.bold,
    color: Colors.black
  },
});
