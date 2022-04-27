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
import Promo from "../../components/Product/Promo";

import ProductItem from "./ProductItem";
import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
import { THUMB_IMAGE_URL, IMAGE_WS_KEY } from '../../constants/constants';
import {ChangeCurrency} from '../../constants/helper'

var storage = require("react-native-local-storage");
class ProductListSlide extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    list: PropTypes.any
  };

  static defaultProps = {
    title: "",
    list: []
  };

  state = {
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

  _formatOfPrice(price){
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  _renderItem(product) {
    let layout = 4;
    url = THUMB_IMAGE_URL + product.id + "/" + product.id_default_image + IMAGE_WS_KEY;
    // return (<ProductItem productId={item} layout={layout}/>)
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
        {/* <Icon
          image={require('../../resources/icons/like.png')}
          tintColor={selected === true ? Colors.red : Colors.white}
          backgroundColor={Colors.blackTransparent10}
          borderRadius={true}
          width={25}
          styleIcon={AppStyles.positionTopRight}
          onPress={() => this.changeState(!selected)}
        /> */}
        {
          product.promo === true &&
          <Promo
            value={Math.round(product.reduction * 100)}
            style={[AppStyles.positionTopLeft, {
              width: 40,
              height: 20
            }]}
            styleText={{ ...Fonts.style.small }}
          />
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
            source={{ uri: url }}
          >
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
            {product.name[0].value}
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
              {this.state.currency}{ChangeCurrency(product.real_price, this.state.oldCurrency, this.state.currency, this.state.currencies)}
            </Text>
            {
              product.promo === true &&
              <Text style={[
                styles.productPricePromo,
                {
                  textDecorationLine: "line-through",
                  fontSize: layout === 3 ? 10 : 12,
                  marginLeft: Metrics.baseMargin
                }
              ]}>
                {this.state.currency}{ChangeCurrency(product.price, this.state.oldCurrency, this.state.currency, this.state.currencies)}
            </Text>
            } 
          </View>
          
        </View>
      </TouchableOpacity>
    );
  }

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
          renderItem={({ item }) => this._renderItem(item) }
          keyExtractor={(item, i) => i}
        />
      </View>
    );
  }
}

export default withNavigation(ProductListSlide);

const styles = StyleSheet.create({
  container: {
    margin: Metrics.smallMargin
  },
  title: {
    ...Fonts.style.h4,
    ...Fonts.style.bold,
    color: Colors.black,
    marginVertical: Metrics.baseMargin
  },

  sectionBottom: {
    height: 60,
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
