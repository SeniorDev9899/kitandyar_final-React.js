import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image
} from 'react-native';
import { withNavigation } from 'react-navigation';
import i18n from '../../helpers/I18n/I18n';

import Icon from '../common/Icon';
import Promo from "../Product/Promo";

import {
  AppStyles,
  Metrics,
  Images,
  Fonts,
  Colors
} from '../../themes';

const HEIGHT_IMAGE = 120;

var storage = require("react-native-local-storage");
class ProductListItem extends PureComponent {

  state = {
    selected: false,
    product: JSON, 
    productThumbUrl: "",
    productName: "",
    lang: "",
    isRTL: false,
  }

  static propTypes = {
    gifts: PropTypes.bool
  };

  static defaultProps = {
    gifts: false
  };

  changeState = (value) => {
    this.setState({ selected: value });
  }

  componentDidMount(){
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });

    this._getProductWithId(this.props.productId.id);
  }

  _getProductWithId = (productId) =>{
    const url = PRODUCT_URL + productId + JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
    .then(res => res.json())
    .then(resJson => { 
      this.setState(resJson.product);
      const url = THUMB_IMAGE_URL + this.props.productId + "/" + resJson.product.id_default_image + IMAGE_WS_KEY;
      this.setState({productThumbUrl: url, product: resJson.product, productName: resJson.product.name[0].value});
    })
  }

  render() {
    const { layout } = this.props;
    const { selected, product, productThumbUrl, productName, lang, isRTL } = this.state;

    return (
      <TouchableOpacity
        style={[
          AppStyles.row,
          styles.container,
          {
            height: HEIGHT_IMAGE,
          }
        ]}
        onPress={() => { this.props.navigation.navigate("ProductDetail", { product: product }) }}
      >
        <View
          style={[
            AppStyles.imageView,
            AppStyles.blockRadius,
            {
              width: HEIGHT_IMAGE,
              height: HEIGHT_IMAGE,
            }
          ]}
        >
          <Icon
            image={require('../../resources/icons/like.png')}
            tintColor={selected === true ? Colors.red : Colors.white}
            width={layout === 3 ? 18 : 25}
            backgroundColor={Colors.blackTransparent10}
            borderRadius={true}
            styleIcon={AppStyles.positionTopRight}
            onPress={() => this.changeState(!selected)}
          />
          {
            // product.promo === true &&
            // <Promo
            //   value={"20"}
            //   style={[AppStyles.positionTopLeft, {
            //     width: 40,
            //     height: 20
            //   }]}
            //   styleText={{ ...Fonts.style.small }}
            // />
          }
          <Image
            resizeMode={"cover"}
            style={{
              width: HEIGHT_IMAGE,
              height: HEIGHT_IMAGE,
            }}
            source={{ uri: product.productImages[0].illustration }}
          />
        </View>
        <View style={[
          styles.sectionDescription
        ]} >
          <Text style={styles.productName}>
            {product.productName}
          </Text>
          <View>
            <Text style={styles.productPrice}>
              {product.productPriceIns} $
          </Text>
          </View>
        </View>
        {
          gifts === true &&
          <View style={[
            AppStyles.spaceBetween,
            AppStyles.center,
            { flex: 0.5 }
          ]}>
            <Icon
              image={require('../../resources/icons/addCart.png')}
              tintColor={Colors.appColor}
              width={35}
              onPress={() => { alert( i18n.t('product_list_item_component.add_cart', { locale: lang } )) }}
            /> 
          </View>
        }
      </TouchableOpacity>
    );
  }
}

export default withNavigation(ProductListItem);

const styles = StyleSheet.create({
  container: {
    margin: Metrics.smallMargin
  },
  sectionDescription: {
    flex: 3,
    padding: Metrics.baseMargin
  },
  productName: {
    ...Fonts.style.medium,
    ...Fonts.style.bold,
    color: Colors.dark,
  },
  productPrice: {
    ...Fonts.style.normal,
    fontFamily: Fonts.type.Bold,
    color: Colors.dark_gray,
    marginTop: Metrics.baseMargin
  },
});