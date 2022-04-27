import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  ImageBackground,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView
} from 'react-native';
import { withNavigation } from 'react-navigation';
import i18n from '../../helpers/I18n/I18n';

import Swiper from '../common/Swiper';
import ImageSlider from 'react-native-image-slider';
import BackgroundGradient from "../common/BackgroundGradient";
import Icon from '../common/Icon';
import {
  AppStyles,
  Colors,
  Fonts,
  Metrics,
  Images
} from '../../themes';
import { GET_SPECIFIC_PRICE_URL, FULL_JSON_FORMAT, HEADER_ENCODED, PRODUCT_URL } from '../../constants/constants';
import { isAbsolute } from 'path';
const { width, height } = Dimensions.get('window');

const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

var storage = require("react-native-local-storage");
export default class HeaderWithAnimatedImage extends PureComponent {

  static propTypes = {
    translateY: PropTypes.any,
    // image: PropTypes.any,
    // product: PropTypes.any,
    navigation: PropTypes.any,
    categorieOfNewArrival: PropTypes.object,
    categorieOfTopsAndBottom: PropTypes.object,
    arrivalThumbImageUrl: PropTypes.string,
    topsAndBottomsThumbImageUrl: PropTypes.string

  };

  static defaultProps = {
    image: null,
    categorieOfNewArrivale: null,
    categorieOfTopsAndBottom: null,
    arrivalThumbImageUrl: "",
    topsAndBottomsThumbImageUrl: "",
  };

