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
import { Dropdown } from 'react-native-material-dropdown';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
import Spinner from 'react-native-loading-spinner-overlay';
import i18n from '../../helpers/I18n/I18n';

import Promo from "../../components/Product/Promo";
import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import ModalFilter from '../../components/modal/ModalFilter';
import SwitchLayout from '../../components/modal/SwitchLayout';
import { SubCategories } from '../../data/SubCategories';
import { PRODUCT_URL, JSON_FORMAT, HEADER_ENCODED, FULL_JSON_FORMAT, THUMB_IMAGE_URL, IMAGE_WS_KEY, GET_SPECIFIC_PRICE_URL, DISPLAY_FULL } from '../../constants/constants';
import { ChangeCurrency } from '../../constants/helper';

var storage = require("react-native-local-storage");
export default class ListProductScreen extends PureComponent {
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
    loading: true,
    layout: 2,
    subCategorie: 0,
    nameCategorie: "",

    animatedValue: new Animated.Value(0),
    modalVisible: false,
    loading: false,
    refreshing: false,

    key: "",
    productIds: [],
    products: [],
    specificPrices: [],

    currency: "BHD",
    oldCurrency: "BHD",
    currencies: [],

    lang: "",
    isRTL: false,
    cartPrice: "",
    cartQuantity: 0

  };


  componentDidMount() {
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({ lang: lang });
        if (lang == 'ar') {
          this.setState({ isRTL: true });
        }
      }
    });

    storage.get('new_currency').then((currency) => {
      this.setState({ currency: currency });
    });

    storage.get('old_currency').then((oldCurrency) => {
      this.setState({ oldCurrency: oldCurrency });
    });

    storage.get('currencies').then((currencies) => {
      this.setState({ currencies: currencies });

    });
    storage.get('cart_price').then((cart_price) => {
      this.setState({ cartPrice: cart_price });
    });

    this.getCartQuantity();

    categorie = this.props.navigation.state.params.categorie;
    if (categorie == "") {
      products = this.props.navigation.state.params.products;
      this.setState({ products: products });
    } else {
      this.setState({ subCategorie: categorie.id });
      this.setState({ nameCategorie: categorie.name[0].value });
      this._makeRemoteRequest();
    }
  }

  getCartQuantity() {
    storage.get('cart').then((cart) => {
      cartQuantity = 0;
      if (cart.cart.associations == null) {
        this.setState({ cartQuantity: 0 });
      } else {
        for (var i = 0; i < cart.cart.associations.cart_rows.length; i++) {
          cartQuantity = cartQuantity + parseInt(cart.cart.associations.cart_rows[i].quantity);
        }
        this.setState({ cartQuantity: cartQuantity });
      }
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

  _makeRemoteRequest = () => {

    productIds = [];
    productIdItems = categorie.associations.products;

    for (var i = 0; i < productIdItems.length; i++) {
      productIds.push(productIdItems[i].id);
    }
    this.setState({ relevanceSortedProductIds: productIds });
    this.setState({ productIds: productIds });

    this.getSpecificPrices();

  };

  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  getSpecificPrices() {
    this.setState({ loading: true });
    url = GET_SPECIFIC_PRICE_URL + FULL_JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
      .then(res => res.json())
      .then(resJson => {
        this.setState({ specificPrices: resJson.specific_prices });
        this.getProductListWithIds(this.state.productIds);
      }).catch(error => {
        this.setState({ loading: false });
        alert(i18n.t('global.connecting', { locale: lang }));
        console.log(error);
      })
  }
  getProductListWithIds(productIds) {
    filter_productIds = "";
    products = [];
    for (var i = 0; i < productIds.length; i++) {
      filter_productIds = filter_productIds + productIds[i] + "|";
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
        for (var j = 0; j < products.length; j++) {
          for (var k = 0; k < this.state.specificPrices.length; k++) {
            products[j].promo = false;
            if (products[j].id == this.state.specificPrices[k].id_product) {
              products[j].specific_price = this.state.specificPrices[k];
              products[j].reduction_price = (1 - this.state.specificPrices[k].reduction) * products[j].price;
              products[j].reduction = this.state.specificPrices[k].reduction;
              products[j].promo = true;
              products[j].real_price = products[j].reduction_price;
              break;
            }
          }
          if (!products[j].promo) {
            products[j].real_price = products[j].price;
          }
        }
        this.setState({ loading: false, products: products });
      }).catch(error => {
        this.setState({ loading: false });
        alert(i18n.t('global.connecting', { locale: lang }));
        console.log(error);
      })

  }


  sortWithRelevance() {
    sortedRelevanceProducts = [];
    relevanceProductIds = this.state.productIds;
    for (var i = 0; i < relevanceProductIds.length; i++) {
      for (var j = 0; j < this.state.products.length; j++) {
        if (relevanceProductIds[i] == this.state.products[j].id) {
          sortedRelevanceProducts.push(this.state.products[j]);
          break;
        }
      }
    }
    return sortedRelevanceProducts;
  }

  sortWithReverseRelevance() {
    sortedRelevanceProducts = [];
    relevanceProductIds = this.state.productIds;
    for (var i = 0; i < relevanceProductIds.length; i++) {
      for (var j = 0; j < this.state.products.length; j++) {
        if (relevanceProductIds[i] == this.state.products[j].id) {
          sortedRelevanceProducts.push(this.state.products[j]);
          break;
        }
      }
    }

    reverseSortedRelevanceProducts = [];
    for (var i = sortedRelevanceProducts.length - 1; i >= 0; i--) {
      reverseSortedRelevanceProducts.push(sortedRelevanceProducts[i]);
    };

    return reverseSortedRelevanceProducts;
  }

  sortWithDateAdd() {
    sortedPositionProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = Date.parse(a.date_add);
      console.log("x = ");
      console.log(x);

      var y = Date.parse(b.date_add);
      console.log("y = ");
      console.log(y);
      return y - x;
    })

    for (var i = 0; i < products.length; i++) {
      sortedPositionProducts.push(products[i]);
    }
    return sortedPositionProducts;
  }

  sortWithId() {
    sortedIdProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = parseFloat(a.id);
      var y = parseFloat(b.id);
      return y - x;
    })

    for (var i = 0; i < products.length; i++) {
      sortedIdProducts.push(products[i]);
    }
    return sortedIdProducts;
  }

  sortWithAttribute() {
    sortedIdProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = parseFloat(a.associations.combinations[0].id);
      var y = parseFloat(b.associations.combinations[0].id);
      return y - x;
    })

    for (var i = 0; i < products.length; i++) {
      sortedIdProducts.push(products[i]);
    }
    return sortedIdProducts;
  }

  sortWithPositionInCategory() {
    sortedPositionProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = parseFloat(a.position_in_category);
      var y = parseFloat(b.position_in_category);
      return y - x;
    })

    for (var i = 0; i < products.length; i++) {
      sortedPositionProducts.push(products[i]);
    }
    return sortedPositionProducts;
  }

  sortWithName() {
    sortedNameProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = a.name[0].value.toLowerCase();
      var y = b.name[0].value.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    })

    for (var i = 0; i < products.length; i++) {
      sortedNameProducts.push(products[i]);
    };

    return sortedNameProducts;

  }

  sortWithReverseName() {
    sortedNameProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = a.name[0].value.toLowerCase();
      var y = b.name[0].value.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    })

    reverseSortedNameProducts = [];
    for (var i = 0; i < products.length; i++) {
      sortedNameProducts.push(products[i]);
    };
    for (var i = products.length - 1; i >= 0; i--) {
      reverseSortedNameProducts.push(products[i]);
    };

    return reverseSortedNameProducts;

  }

  sortWithPrice() {
    sortedPriceProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = parseFloat(a.real_price);
      var y = parseFloat(b.real_price);
      return x - y;
    })

    for (var i = 0; i < products.length; i++) {
      sortedPriceProducts.push(products[i]);
    }
    return sortedPriceProducts;

  }
  sortWithReversePrice() {
    sortedPriceProducts = [];
    products = this.state.products;
    products.sort((a, b) => {
      var x = parseFloat(a.real_price);
      var y = parseFloat(b.real_price);
      return x - y;
    })

    reverseSortedPriceProducts = [];
    for (var i = 0; i < products.length; i++) {
      sortedPriceProducts.push(products[i]);
    }
    for (var i = products.length - 1; i >= 0; i--) {
      reverseSortedPriceProducts.push(products[i]);
    }

    return reverseSortedPriceProducts
  }

  _handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => { this._makeRemoteRequest(); }
    );
  };

  _openModal = () => {
    this.setState({ modalVisible: true });
  }

  _closeModal = () => {
    this.setState({ modalVisible: false });
  }

  _updateLayout = (item) => {
    this.setState({ layout: item });
    this._closeModal();
  }

  _updateSubCategorie = (item) => {
    this.setState({ subCategorie: item.id });
    this.setState({ nameCategorie: item.name[0].value });
    this._closeModal();
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
          // styleText={{ ...Fonts.style.small }}
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
    const {
      layout,
      subCategorie,
      nameCategorie,
      modalVisible,
      refreshing,
      lang,
      isRTL
    } = this.state;

    let translateY = this.state.animatedValue.interpolate({
      inputRange: [0, 700],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });


    let data = [];
    if (categorie = this.props.navigation.state.params.categorie != "") {

      data = [{
        value: i18n.t('list_product_screen.relevance', { locale: lang }),
      }, {
        value: i18n.t('list_product_screen.name_atoz', { locale: lang }),
      }, {
        value: i18n.t('list_product_screen.name_ztoa', { locale: lang }),
      }, {
        value: i18n.t('list_product_screen.price_ltoh', { locale: lang }),
      }, {
        value: i18n.t('list_product_screen.price_htol', { locale: lang }),
      }];

      if (this.state.key == "") products = this.sortWithReverseRelevance();
      if (this.state.key == i18n.t('list_product_screen.relevance', { locale: lang })) products = this.sortWithRelevance();
      if (this.state.key == i18n.t('list_product_screen.name_atoz', { locale: lang })) products = this.sortWithReversePrice();
      if (this.state.key == i18n.t('list_product_screen.name_ztoa', { locale: lang })) products = this.sortWithPrice();
      if (this.state.key == i18n.t('list_product_screen.price_ltoh', { locale: lang })) products = this.sortWithReverseName();
      if (this.state.key == i18n.t('list_product_screen.price_htol', { locale: lang })) products = this.sortWithName();

    } else {

      data = [{
        value: i18n.t('list_product_screen.name_atoz', { locale: lang }),
      }, {
        value: i18n.t('list_product_screen.name_ztoa', { locale: lang }),
      }, {
        value: i18n.t('list_product_screen.price_ltoh', { locale: lang }),
      }, {
        value: i18n.t('list_product_screen.price_htol', { locale: lang }),
      }];

      if (this.state.key == i18n.t('list_product_screen.price_htol', { locale: lang })) products = this.sortWithReversePrice();
      if (this.state.key == i18n.t('list_product_screen.price_ltoh', { locale: lang })) products = this.sortWithPrice();
      if (this.state.key == i18n.t('list_product_screen.name_ztoa', { locale: lang })) products = this.sortWithReverseName();
      if (this.state.key == i18n.t('list_product_screen.name_atoz', { locale: lang })) products = this.sortWithName();

      console.log(products);
    }

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
          search={true}
          cart={true}
          goSearch={() => { this.props.navigation.navigate("SearchProduct") }}
        />

        <Text
          style={{ marginTop: (Platform.OS === 'ios') ? 30 : 10, marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>
          {nameCategorie}
        </Text>
        <AnimatedFlatList
          contentContainerStyle={[
            {
              marginTop: (Platform.OS === 'ios') ? 60 : 50,
              paddingBottom: 50
            },
            layout === 4 ? {} : styles.wrap
          ]}
          data={products}
          renderItem={({ item }) => this._renderItem(item)}
          // onRefresh={() => this._handleRefresh}
          // refreshing={refreshing}
          extraData={this.state}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.animatedValue } } }],
            { useNativeDriver: true }
          )}
          keyExtractor={(item, i) => i}
        />

        <Animated.View style={[
          styles.headerWrapper,
          AppStyles.row,
          AppStyles.spaceBetween,
          { transform: [{ translateY }] },
          { marginTop: (Platform.OS === 'ios') ? -20 : 0, }
        ]}
        >
          <SwitchLayout
            layout={layout}
            updateLayout={this._updateLayout}
          />

          <Dropdown
            containerStyle={{ width: 150, alignText: 'center', marginRight: 10, marginTop: -25 }}
            label={i18n.t('list_product_screen.sort', { locale: lang })}
            data={data}
            value=''
            itemCount={5}
            dropdownPosition={0}
            onChangeText={(text) => this.setState({ key: text })}
          />

        </Animated.View>

        <ModalFilter
          subCategories={SubCategories}
          subCategorie={subCategorie}
          nameCategorie={nameCategorie}
          visible={modalVisible}
          categorie={subCategorie}
          updateSubCategorie={this._updateSubCategorie}
          onCancel={this._closeModal}
        />
        <Spinner visible={this.state.loading} />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerWrapper: {
    position: 'absolute',
    backgroundColor: Colors.gray98,
    height: 50,
    top: (Platform.OS === 'ios') ? 110 : 75,
    left: 0,
    right: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray,
    paddingTop: (Platform.OS === 'ios') ? 20 : 15,
    paddingHorizontal: Metrics.baseMargin,
    alignItems: 'center',
  },
  filter: {
    marginTop: (Platform.OS === 'ios') ? -10 : 5,
    width: Metrics.deviceWidth / 2
  },

  container: {
    margin: Metrics.smallMargin
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
