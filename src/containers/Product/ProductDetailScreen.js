import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import Share from 'react-native-share';
import xml2js from 'react-native-xml2js'
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import Toast, {DURATION} from 'react-native-easy-toast';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Colors, Fonts } from '../../themes';
import Icon from '../../components/common/Icon';
import CarouselProduct from '../../components/Product/CarouselProduct';
import HeaderBar from "../../components/Header/HeaderBar";
import ProductColors from '../../components/Product/ProductColors';
import ProductSizes from '../../components/Product/ProductSizes';
import ProductTabView from '../../components/Product/ProductTabView';
import ButtonShopping from '../../components/Product/ButtonShopping';
import Promo from "../../components/Product/Promo";
import ProductListSlide from "../../components/Product/ProductListSlide";
import Config from '../../config';
import { THUMB_IMAGE_URL, IMAGE_WS_KEY, PRE_OF_BODY_XML, END_OF_BODY_XML, POST_CART_URL, HEADER_ENCODED, GET_CART_URL, JSON_FORMAT, GET_PRODUCT_OPTION_VALUES_URL, FULL_JSON_FORMAT, GET_COMBINATIONS_URL, GET_STOCK_AVAILABLES_URL, GET_CATEGORY_URL, PRODUCT_URL, GET_SPECIFIC_PRICE_URL, CART_TEMP, POST_GUEST_URL, GET_CARRIER_SCHEMA_URL, GET_GUEST_SCHEMA_URL } from '../../constants/constants';
import {ChangeCurrency} from '../../constants/helper';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

var storage = require("react-native-local-storage");

// when click on add cart button
// 1. If cartId is exist already, get cart with cartId and update(put) the cart with current product.
// 2. If cartId is not exist already, please check If guestId is already exist. if exist, create(post) new Cart, if not exist create(post) new guest
// and then create(post) new Cart. and then update(put) the cart with current product.
const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

class PublicityDetailScreen extends PureComponent {