  state = {
    specificPrices: [],
    onSaleProducts: [],
    index: 0,
    lang: "",
    isRTL: false,
  }
  componentDidMount() {
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });
    this.getSpecificPrices();
  }
  onPressSlide(index) {
    if (index == 1) {
      this.props.navigation.navigate("ListProduct", { categorie: this.props.categorieOfNewArrival });
    }
    else if (index == 2) {
      this.props.navigation.navigate("ListProduct", { products: this.state.onSaleProducts, categorie: "" });
    }
    else if (index == 3) {
      this.props.navigation.navigate("ListProduct", { categorie: this.props.categorieOfTopsAndBottom });
    }

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
        this.getProductListWithIds();
      }).catch(error => {
        console.log(error);
      })
  }

  getProductListWithIds() {
    url = PRODUCT_URL + FULL_JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
      .then(res => res.json())
      .then(resJson => {
        products = resJson.products;
        onSaleProducts = [];
        for (var k = 0; k < this.state.specificPrices.length; k++) {
          for (var j = 0; j < products.length; j++) {
            if (products[j].id == this.state.specificPrices[k].id_product) {
              onSaleProducts[k] = products[j];
              onSaleProducts[k].specific_price = this.state.specificPrices[k];
              onSaleProducts[k].reduction_price = (1 - this.state.specificPrices[k].reduction) * onSaleProducts[k].price;
              onSaleProducts[k].reduction = this.state.specificPrices[k].reduction;
              onSaleProducts[k].promo = true;
              onSaleProducts[k].real_price = onSaleProducts[k].reduction_price;
              break;
            }
          }

        }
        for (var k = 0; k < onSaleProducts.length; k++) {
          if (onSaleProducts[k] == undefined) {
            onSaleProducts.splice(k, 1);
          }
        }

        for (var k = 0; k < onSaleProducts.length; k++) {
          if (onSaleProducts[k] == undefined) {
            onSaleProducts.splice(k, 1);
          }
        }
        this.setState({ loading: false, onSaleProducts: onSaleProducts });

      }).catch(error => {
        console.log(error);
      })

  }

  render() {

    const {
      translateY,
      // image,
      // product,
      navigation,
      arrivalThumbImageUrl,
      topsAndBottomsThumbImageUrl
    } = this.props;
    const images = [
      'https://kitandyar.com/modules/posslideshows/images/7d714ad25656f26c4101ee49e1f1131940c99872_banner2.jpg',
      'https://kitandyar.com/modules/posslideshows/images/69058e051cd5a5f45d2781f8823cd91b3083cf6b_slide-for-summersale.jpg',
      'https://kitandyar.com/modules/posslideshows/images/5c8bc6ff66df8e7054f5fc93f49a7a4905766b01_slide-for-summersale04.jpg',
      'https://kitandyar.com/modules/posslideshows/images/0038383b632fb449d4ee5261367c651402e6d348_slide-for-summersale02.jpg',
    ];

    let rightSlideIcon =  isRTL ? LEFT_ICON : RIGHT_ICON;
    let leftSlideIcon =  isRTL ? RIGHT_ICON : LEFT_ICON;

    return (
      <Animated.View style={[
        AppStyles.positionRightLeft,
        styles.headerImage,
        { marginTop: 30 },
        { transform: [{ translateY }] }
      ]} >
        <SafeAreaView style={styles.container}>
          <ImageSlider
            // loopBothSides
            // loop
            autoPlayWithInterval={3000}

            images={images}
            customSlide={({ index, item, style, width }) => (
              // It's important to put style here because it's got offset inside
              <View key={index} style={[style, styles.customSlide]}>
                {/* <Image source={{ uri: item }} style={styles.customImage} /> */}
                <TouchableOpacity   // ---------------------------------------------------------------------- Tops and Bottoms
                  activeOpacity={1}
                  style={{
                    width: Metrics.deviceWidth,
                    height: Metrics.swipeHeightHeader,
                  }}

                  onPress={() => this.onPressSlide(index)}
                >
                  <View style={[styles.slide, { backgroundColor: Colors.white }]}>
                    <ImageBackground
                      resizeMethod={"resize"}
                      resizeMode={'cover'}
                      style={{
                        width: Metrics.deviceWidth,
                        height: Metrics.swipeHeightHeader,
                      }}
                      source={{ uri: item }}
                    >
                    </ImageBackground>
                    {/* {this.renderButtonNext()}
                    {this.renderButtonPrev()} */}
                  </View>
                </TouchableOpacity>
              </View>
            )}
            customButtons={(position, move) => (
              <View>
                {/* <View pointerEvents="box-none" style={[styles.buttonWrapperPrev]}> */}
                <Icon
                  tintColor={Colors.black}
                  styleIcon={styles.buttonWrapperPrev}
                  image={leftSlideIcon}
                  onPress={() => move((position + 3) % 4)}
                />
                {/* </View> */}
                <View style={styles.buttons}>

                  {images.map((image, index) => {
                    return (
                      <TouchableHighlight
                        key={index}
                        underlayColor="#ccc"
                        onPress={() => move(index)}
                        style={styles.button}
                      >
                        {React.cloneElement(<View style={[styles.dot, position === index && styles.activeDot]} />, { index })}
                      </TouchableHighlight>
                    );
                  })}

                </View>
                <Icon
                  tintColor={Colors.black}
                  styleIcon={styles.buttonWrapperNext}
                  image={rightSlideIcon}
                  onPress={() => move((position + 1) % 4)}
                />
              </View>
            )}
          />
        </SafeAreaView>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  headerImage: {
    height: Metrics.swipeHeightHeader,
    backgroundColor: Colors.white
  },
  productName: {
    ...Fonts.style.normal,
    textAlign: "center",
    color: Colors.white,
  },
  productPrice: {
    ...Fonts.style.Bold,
    textAlign: "center",
    color: Colors.white,
  },
  // Slide styles
  slide: {
    flex: 1,                    // Take up all screen
    justifyContent: 'center',   // Center vertically
    alignItems: 'center',
    //marginTop:30       // Center horizontally
  },
  // Header styles
  header: {
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  // Text below header
  text: {
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    fontSize: 18,
    marginHorizontal: 40,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  slider: { backgroundColor: '#000', height: 350 },
  content1: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content2: {
    width: '100%',
    height: 100,
    marginTop: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: { color: '#fff' },
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 3,
    width: 15,
    height: 15,
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    opacity: 1,
    color: 'red',
  },
  customSlide: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customImage: {
    width: 100,
    height: 100,
  },
  buttonWrapperNext: {
    width: 250,
    position: 'absolute',
    top: - Metrics.swipeHeightHeader / 2 - 10,
    alignItems: "center",
    right: -100,
    paddingHorizontal: 10,
    // paddingVertical: 40
  },
  buttonWrapperPrev: {
    width: 250,
    position: 'absolute',
    top: - Metrics.swipeHeightHeader / 2 - 10,
    // left: - Metrics.deviceWidth/2 +100,
    left: -100,
    // paddingHorizontal: 10,
    zIndex: 3
    // paddingVertical:40
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  // Pagination dot
  dot: {
    backgroundColor: 'rgba(255,255,255,.25)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  activeDot: {
    backgroundColor: '#000000',
  },
});