import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import HeaderWithAnimatedImage from "../../components/Header/HeaderWithAnimatedImage";
import ModalLayout from "../../components/modal/ModalLayout";
import NewsLetter from "../../components/home/NewsLetter";
import Map from "../../components/home/Map";
import CategorieList from "../../components/categorie/CategorieList";
import { Kstore } from "../../data/Kstore";
import { HOME_URL, HEADER_ENCODED, PRODUCT_URL, JSON_FORMAT, THUMB_IMAGE_URL, IMAGE_WS_KEY, CART_TEMP, PRE_OF_BODY_XML, END_OF_BODY_XML, GET_CURRENCIES_URL, FULL_JSON_FORMAT, GET_COUNTRY_URL, GET_ADDRESS_URL, DISPLAY_FULL, } from "../../constants/constants"
import CategorieListMain from '../../components/categorie/CategorieListMain';
import { Categories } from '../../data/Categories';
import {ChangeCurrency} from '../../constants/helper'

var storage = require("react-native-local-storage");
export default class HomeScreen extends PureComponent {

  constructor(props) {
    super(props);
    // Listen to all events for screen B
    this.props.navigation.addListener(
      'willFocus',
      () => {
        this.forceUpdate(null);
        console.log("will focus..");

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
    layout: 2,
    animatedValue: new Animated.Value(0),
    modalVisible: false, 
    categoriesData: [],
    mainCategoriesData:[],
    categorieOfNewArrival: null,
    categorieOfTopsAndBottom: null,
    arrivalThumbImageUrl : " ",
    topsAndBottomsThumbImageUrl : " ",
    cartPrice: "",
    cartQuantity: 0,
    currency: "BHD",
    oldCurrency: "BHD",
    currencies: [],
    timer: 3,
    lang: "",
    isRTL: false,
  };
 
  componentDidMount() {

    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });

    this.interval = setInterval(
      () => this.setState({timer: --this.state.timer}),
      1000
    );

    storage.get('new_currency').then((currency) => {
      if(currency == null){
        storage.save('old_currency', this.state.currency);
        storage.save('new_currency', this.state.currency);
        storage.get('new_currency').then((currency) => {
          this.setState({currency: currency});
        })
       
      } else {
          this.setState({currency: currency});
      }
      
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

    this.getCategories();
    this.getCartQuantity();
    this.fetchCurrenciesUsingThirdApi();
    this.getCountries();

  };

  componentDidUpdate(){
    if(this.state.timer === 1){
      clearInterval(this.interval);        
    }
  }
  

  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  getCountries(){
      url = GET_COUNTRY_URL + "?display=full&output_format=JSON";
      
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        }
      })
        .then(res => res.json())
        .then(resJson => {
          this.setState({
            error: resJson.error || null,
            loading: false,
          })

          countries = resJson.countries;
          if (countries.length > 0) {
            storage.save('countries', resJson.countries);
          }
          storage.get('customer_id').then((customer_id) => {
            if(customer_id != null) {
              url = GET_ADDRESS_URL + "?" + "filter[id_customer]=" + customer_id + DISPLAY_FULL + JSON_FORMAT;
              fetch(url, {
                method: "GET",
                headers: {
                  'Authorization': 'Basic ' + HEADER_ENCODED
                }
              })
              .then(res => res.json())
              .then(resJson => {
                if(resJson.hasOwnProperty('addresses'))
                {
                  console.log("aaa");
                  storage.save('country_id', resJson.addresses[0].id_country);
                  storage.save('delivery_address', resJson.addresses[0]);
                  storage.save('invoice_address', resJson.addresses[0]);
                }
                this.setState({loading: false});
              }).catch(error => {
                this.setState({loading: false});
                console.log(error);
              })
            }
          });
          this.setState({loading: false});
        }).catch(error => {
          this.setState({loading: false});
          console.log(error);
        })
  }

  // changeCurrency(price){

  //   preRate = 1;
  //   nextRate = 1; 
  //   if (this.state.oldCurrency == '$') {this.state.oldCurrency = 'USD'}
  //   if (this.state.currency == '$') {currency = 'USD'}
  //   if(this.state.currencies != null){
  //     for(var i=0; i<Object.keys(this.state.currencies).length; i++){
  //       currencyKey = Object.keys(this.state.currencies)[i].substring(3);
  //       if("BHD" == currencyKey){
  //         reversPreRate = Math.floor(Object.values(this.state.currencies)[i] * 1000)/1000;
  //         preRate = Math.floor(1/reversPreRate * 1000)/1000;
  //         console.log("bhd currency preRate= ", preRate);
  //       } 
  //       if(this.state.currency == currencyKey){
  //         nextRate =  Math.floor(Object.values(this.state.currencies)[i] *1000)/1000;
  //       }
  //     };
  //   }

  //   rate = preRate * nextRate;
  //   console.log("change currency = " + this._formatOfPrice(price * rate));
  //   return this._formatOfPrice(price * rate);
     
  // }

  fetchCurrenciesUsingThirdApi(){
    url =GET_CURRENCIES_URL + FULL_JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
    .then(res => res.json())
    .then(resJson => {
      console.log("online_currencies",resJson.currencies);
      storage.save('currencies', resJson.currencies);
      storage.get('currencies').then((currencies)=>{
        console.log("qqqq",currencies);
      })
      this.setState({currencies:resJson.currencies});
    }).catch(error => {
      this.setState({loading: false});
      console.log(error);
    })
  }

  getCartQuantity(){

    storage.get('cart').then((cart) => {
      cartQuantity = 0;
      if (cart.cart.associations == null) {
        this.setState({cartQuantity: 0});
      } else {
          for(var i=0; i<cart.cart.associations.cart_rows.length; i++){
          cartQuantity = cartQuantity + parseInt(cart.cart.associations.cart_rows[i].quantity);
        }
        this.setState({cartQuantity: cartQuantity});
      }
    });
  }

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

  getCategories =  () => {
    this.setState({ loading: true });
    fetch(HOME_URL, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        var jsonArrayOfCategories = [];
        var jsonArrayOfCategoriesWithDepth2 = [];
        var addintionalCategorie = {};
        for(var i=2;i<resJson.categories.length;i++){
          if( resJson.categories[i].hasOwnProperty("associations")) {
            if(resJson.categories[i].associations.hasOwnProperty("products")){
              if(resJson.categories[i].id == 4){
                this.getThumbOfCategorie(resJson.categories[i], resJson.categories[i].id),
                this.setState({categorieOfTopsAndBottom: resJson.categories[i]})
              }
              if(resJson.categories[i].id == 13){
                this.getThumbOfCategorie(resJson.categories[i], resJson.categories[i].id),
                this.setState({categorieOfNewArrival: resJson.categories[i]})
              }
              jsonArrayOfCategories.push(resJson.categories[i])
              // resJson.categories[i].id_parent == 2 && (                       // dynamic version
              //   jsonArrayOfCategoriesWithDepth2.push(resJson.categories[i])
              // )
              for(var j=0; j<Categories.length; j++){
                if(resJson.categories[i].id == Categories[j].id){
                    Categories[j].content = resJson.categories[i];
                }
                if(resJson.categories[i].id == 27) {
                  addintionalCategorie = resJson.categories[i];
                }
              }
            }  
          }
        }

        for(var i=0; i<Categories.length; i++){
          if(Categories[i].id != 4){
            continue;
          } else{
            for(var j=0; j<addintionalCategorie.associations.products.length; j++){
              Categories[i].content.associations.products.push(addintionalCategorie.associations.products[j]);
            }
          }
        }

        this.setState({
          error: resJson.error || null,
          categoriesData : jsonArrayOfCategories,
          mainCategoriesData : Categories,
        })
      }).catch(error => {
        this.setState({ error, loading: false });
        console.log(error);
        alert(i18n.t('global.server_connect_failed', { locale: lang } ));
      })
  }

  getThumbOfCategorie = (item, categorieId) => {
    item.hasOwnProperty("associations") && (
      item.associations.hasOwnProperty("products") && (
        this.getFirstProductId(item, categorieId)
      ) 
    )
  };

  getFirstProductId = (item, categorieId) => {
      id = item.associations.products[0].id,
      this.getThumbProductRequest(id, categorieId)
  };

  getThumbProductRequest = (_thumbProductId, categorieId) => {
    const url = PRODUCT_URL + _thumbProductId + JSON_FORMAT;

    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
    .then(res => res.json())
    .then(resJson => { 
      _thumbIdDefaultImageId = resJson.product.id_default_image;
      this.getThumbImageRequest(_thumbIdDefaultImageId, _thumbProductId, categorieId);
      this.setState({
        error: resJson.error || null,
        loading: false,
      })

    }).catch(error => {
      this.setState({loading: false });
      console.log(error);
    })

  };

  getThumbImageRequest = (_thumbIdDefaultImageId, _thumbProductId, categorieId) => {
    url = THUMB_IMAGE_URL + _thumbProductId + "/" + _thumbIdDefaultImageId + IMAGE_WS_KEY;
    categorieId == 13 && this.setState({arrivalThumbImageUrl: url});
    categorieId == 4 && this.setState({topsAndBottomsThumbImageUrl: url});
  }

 
  render() {
    const {
      layout,
      modalVisible ,
      categorieOfNewArrival,
      categorieOfTopsAndBottom,
      arrivalThumbImageUrl,
      topsAndBottomsThumbImageUrl,
      lang,
      isRTL,
    } = this.state;

    let translateY = this.state.animatedValue.interpolate({
      inputRange: [0, Metrics.maxHeightHeader + 100],
      outputRange: [0, -Metrics.maxHeightHeader],
      extrapolate: 'clamp',
    });

    console.log("interval timer = ", this.state.timer);

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
          // grid={true}
          back={false}
          cart={true}
          search={true}
          goSearch={() => { this.props.navigation.navigate("SearchProduct") }}
        />

        <ScrollView>
           <CategorieListMain
            title={" "}
            list={this.state.mainCategoriesData} 
            styleList={{ marginTop: Metrics.swipeHeightHeader + Metrics.baseMargin}}
          /> 
          <CategorieList
            title={ i18n.t('home_screen.our_categories', { locale: lang })}
            list={this.state.categoriesData}
          />
          
          <Map />
          <NewsLetter store={Kstore} />
          <HeaderWithAnimatedImage
            translateY={translateY}
            categorieOfNewArrival = {categorieOfNewArrival}
            categorieOfTopsAndBottom = {categorieOfTopsAndBottom}
            arrivalThumbImageUrl = {arrivalThumbImageUrl}
            topsAndBottomsThumbImageUrl = {topsAndBottomsThumbImageUrl}
            navigation={this.props.navigation}
          />
        </ScrollView>
        <ModalLayout
          visible={modalVisible}
          layout={layout}
          updateLayout={this._updateLayout}
        />
         <Spinner visible={this.state.loading} textContent={i18n.t('global.connecting', { locale: lang })} textStyle={{ color: '#FFF' }} />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    ...Fonts.style.h4,
    ...Fonts.style.bold,
    color: Colors.black,
    marginVertical: Metrics.smallMargin,
    marginHorizontal: Metrics.smallMargin
  },
});
