import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Imag,
  FlatList
} from 'react-native';
import i18n from '../../helpers/I18n/I18n';

import Icon from '../common/Icon';
import Color from './Color';
import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

var storage = require("react-native-local-storage");
class ProductColors extends PureComponent {

  state = {
    color: "1",
    lang: "",
    isRTL: false,
  };

  static propTypes = {
    width: PropTypes.number,
    arrayColors: PropTypes.any,
    styleColor: PropTypes.any,
    visibleText: PropTypes.bool
  };

  static defaultProps = {
    width: 24,
    arrayColors: [],
    styleColor: {},
    visibleText: true
  };

  componentDidMount(){
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });
  }

  _renderItem(item){
    return (
      <Color
        width={this.props.width}
        color={item}
        selected={this.state.color == item}
        onPress={() => { this.setState({ color: item }), this.props.selectColorFunc(item) }}
      />
    )
  };

  render() {

    const {
      width,
      arrayColors,
      styleColor,
      visibleText
    } = this.props;

    if(this.state.color == "1" || this.state.color === undefined){
      this.setState({color: this.props.arrayColors[0]});
    }

    const {lang, isRTL} = this.state;

    return (
      <View style={[
        AppStyles.center,
        styles.container,
        styleColor
      ]}>
        {
          visibleText &&
          <Text style={styles.title}>
             {i18n.t('product_color_component.choose_color', { locale: lang } )}
          </Text>
        }
        <FlatList
          contentContainerStyle={[  AppStyles.center]}
          horizontal
          data={arrayColors}
          renderItem={({ item }) => this._renderItem(item)}
          keyExtractor={(item, i) => i}
        />
      </View>
    );
  }
}

export default ProductColors;

const styles = StyleSheet.create({
  container: {
    margin: Metrics.smallMargin
  },
  title: {
    ...Fonts.style.small,
    textAlign: "center",
    color: Colors.dark_gray
  }
});