  constructor(props) {
    super(props);
    // Listen to all events for screen B
    this.props.navigation.addListener(
      'willFocus',
      () => {
        console.log("will focus..");
        this.forceUpdate(null);
        storage.get('cart_price').then((cart_price) => {
          this.setState({cartPrice: cart_price});
        });

        this.getCartQuantity();

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
    )
  }

  state = {
    loading: false,
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    limitOfQuantity: 0,
    total: 0,
    scrollY: new Animated.Value(0),
    selected: false,
    imageUrls: [],
    cart: {},
    colorList: [],
    sizeList: [],
    selColor: "",
    selSize: "",
    id_product_attribute: "0",
    id_color: "",
    id_size: "",
    relateProductList: [],
    cartPrice: "",
    specificPrices: "",
    cartQuantity: 0,
    guestSchema: "",
    guestId: "",
    customerId: "",
    product: {},
    currency: "$",
    oldCurrency: "$",
    currencies: null,
    modalVisible: false,
    index: 0,
    routes: [
      { key: 'first', title: 'Product Details' },
      { key: 'second', title: 'Reviews' } 
    ],
    lang: "",
    isRTL: false,
  }

  componentDidMount() {

    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
          this.setState({})
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

    storage.get('cart_price').then((cart_price) => {
      this.setState({cartPrice: cart_price});
    });
    this.getCartQuantity();
    this.getGuestSchema();
   
    var product = this.props.navigation.state.params.product;
    this.setState({product: product});
    this.setState({ unitPrice: product.real_price });
  
    this.getColorsAndSizes(product);
    this.getSpecificPrices(product);
    this.getRelatedProducts(product);
    var imageIds = product.associations.images;
    imageUrls = [];
    for (i = 0; i < imageIds.length; i++) {
      url = THUMB_IMAGE_URL + product.id + "/" + imageIds[i].id + IMAGE_WS_KEY;
      imageUrls.push(url);
    }
    console.log("ImageUrls",imageUrls);
    this.setState({ imageUrls: imageUrls, total: this._formatOfPrice(product.real_price) });
  }

  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  getCartQuantity(){
    storage.get('cart').then((cart) => {
      cartQuantity = 0;
      if (cart.cart.associations == null) {
        this.setState({cartQuantity: 0});
      } else{
        for(var i=0; i<cart.cart.associations.cart_rows.length; i++){
          cartQuantity = cartQuantity + parseInt(cart.cart.associations.cart_rows[i].quantity);
        }
        this.setState({cartQuantity: cartQuantity});
      }
    });
  }

  share = () => {
    Share.open({
      url: Config.URL_PLAYSTORE
    })
  }

  changeState = (value) => {
    this.setState({ selected: value });
  }

  //-------- delegate of Product Color Items Component ---------//
  selectColorFunc = (color) => {
    this.setState({ selColor: color });
    url = GET_PRODUCT_OPTION_VALUES_URL + "&filter[id]=[5,40]" + FULL_JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
      .then(res => res.json())
      .then(resJson => {
        optionValues = resJson.product_option_values;
        for (var i = 0; i < optionValues.length; i++) {
          if (optionValues[i].color == color) {
            this.setState({ id_color: optionValues[i].id });
            this.getCombinationId(this.props.navigation.state.params.product);
            break;
          }
        }
      }).catch(error => {
        console.log(error);
      })
  }

  //-------- delegate of Product Size Items Component ---------//
  selectSizeFunc = (size) => {
   
    this.setState({ selSize: size });
    url = GET_PRODUCT_OPTION_VALUES_URL + "&filter[id]=[1,4]" + FULL_JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
      .then(res => res.json())
      .then(resJson => {
        optionValues = resJson.product_option_values;
        for (var i = 0; i < optionValues.length; i++) {
          if (optionValues[i].name[0].value == size) {
            this.setState({ id_size: optionValues[i].id });
            this.getCombinationId(this.props.navigation.state.params.product);
            break;
          }
        }

      }).catch(error => {
        console.log(error);
      })
  }

  // ------ delegate of ButtonShopping Component ---------------//
  addQuantity(value) {
    this.state.quantity < this.state.limitOfQuantity && (
      this.setState(prevState => ({
        quantity: parseInt(prevState.quantity) + 1,
        total: parseFloat((parseInt(prevState.quantity) + 1) * parseFloat(value)).toFixed(2)
      })))
  }

  subQuantity(value) {
    this.state.quantity > 1 && (
      this.setState((prevState) => ({
        quantity: (parseInt(prevState.quantity) - 1),
        total: parseFloat((parseInt(prevState.quantity) - 1) * parseFloat(value)).toFixed(2)
      }))
    )
  }

  getCombinationId(product) {
    _combinationIds = product.associations.combinations;
    for (var i = 0; i < _combinationIds.length; i++) {
      url = GET_COMBINATIONS_URL + _combinationIds[i].id + JSON_FORMAT;
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        },
      })
        .then(res => res.json())
        .then(resJson => {
          optionValue = resJson.combination.associations.product_option_values;
          if (optionValue[0].id == this.state.id_size && optionValue[1].id == this.state.id_color) {
            this.setState({ id_product_attribute: resJson.combination.id });
            this.getQuantityWithCombinationId(resJson.combination.id);
          }
        }).catch(error => {
          console.log(error);
        })
    }
  }

  getQuantityWithCombinationId(combinationId) {
 
    url = GET_STOCK_AVAILABLES_URL + "&filter[id_product_attribute]=[" + combinationId + "]" + JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
      .then(res => res.json())
      .then(resJson => {
        console.log("quantity",resJson.stock_availables[0].quantity);
        temp = this.state.product;
        temp.quantity = resJson.stock_availables[0].quantity;
        this.setState({product:temp});
        console.log("statequantity",this.state.product.quantity);
        limitOfQuantity = 0;
        storage.get('cart').then((cart) => {
          this.setState({cart: cart});
          if(cart){
            console.log("cart to set limitofQuantity = ", cart);
            for(var i=0; i<cart.cart.associations.cart_rows.length; i++){
              if(cart.cart.associations.cart_rows[i].id_product == this.state.product.id){
                console.log("limitOfQuantity_ = " + resJson.stock_availables[0].quantity);
                limitOfQuantity = parseInt(resJson.stock_availables[0].quantity) - parseInt(cart.cart.associations.cart_rows[i].quantity);
                this.setState({ limitOfQuantity: limitOfQuantity });
              } else {
                this.setState({ limitOfQuantity: resJson.stock_availables[0].quantity });
                console.log("limit of quantity1 = " + resJson.stock_availables[0].quantity);
              }
            }
          } else {
            this.setState({ limitOfQuantity: resJson.stock_availables[0].quantity });
            console.log("limit of quantity2 = " + resJson.stock_availables[0].quantity);
          }
          
        })

        
      }).catch(error => {
        console.log(error);
      })
  }

