import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';

import Icon from "../common/Icon";
import ProductColors from "../Product/ProductColors";
import Promo from "../Product/Promo";

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import { PRODUCT_URL, JSON_FORMAT, HEADER_ENCODED, THUMB_IMAGE_URL, IMAGE_WS_KEY } from '../../constants/constants';
import {ChangeCurrency} from '../../constants/helper'

var storage = require("react-native-local-storage");
class ProductItem extends PureComponent {

  state = {
    loading: false,
    selected: false,
    product: JSON, 
    productThumbUrl: "https://kitandyar.com/1225-home_default/red-and-strait-bandage-elegant-jumpsuit.jpg",
    productName: "",
    currency: "BHD",
    oldCurrency: "BHD",
    currencies: null,
  }

  componentDidMount(){
    storage.get('new_currency').then((currency) => {
      this.setState({currency: currency});
    });

    storage.get('old_currency').then((oldCurrency) => {
      this.setState({oldCurrency: oldCurrency});
    });

    storage.get('currencies').then((currencies) => {
      this.setState({currencies: currencies});
    });

    this._getProductWithId(this.props.productId);
    console.log("Product Id => " + this.props.productId);
  }

  renderWidth = (layout) => {
    if (layout === 1)
      return (Metrics.deviceWidth - Metrics.baseMargin)
    if (layout === 2)
      return (Metrics.deviceWidth - Metrics.baseMargin * 2) / 2
    else if (layout === 3)
      return (Metrics.deviceWidth - Metrics.baseMargin * 3) / 3
    else if (layout === 4)
      return (Metrics.deviceWidth - 40 - Metrics.baseMargin * 2) / 2
    else
      return null
  }

  renderHeight = (layout) => {
    if (layout === 1)
      return (Metrics.deviceWidth + 20)
    if (layout === 2)
      return (Metrics.deviceHeight * 0.45)
    else if (layout === 3)
      return (Metrics.deviceHeight * 0.45)
    if (layout === 4)
      return (Metrics.deviceHeight * 0.35)
    else
      return null
  }
 
  changeState = (value) => {
    this.setState({ selected: value });
  }


  _getProductWithId = (productId) =>{
    this.setState({loading:true});
    const url = PRODUCT_URL + productId + JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
    .then(res => res.json())
    .then(resJson => { 
      this.setState({loading: false});
      this.setState(resJson.product);
      const url = THUMB_IMAGE_URL + productId + "/" + resJson.product.id_default_image + IMAGE_WS_KEY;
      this.setState({productThumbUrl: url, product: resJson.product, productName: resJson.product.name[0].value});
    })
  }

  _formatOfPrice(price){
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }


  render() {
    const { layout } = this.props;
    const { selected, product, productThumbUrl, productName } = this.state;
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: this.renderWidth(layout),
            height: this.renderHeight(layout),
          }
        ]}
        onPress={() => { this.props.navigation.navigate("ProductDetail", { product: product }) }}
      >
        <Icon
          image={require('../../resources/icons/like.png')}
          tintColor={selected === true ? Colors.red : Colors.white}
          backgroundColor={Colors.blackTransparent10}
          borderRadius={true}
          width={25}
          styleIcon={AppStyles.positionTopRight}
          onPress={() => this.changeState(!selected)}
        />
        {
          //product.promo === true &&
          // <Promo
          //   value={"20"}
          //   style={[AppStyles.positionTopLeft, {
          //     width: 40,
          //     height: 20
          //   }]}
          //   styleText={{ ...Fonts.style.small }}
          // />
        }
        <View
          style={[
            AppStyles.imageView,
            AppStyles.blockRadius,
            { flex: 3 }
          ]}
        >
          <ImageBackground
           resizeMethod={"resize"}
            resizeMode={"cover"}
            style={{
              width: this.renderWidth(layout),
              height: this.renderHeight(layout),
              alignItems: "center"
            }}
            source={{ uri: productThumbUrl }}
          >
        {/**
            <ProductColors
              styleColor={{ marginTop: this.renderHeight(layout) - 80 }}
              visibleText={false}
            />
        */}
          </ImageBackground>
        </View>
        <View style={[
          styles.center,
          styles.sectionBottom
        ]} >
          <Text style={[
            styles.productName,
            { fontSize: layout === 3 ? 12 : 14 }
          ]}>
            {productName}
          </Text>
          <View style={[
            AppStyles.row,
            AppStyles.center
          ]}>
            <Text style={[
              ...Fonts.style.bold,
              styles.productPrice,
              { fontSize: layout === 3 ? 10 : 12 }
            ]}>
              {ChangeCurrency(product.price, this.state.oldCurrency, this.state.currency, this.state.currencies)} $
            </Text>
            {
              //product.promo === true &&
              // <Text style={[
              //   styles.productPricePromo,
              //   {
              //     textDecorationLine: "line-through",
              //     fontSize: layout === 3 ? 10 : 12,
              //     marginLeft: Metrics.baseMargin
              //   }
              // ]}>
              //   75.00$
            // </Text>
            } 
          </View>
          
        </View>
        <ActivityIndicator style={{opacity: this.state.loading ? 1.0 : 0.0,  alignItems: 'center',   left: 0,right: 0, top: 0, bottom: 0,
            justifyContent: 'center', position: 'absolute'}} animating={true} size="large"/>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(ProductItem);

const styles = StyleSheet.create({
  container: {
    margin: Metrics.smallMargin
  },
  sectionBottom: {
    height: 50,
    paddingTop: Metrics.smallMargin
  },
  productName: {
    fontFamily: Fonts.type.Book,
    textAlign: "center",
    color: Colors.dark,
  },
  productPrice: {
    fontFamily: Fonts.type.Bold,
    textAlign: "center",
    color: Colors.dark_gray,
  },
});