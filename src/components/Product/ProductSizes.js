import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList
} from 'react-native';
import i18n from '../../helpers/I18n/I18n';

import Icon from '../common/Icon';
import Size from './Size';
import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

var storage = require("react-native-local-storage");
class ProductSizes extends PureComponent {

  state = {
    size: "1",
    lang: "",
    isRTL: false,
  };

  static propTypes = {
    arraySizes: PropTypes.any,
  };

  static defaultProps = {
    arraySizes: [],
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
      <Size
        size={item}
        selected={this.state.size === item}
        onPress={() => { this.setState({ size: item }), this.props.selectSizeFunc(item) }}
      />
    )
  };

  render() {

    const { arraySizes } = this.props;
    const { size, lang, isRTL } = this.state;

    if(this.state.size == "1" || this.state.size === undefined){
      this.setState({size: this.props.arraySizes[0]});
    }

    return (
      <View style={[
        AppStyles.center,
        styles.container
      ]}>
        <Text style={styles.title}>
           {i18n.t('product_size_component.your_size', { locale: lang } )}
        </Text>
        
         <FlatList
          contentContainerStyle={[  AppStyles.center]}
          horizontal
          data={arraySizes}
          renderItem={({ item }) => this._renderItem(item)}
          keyExtractor={(item, i) => i}
        />
      </View>
    );
  }
}

export default ProductSizes;

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