// -------------------------- create a guest --------------------//
  createGuest(product, customerId){
    const body = this.getGuestBodyForPost(customerId);
    url = POST_GUEST_URL;
    console.log(url,body);
    fetch(url, {
      method: "POST",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
      body: body,
    })
    .then(res => res.json())
    .then(resJson => { 
      console.log(resJson);
      storage.save('guest_id', resJson.guest.id);
      storage.get('guest_id').then((guestId) => {
        this.setState({guestId: guestId});   
        this.postCart(product)
      });
    }).catch(error => {
      this.setState({ loading: false });
      console.log(error);
    })
  }

  getGuestSchema(){
    url = GET_GUEST_SCHEMA_URL;
    console.log("guest", url);
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
    .then(res => res.json())
    .then(resJson => { 
        this.setState({guestSchema: resJson});
    }).catch(error => {
      console.log(error);
    })
  }

  getGuestBodyForPost(customerId){
    preBody = this.state.guestSchema;
    if(customerId == null){
      preBody.guest.id_customer = 0;
    }else{
      this.setState({customerId: customerId});
      preBody.guest.id_customer = customerId;
    }

    preBody.guest.accept_language = 1;

    console.log("preBody",preBody);

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(preBody);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
 
    return bodyXML;
  }


// --------------------------- create and update cart ------------//
  postCart(product){
    this.setState({ loading: true });
    const body = this.getCartBodyForPost();
    url = POST_CART_URL;
    fetch(url, {
      method: "POST",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
      body: body,
    })
    .then(res => res.json())
    .then(resJson => { 
      storage.save('cart_id', resJson.cart.id);
      storage.get('cart_id').then((cartId) => {console.log("cart_id : "); console.log(cartId)});
      storage.save('cart_price',0);
      storage.save('cart', "");
      storage.get('cart_price').then((cartPrice) => {console.log("cart_price : "); console.log(cartPrice)});
      storage.get('cart').then((cart) => {
        this.setState({cart: cart});
        console.log("product detail first post cart = ");
        console.log("product_detail_postcart",cart);
      })
      this.getCartBody(resJson, product);
    }).catch(error => {
      this.setState({ loading: false });
      console.log(error);
    })

  }

  getCartBodyForPost(){
    console.log("customer Id now == " + this.state.customerId);
    const temp = CART_TEMP;
    temp.cart.associations.cart_rows = [];
    temp.cart.id_currency = 3;
    temp.cart.id_customer = this.state.customerId;
    temp.cart.id_guest = this.state.guestId;
    temp.cart.id_lang = 1;
    //temp.cart.secure_key = "ef19e7b5c32a541511bc54c520e6fc22";

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(temp);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;

    return bodyXML;
  }


  putCart(product) {
    console.log('put product inside',this.state.product.quantity);
    // if(this.state.limitOfQuantity > 0){
      if(this.state.product.quantity > 0){
      storage.get('cart_id').then((cartId) => {
        console.log("cart id now = " + cartId);
        if (cartId == null){ 
            storage.get('customer_id').then((customerId) => {
              console.log("customer id now = " + customerId);
              // if(customerId == null) {
              //   this.createGuest(product);
              // } else{
              //   this.setState({customerId: customerId});
              //   storage.get('guest_id').then((guestId) => {
              //     this.setState({guestId: guestId});  
              //     this.postCart(product); 
              //   });

              // }
              storage.get('guest_id').then((guestId) => {
                if(guestId == null){
                  this.createGuest(product, customerId);
                }else{
                  this.setState({customerId: customerId});
                  this.setState({guestId: guestId});  
                  this.postCart(product); 
                }

              });

            });
        } else {
          this.setState({loading: true});
          url = GET_CART_URL + cartId + JSON_FORMAT;
          fetch(url, {
            method: "GET",
            headers: {
              'Authorization': 'Basic ' + HEADER_ENCODED
            },
          })
          .then(res => res.json())
          .then(resJson => {
            this.getCartBody(resJson, product);
          }).catch(error => {
            this.setState({loading: false})
            console.log(error);
          })
        }
      });
    }else{
      this.refs.toast.show(i18n.t('product_detail_screen.out_of_stock', { locale: this.state.lang } ),DURATION.LENGTH_LONG);
    }
  }


  getCartBody(temp, product) {
    
    if (temp.cart.hasOwnProperty("associations")) {
      existCartRow = false;
      tempCartRow = [];
      for (let i = 0; i < temp.cart.associations.cart_rows.length; i++) {
        tempCartRow[i] = {};
        tempCartRow[i] = temp.cart.associations.cart_rows[i];
      };
      delete temp.cart.associations.cart_rows;

      temp.cart.associations.cart_rows = {};
      temp.cart.associations.cart_rows.cart_row = [];
      // console.log("CartRow",tempCartRow);
      for (let i = 0; i < tempCartRow.length; i++) {
        
        if (tempCartRow[i].id_product == product.id && tempCartRow[i].id_product_attribute == this.state.id_product_attribute) {
          existCartRow = true;
          _quantity = parseInt(tempCartRow[i].quantity) + parseInt(this.state.quantity);
          if (_quantity > this.state.product.quantity) {
            tempCartRow[i].quantity = this.state.product.quantity;
            this.setState({totalPrice: 0});
          } else {
            tempCartRow[i].quantity = _quantity;
            console.log(" state unitprice = ",this.state.unitPrice);
            this.setState({totalPrice: this.state.unitPrice});
          }
          
        } else {
          console.log(" no state unitprice = ",this.state.unitPrice);
          this.setState({totalPrice: this.state.unitPrice});
        }
        temp.cart.associations.cart_rows.cart_row.push(tempCartRow[i]);
      };
      console.log("existcart",existCartRow);
      if (!existCartRow) {
        cartRow = {}
        cartRow.id_product = product.id;
        cartRow.id_product_attribute = this.state.id_product_attribute;
        // cartRow.id_address_delivery = 23;
        cartRow.quantity = this.state.quantity;
        temp.cart.associations.cart_rows.cart_row.push(cartRow);
        console.log(" not exist state unitprice = ",this.state.unitPrice);
      }

    } else {
      temp.cart['associations'] = {};
      temp.cart.associations['cart_rows'] = {};
      temp.cart.associations.cart_rows.cart_row = [];
      cartRow = {};
      cartRow.id_product = product.id;
      cartRow.id_product_attribute = this.state.id_product_attribute;
      // cartRow.id_address_delivery = 23;
      // cartRow.quantity = this.state.quantity;
      cartRow.quantity = 1;
      this.setState({totalPrice: this.state.unitPrice});

      temp.cart.associations.cart_rows.cart_row.push(cartRow);
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(temp);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
    this.putCartRequest(bodyXML);
  }

  putCartRequest(body) {
    url = POST_CART_URL;
    fetch(url, {
      method: "PUT",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
      body: body,
    })
      .then(res => res.json())
      .then(resJson => {
        console.log("product detail put cart == ");
        console.log(resJson);
        this.setState({ cart: resJson });
        cartPrice = 0;
        storage.get('cart_price').then((cart_price) => {
          cartPrice = cart_price;
          console.log("cart price from local =  ", cartPrice);
          console.log("total price from state =  ", this.state.totalPrice);
          storage.save('cart_price', parseFloat(cartPrice) + parseFloat(this.state.totalPrice));
        });

        storage.save('cart', resJson);
        storage.get('cart').then((cart) => {
          this.setState({modalVisible: true});
        });

        this.setState({ loading: false })

      }).catch(error => {
        this.setState({ loading: false })
        console.log(error);
      })
  }

  // -------------------------------------------------------------//
  getColorsAndSizes(product) {
    // this.setState({ loading: true });
    console.log("get color and sizes...");
    _sizeList = [];
    _colorList = [];
    _optionValueList = [];
    filter_optionValueIds = "";
    optionValueIds = product.associations.product_option_values;
    for (var i = 0; i < optionValueIds.length; i++) {
      filter_optionValueIds =filter_optionValueIds + optionValueIds[i].id + "|";
    }
      url = GET_PRODUCT_OPTION_VALUES_URL + FULL_JSON_FORMAT + "&filter[id]=[" + filter_optionValueIds + "]";
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        },
      })
        .then(res => res.json())
        .then(resJson => {
          _optionValueList = resJson.product_option_values;
            for (var j = 0; j < _optionValueList.length; j++) {
              if (_optionValueList[j].color == "") {
                _sizeList.push(_optionValueList[j].name[0].value);
              } else {
                _colorList.push(_optionValueList[j].color);
              }
            }
            this.setState({ sizeList: _sizeList, colorList: _colorList, selColor: _colorList[0], selSize: _sizeList[0] });
            this.selectColorFunc(this.state.selColor);
            this.selectSizeFunc(this.state.selSize);
        }).catch(error => {
          console.log(error);
        })
  }

  // -------------  get related products in same categories -----------------------------//
  getSpecificPrices(product){
    
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
  getRelatedProducts(product) {
    this.setState({loading: true});
    categoryIds = product.associations.categories;
    filter_categoryIds = "";
    categoriesGruoup = [];
    productIdGroups = [];
    productIds = [];
    _relativeProductIds = [];
    for (var i = 0; i < categoryIds.length; i++) {
      filter_categoryIds = filter_categoryIds + categoryIds[i].id + "|";
    }
    url = GET_CATEGORY_URL + FULL_JSON_FORMAT + "&filter[id]=[" + filter_categoryIds + "]";
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        },
      })
        .then(res => res.json())
        .then(resJson => {
          categoriesGruoup = resJson.categories;
          for(var j = 0; j < categoriesGruoup.length; j++){
            productIdGroups = categoriesGruoup[j].associations.products;
            for (var k = 0; k < productIdGroups.length; k++) {
              productIds.push(productIdGroups[k].id);
            }
          }
            productIdsUnique = productIds.filter((val, id, array) => {
              return array.indexOf(val) == id;
            });
            selfIndex = productIdsUnique.indexOf(product.id);
            if (selfIndex > -1) {
              productIdsUnique.splice(selfIndex, 1);
            }

            randomNums = [];
            for (var l = 0; l < productIdsUnique.length; l++) {
              randomNum = this.getRandomArbitrary(0, productIdsUnique.length);
              if (l == 0 || randomNums.indexOf(randomNum) == -1) {
                randomNums.push(randomNum);
                idObject = productIdsUnique[randomNum];
                _relativeProductIds.push(idObject);
              }
              if (randomNums.length == 15) break;
            }
            filter_productIds = "";
            products = [];
            for(var m=0; m<_relativeProductIds.length; m++){
              filter_productIds = filter_productIds + _relativeProductIds[m] + "|";
            }
              url = PRODUCT_URL + FULL_JSON_FORMAT + "&filter[id]=[" + filter_productIds + "]";
              fetch(url, {
                method: "GET",
                headers: {
                  'Authorization': 'Basic ' + HEADER_ENCODED
                },
              })
              .then(res => res.json())
              .then(resJson => { 
                products = resJson.products;
                    for(var j=0; j<products.length; j++){
                      for(var k=0; k<this.state.specificPrices.length; k++){
                        products[j].promo = false;
                        if(products[j].id == this.state.specificPrices[k].id_product){
                          products[j].specific_price = this.state.specificPrices[k];
                          products[j].reduction_price = (1 - this.state.specificPrices[k].reduction) * products[j].price; 
                          products[j].reduction = this.state.specificPrices[k].reduction; 
                          products[j].promo = true;
                          products[j].real_price = products[j].reduction_price;
                          // products[j].specific_ref = this.state.specificPrices[k].ref
                          break;
                        } 
                      }
                      if(!products[j].promo){
                        products[j].real_price = products[j].price;
                      }
                    }
                this.setState({loading: false, relateProductList: products});
              }).catch(error => {
                this.setState({loading: false});
                alert(i18n.t('global.server_connect_failed', { locale: this.state.lang } ));
                console.log(error);
              })  
        }).catch(error => {
          this.setState({loading: false});
          console.log(error);
        })
  }

  getRandomArbitrary(min, max) {
    num = Math.round(Math.random() * (max - min) + min);
    return num;
  }

  onPressContinueButton(){
    this.setState({modalVisible: false});
    this.componentDidMount();
  }

  onPressCheckoutButton(){
    this.setState({modalVisible: false});
    this.props.navigation.navigate("Cart");
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = (props) => {
    return <TabBar {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />;
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return (
          <View>
            {this.state.product != {} &&
              <View style={[styles.tabcontainer, { padding: Metrics.baseMargin}]} >
                {/* {console.log("First route rendering....", this.state.product.hasOwnProperty('quantity'))} */}
                <Text style={styles.textDesction}>
                   {i18n.t('product_detail_screen.reference', { locale: this.state.lang }) } {this.state.product.reference}
                </Text>
                {console.log("state.product = ", this.state.product)}  
                {this.state.product.hasOwnProperty('quantity') &&    
                  <Text style={styles.textDesction}>
                    {i18n.t('product_detail_screen.in_stock', { locale: this.state.lang })} {this.state.product.quantity} {i18n.t('product_detail_screen.items', { locale: this.state.lang })}
                  </Text>
                }
                {this.state.product.ean13 != "" &&
                    <Text style={styles.textDesction}>
                      {i18n.t('product_detail_screen.specific_references', { locale: this.state.lang })}
                    </Text>
                }  
                {this.state.product.ean13 != "" &&
                    <Text style={styles.textDesction}>
                      {i18n.t('product_detail_screen.ean13', { locale: this.state.lang })} {this.state.product.ean13} 
                    </Text>
                }
                {this.state.product.show_condition == "1" &&
                    <Text style={styles.textDesction}>
                       {i18n.t('product_detail_screen.condition_new_product', { locale: this.state.lang })}
                    </Text>
                } 
                             
            </View>}
          </View>
        );
      case 'second':
        return (
          <View style={[styles.container, { padding: Metrics.baseMargin }]} >
            <Text style={styles.textDesction}>
              {/* {this.props.reviews} */}
         
            </Text>
        </View>);
      default:
        return null;
    }
  };

  render() {
    const { quantity, total, selected, imageUrls, cart, unitPrice, lang, isRTL } = this.state;
    const { product } = this.props.navigation.state.params;
    console.log("detail_product",product)
    // this.setState({ totalPrice: unitPrice * quantity });

    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          currency={this.state.currency}
          cartPrice={ChangeCurrency(this.state.cartPrice, this.state.oldCurrency, this.state.currency, this.state.currencies)}
          quantity={this.state.cartQuantity}
          back={true}
          cart={true}
        />
        {/* <Icon
          image={require('../../resources/icons/like.png')}
          tintColor={selected === true ? Colors.red : Colors.white}
          backgroundColor={selected === true ? Colors.white : Colors.dark_gray}
          borderRadius={true}
          width={35}
          styleIcon={[
            AppStyles.positionTopRight,
            {
              marginTop: Metrics.navBarHeight + Metrics.baseMargin,
              marginRight: Metrics.baseMargin
            }
          ]}
          onPress={() => this.changeState(!selected)}
        />
        <Icon
          image={require('../../resources/icons/share.png')}
          tintColor={Colors.white}
          backgroundColor={Colors.dark_gray}
          borderRadius={true}
          width={35}
          styleIcon={[
            AppStyles.positionTopRight,
            {
              marginTop: Metrics.navBarHeight * 2 + Metrics.baseMargin,
              marginRight: Metrics.baseMargin
            }
          ]}
          onPress={() => { this.share() }}
        />
        <Icon
          image={require('../../resources/icons/speech.png')}
          tintColor={Colors.white}
          backgroundColor={Colors.dark_gray}
          borderRadius={true}
          width={35}
          styleIcon={[
            AppStyles.positionTopRight,
            {
              marginTop: Metrics.navBarHeight * 3 + Metrics.baseMargin,
              marginRight: Metrics.baseMargin
            }
          ]}
          onPress={() => { this.props.navigation.navigate("Commentaire") }}
        /> */}
        <Animated.ScrollView
          style={styles.container}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
          )}
        >
          <View style={{
            // height: Metrics.deviceHeight - Metrics.navBarHeight,
            marginBottom:10,
            backgroundColor: Colors.lightBg_gray
          }}>
            <CarouselProduct items={imageUrls} />
            <ProductColors arrayColors={this.state.colorList} selectColorFunc={this.selectColorFunc} />
            <ProductSizes arraySizes={this.state.sizeList} selectSizeFunc={this.selectSizeFunc} />
            <View style={AppStyles.center}>
              <Text style={styles.productName}>
                {product.name[0].value}
              </Text>
              <View style={[
                AppStyles.row,
                {
                  alignItems: "center",
                  marginTop: Metrics.baseMargin
                }
              ]}>
                <Text style={styles.productPrice}>
                {this.state.currency}{ChangeCurrency(unitPrice, this.state.oldCurrency, this.state.currency, this.state.currencies)}
                </Text>
                {product.promo && (
                  <Promo value={Math.round(product.reduction * 100)} />
                )}
                {product.promo && (   
                <Text style={[styles.productPricePromo, { textDecorationLine: "line-through" }]}>
                  {this.state.currency}{ChangeCurrency(product.price, this.state.oldCurrency, this.state.currency, this.state.currencies)}
                </Text>
                )}
              </View>
            </View>
          </View>
          {/* <ProductTabView
            productDetail={this.state.product}
            reviews={product.meta_description[0].value} /> */}
            <TabViewAnimated
              style={styles.tabcontainer}
              navigationState={this.state}
              renderScene={this._renderScene}
              renderHeader={this._renderHeader}
              onIndexChange={this._handleIndexChange}
              initialLayout={initialLayout}
            />
          <ProductListSlide
            title={ i18n.t('product_detail_screen.product_related_to_this_item', { locale: lang })}
            list={this.state.relateProductList}
          />
        </Animated.ScrollView>
        <ButtonShopping
          total={total}
          quantity={quantity}
          cart={cart}
          addQuantity={() => this.addQuantity(product.real_price)}
          subQuantity={() => this.subQuantity(product.real_price)}
          putCart={() => this.putCart(product)}
        // onPress={() => { this.props.navigation.navigate("Cart") }}
        />
        <Modal
          isVisible={this.state.modalVisible}
          animationIn={'bounceInUp'}
          animationOut={'fadeOutUpBig'}
          animationInTiming={1200}
          animationOutTiming={900}
          backdropTransitionInTiming={1200}
          backdropTransitionOutTiming={900}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContent}>
            <Text style={{ textAlign: 'center', marginTop: 40, marginLeft: 30, marginRight: 30, fontSize: 16 }}> Product successfully added to your shopping cart </Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => this.onPressContinueButton()}>
                <View style={styles.button}>
                  <Text style={{textAlign: 'center'}}>CONTINUE SHOPPING</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onPressCheckoutButton()}>
                <View style={styles.button}>
                  <Text style={{textAlign: 'center'}}> PROCEED TO CHECKOUT</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Spinner visible={this.state.loading} />
        <Toast ref="toast"/>
      </View>
    );
  }
}

