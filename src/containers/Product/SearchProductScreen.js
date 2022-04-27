import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';

import i18n from '../../helpers/I18n/I18n';

import Spinner from 'react-native-loading-spinner-overlay';
import { Dropdown } from 'react-native-material-dropdown';
import Promo from "../../components/Product/Promo";
import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import SwitchLayout from '../../components/modal/SwitchLayout';
import SearchBar from '../../components/common/SearchBar';
import { THUMB_IMAGE_URL, IMAGE_WS_KEY, GET_SEARCH_URL, HEADER_ENCODED, FULL_JSON_FORMAT, DISPLAY_FULL, JSON_FORMAT, GET_SPECIFIC_PRICE_URL } from '../../constants/constants';
import {ChangeCurrency} from '../../constants/helper';
import Toast, {DURATION} from 'react-native-easy-toast';

var storage = require("react-native-local-storage");
export default class SearchScreen extends PureComponent {

  state = {
    loading: false,
    products: [],
    loading: false,
    refreshing: false,
    layout: 2,
    animatedValue: new Animated.Value(0),
    key: "Relevance",
    specificPrices: [],
    currency: "BHD",
    oldCurrency: "BHD",
    currencies: null,
    lang: "",
    isRTL: false,
  };

  componentWillMount() {

    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });

    storage.get('new_currency').then((currency) => {
      this.setState({currency: currency});
    });

    storage.get('old_currency').then((oldCurrency) => {
      this.setState({oldCurrency: oldCurrency});
    });

    storage.get('currencies').then((currencies) => {
      this.setState({currencies: currencies});
    });

    this._makeRemoteRequest();
    this.getSpecificPrices();

  }

  _makeRemoteRequest = () => {
 
  };

  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  _handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => { this._makeRemoteRequest(); }
    );
  };

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

  _updateLayout = (item) => {
    this.setState({ layout: item });
  }

  getSpecificPrices(){
    
    url = GET_SPECIFIC_PRICE_URL + FULL_JSON_FORMAT;
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        },
      })
      .then(res => res.json())
      .then(resJson => { 
          this.setState({specificPrices: resJson.specific_prices});
      }).catch(error => {
        console.log(error);
      })  
  }

  onSearch(key, context){
    if(key != ""){
      context.setState({loading: true});
      url = GET_SEARCH_URL + "?language=1&query=" + key + "&display=full&output_format=JSON";
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        },
      })
      .then(res => res.json())
      .then(resJson => {
        products = resJson.products; 
        if(products != null){
          for(var j=0; j<products.length; j++){
            for(var k=0; k<context.state.specificPrices.length; k++){
              products[j].promo = false;
              if(products[j].id == context.state.specificPrices[k].id_product){
                products[j].specific_price = context.state.specificPrices[k];
                products[j].reduction_price = (1 - context.state.specificPrices[k].reduction) * products[j].price; 
                products[j].reduction = context.state.specificPrices[k].reduction; 
                products[j].promo = true;
                products[j].real_price = products[j].reduction_price;
                break;
              } 
            }
            if(!products[j].promo){
              products[j].real_price = products[j].price;
            }
          }
        }else{
          context.refs.toast.show(i18n.t('search_product_detail.toast_content', { locale: lang } ),DURATION.LENGTH_LONG);
        }

        context.setState({products: products, loading: false});

      }).catch(error => {
        console.log(error);
      })  
    }
  }


  sortWithRelevance (){
    // sortedRelevanceProducts = [];
    // relevanceProductIds = this.state.productIds;
    // for(var i=0; i<relevanceProductIds.length; i++){
    //   for(var j=0; j<this.state.products.length; j++){
    //     if(relevanceProductIds[i] == this.state.products[j].id){
    //       sortedRelevanceProducts.push(this.state.products[j]);
    //         break;
    //     }
    //   }
    // }
    // return sortedRelevanceProducts;
    return this.state.products;
  }

  sortWithName( ){
    sortedNameProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    })
    
    for(var i=0; i<products.length; i++){
      sortedNameProducts.push(products[i]);
    };

    return sortedNameProducts;
    
  }

  sortWithReverseName( ){
    sortedNameProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    })
    
    reverseSortedNameProducts = [];
    for(var i=0; i<products.length; i++){
      sortedNameProducts.push(products[i]);
    };
    for(var i=products.length-1; i>=0; i--){
      reverseSortedNameProducts.push(products[i]);
    };

    return reverseSortedNameProducts;
    
  }

  sortWithPrice( ){
    sortedPriceProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = parseFloat(a.real_price);
      var y = parseFloat(b.real_price);
      return x-y;
    })
    
    for(var i=0; i<products.length; i++){
      sortedPriceProducts.push(products[i]);
    }
    return sortedPriceProducts;

  }
  sortWithReversePrice( ){
    sortedPriceProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = parseFloat(a.real_price);
      var y = parseFloat(b.real_price);
      return x-y;
    })
    
    reverseSortedPriceProducts = [];
    for(var i=0; i<products.length; i++){
      sortedPriceProducts.push(products[i]);
    }
    for(var i=products.length-1; i>=0; i--){
      reverseSortedPriceProducts.push(products[i]);
    }

    return reverseSortedPriceProducts
  }

  _renderItem(product) {
      let layout = this.state.layout;
      url = THUMB_IMAGE_URL + product.id + "/" + product.id_default_image + IMAGE_WS_KEY;
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
              {product.name}
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

    const {
      layout,
      refreshing,
      lang,
      isRTL
    } = this.state;

    let data = [{
      value: i18n.t('search_product_detail.relevance', { locale: lang } ),
    }, {
      value: i18n.t('search_product_detail.name_atoz', { locale: lang } ),
    },{
      value: i18n.t('search_product_detail.name_ztoa', { locale: lang } ),
    }, {
      value: i18n.t('search_product_detail.price_ltoh', { locale: lang } ),
    },{
      value: i18n.t('search_product_detail.price_htol', { locale: lang } ),
    }];

    if(this.state.key == i18n.t('search_product_detail.price_htol', { locale: lang } )) products = this.sortWithReversePrice();
    if(this.state.key == i18n.t('search_product_detail.price_ltoh', { locale: lang } )) products = this.sortWithPrice();
    if(this.state.key == i18n.t('search_product_detail.name_ztoa', { locale: lang } )) products = this.sortWithReverseName();
    if(this.state.key == i18n.t('search_product_detail.name_atoz', { locale: lang } )) products = this.sortWithName();
    if(this.state.key == i18n.t('search_product_detail.relevance', { locale: lang } )) products = this.sortWithRelevance();

    return (
      <View style={[styles.thisContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <View style={[  
          AppStyles.row,
          AppStyles.spaceBetween,
          styles.headerWrapperSearch
        ]}
        >
          <SearchBar
            context={this}
            placeholder={ i18n.t('search_product_detail.search_product_by_name', { locale: lang } )}
            searching={false}
            onSearch={this.onSearch}
          />
        </View>
        <FlatList
          contentContainerStyle={[
            {
              marginTop: Metrics.baseMargin + 40,
              paddingBottom: 80
            },
            layout === 4 ? {} : styles.wrap
          ]}
          // contentContainerStyle={{ marginTop: Metrics.baseMargin }}
          data={products}
          renderItem={({ item }) => this._renderItem(item)}
          onRefresh={() => this._handleRefresh}
          refreshing={refreshing}
          extraData={this.state}
          // scrollEventThrottle={16}
          // onScroll={Animated.event(
          //   [{ nativeEvent: { contentOffset: { y: this.state.animatedValue } } }],
          //   { useNativeDriver: true }
          // )}
          keyExtractor={(item, i) => i}
        />
         <View style={[
            styles.headerWrapper,
            AppStyles.row,
            AppStyles.spaceBetween,
          ]}
          >
            <SwitchLayout
              layout={layout}
              updateLayout={this._updateLayout}
            />
           
            <Dropdown
              containerStyle={{width: 150, alignText: 'center', marginRight: 10} }
              label={i18n.t('search_product_detail.sort', { locale: lang } )}
              data={data}
              value={i18n.t('search_product_detail.relevance', { locale: lang } )}
              itemCount={5}
              dropdownPosition={0}
              onChangeText={(text) => this.setState({ key: text})}
            />

        </View>
        <Spinner visible={this.state.loading} />
        <Toast ref="toast"/>
      </View >
    );
  }
}

const styles = StyleSheet.create({
 thisContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    // paddingTop: 40
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerWrapperSearch: { 
    top: 0,
    height: 60,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingRight: Metrics.smallMargin / 2
  },

  headerWrapper: {
    position: 'absolute',
    backgroundColor: Colors.gray98,
    height: 60,
    top: (Platform.OS === 'ios') ? 90 : 55,
    left: 0,
    right: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray,
    paddingTop: (Platform.OS === 'ios') ? 20 : 15,
    paddingHorizontal: Metrics.baseMargin ,
    alignItems: 'center',
  },

  container: {
    margin: Metrics.smallMargin,
    paddingBottom: 30,
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
