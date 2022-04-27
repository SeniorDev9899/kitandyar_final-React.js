import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';

import i18n from '../../helpers/I18n/I18n';

import Icon from '../common/Icon';
import Cart from '../common/Cart';
import {
  AppStyles,
  Colors,
  Fonts,
  Metrics,
  Images
} from '../../themes';
import { withNavigation,Navigation, DrawerActions   } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

var storage = require("react-native-local-storage");
class HeaderBar extends PureComponent {

  static propTypes = {
    hideIcon: PropTypes.bool,
    back: PropTypes.bool,
    title: Image.propTypes.source,
    search: PropTypes.bool,
    goSearch: PropTypes.func,
    grid: PropTypes.bool,
    changeLayout: PropTypes.func,
  };

  static defaultProps = {
    hideIcon: false,
    back: false,
    title: "Kit&Yar",
    search: false,
    goSearch: () => { },
    grid: false,
    changeLayout: () => { }
  };

  state = {
    empty: "",
    cartPrice: 0,
    lang: "",
    isRTL: false,
  }

  componentDidMount() {
    this.setState({loading:true});

    storage.get('lang').then((lang) => {
        if (lang != null) {
          this.setState({lang: lang});
        }
    });
  }


  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  onPressHomeButton(){

    // this.props.navigation.dispatch(NavigationActions.reset({
    //   index: 0,
    //   key: null,
    //   actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
    // }));
    this.props.navigation.popToTop();
  }

  render() {

    const {lang} = this.state;
    isRTL = false;
    if (lang == 'ar') {
      isRTL = true;
    }
    console.log("isRTL in Headers = ", isRTL);
    let backButtonIcon =  isRTL ? RIGHT_ICON : LEFT_ICON;

    const {
      hideIcon,
      back,
      // title,
      search,
      goSearch,
      grid,
      cart,
      changeLayout
    } = this.props;
   //console.log('sadsarrr' + this.props);
    return (
     
      <View style={[
        AppStyles.shadow,
        AppStyles.row,
        AppStyles.spaceBetween,
        AppStyles.overlay,
        styles.container
      ]}>
      <View style={{marginTop:11}} >
          {
            !back & !hideIcon ? (
            <Icon
              width={35}
              image={require('../../resources/icons/homeDrawer.png')}
              tintColor={Colors.black}
              onPress={() => {
                this.props.navigation.navigate("DrawerOpen");
                // this.props.navigation.dispatch(DrawerActions.openDrawer());
                // this.props.navigation.openDrawer();
              }}
            />
            ):(
              <Text style={{color: 'white'}}>1</Text>
            )
            
          }
        </View>
        
        <View style={AppStyles.blockLeft} >
          {
            back &&
            <Icon
              image={backButtonIcon}
              tintColor={Colors.black}
              
              onPress={() => {this.props.navigation.goBack(); }}
            />
          }
        </View>
       
        <View style={[
          { flex: 4 ,paddingRight:Metrics.doubleBasePadding},
          AppStyles.center
        ]}>
        <TouchableOpacity  onPress={() => this.onPressHomeButton()}>
          <Image 
            style={{width: 150, height: 50}}
            source={{uri:'https://kitandyar.com/img/kitandyar-logo-1524313522.jpg'}}
          
          />
        </TouchableOpacity>
        </View>
        <View style={[AppStyles.blockRight,AppStyles.row,{paddingRight:Metrics.doubleBasePadding}]} >
          {
            grid &&
            <Icon
              image={require('../../resources/icons/gridStyle.png')}
              tintColor={Colors.dark_gray}
              onPress={changeLayout}
            />
          }

          {
            cart &&
            <Cart
              numbre={this.props.quantity}
              currency={this.props.currency}
              total={this.props.cartPrice}
              // color={Colors.white}
              onPress={() => { this.props.navigation.navigate("Cart") }}
            />
          }
          {
            search &&
            <Icon
              image={require('../../resources/icons/search.png')}
              width={35}
              tintColor={Colors.appColor}
              onPress={goSearch}
              styleIcon={{paddingRight:(Platform.OS === 'ios') ? Metrics.doubleBasePadding: Metrics.basepadding}}
            />
          }
        </View>
      </View>
    );
  }
}

export default withNavigation(HeaderBar);

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    height: Metrics.navBarHeight,
    width: Metrics.deviceWidth,
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.smallMargin
  },
  text: {
    ...Fonts.style.normal,
    color: Colors.black
  },
});