export default PublicityDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  block: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.baseMargin,
  },
  description: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.baseMargin
  },
  buttonShopping: {
    flex: 1,
    height: 50
  },
  title: {
    fontFamily: Fonts.type.Bold,
    textAlign: "center",
    color: Colors.black,
    marginVertical: Metrics.baseMargin
  },
  productName: {
    fontFamily: Fonts.type.Bold,
    textAlign: "center",
    fontSize: Fonts.size.large,
    color: Colors.black,
    marginTop: Metrics.baseMargin
  },
  productPrice: {
    ...Fonts.style.h5,
    ...Fonts.style.bold,
    textAlign: "center",
    color: Colors.dark_gray
  },
  productPricePromo: {
    ...Fonts.style.h5,
    textAlign: "center",
    color: Colors.dark_gray
  },
  textDesction: {
    ...Fonts.style.normal,
    color: Colors.dark_gray,
  },
  tabcontainer: {
    flex: 1,
    height: 250,
  },
  tabbar: {
    backgroundColor: Colors.white,
    height: 50
  },
  tab: {},
  indicator: {
    backgroundColor: Colors.appColor,
    color: Colors.red,
  },
  label: {
    color: Colors.black,
    fontWeight: '400',
  },
  modalContent: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 200,
    width: 400,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: 'white',
  },

  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});