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
  Image
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import BackgroundGradient from "../../components/common/BackgroundGradient";
import Button from "../../components/common/Button";
import ProductItem from "../../components/Product/ProductItem";
import ProductListItem from "../../components/Product/ProductListItem";
import HeaderWithAnimatedImage from "../../components/Header/HeaderWithAnimatedImage";
import SwitchLayout from '../../components/modal/SwitchLayout';

import { ProductsGift } from '../../data/ProductsGift';
import { SubCategories } from '../../data/SubCategories';
import { ProductsSwiper } from '../../data/ProductsSwiper';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class GiftsScreen extends PureComponent {

  state = {
    layout: 4,
    ListProducts: ProductsGift,
    animatedValue: new Animated.Value(0),
    modalVisible: false,
    loading: false,
    refreshing: false,
  };

  componentWillMount() {
    this._makeRemoteRequest();
  }

  _makeRemoteRequest = () => {
    //this.setState({ loading: true });
    //alert(JSON.stringify(ApiShop.getProducts))
    // this.setState({ ListProducts: ApiProduct }); 
  };

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
    this.setState({ nameCategorie: item.name });
    this._closeModal();
  }

  _renderItem(item) {
    let layout = this.state.layout;
    if (layout === 4)
      return (<ProductListItem product={item} layout={layout} gifts={true} />)
    else
      return (<ProductItem product={item} layout={layout} />)
  }

  render() {

    const {
      layout,
      ListProducts,
      animatedValue,
      modalVisible,
      refreshing
    } = this.state;

    let translateY = this.state.animatedValue.interpolate({
      inputRange: [0, 700],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });

    let ListImages = ProductsSwiper[0];

    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={"My Wishlist"}
          cart={true}
        />
        <AnimatedFlatList
          contentContainerStyle={[
            {
              marginTop: 50,
              paddingBottom: 50
            },
            layout === 4 ? {} : styles.wrap
          ]}
          data={ListProducts}
          renderItem={({ item }) => this._renderItem(item)
          }
          onRefresh={() => this._handleRefresh}
          refreshing={refreshing}
          extraData={this.state}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.animatedValue } } }],
            { useNativeDriver: true }
          )}
          keyExtractor={(item, i) => i}
        />
        {
          <Animated.View style={[
            styles.headerWrapper,
            AppStyles.row,
            AppStyles.spaceBetween,
            { transform: [{ translateY }] }
          ]}
          >
            <Text style={styles.title}>Your wishlist</Text>
            <Text style={styles.description}>6 Products</Text>
          </Animated.View>
        }
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
    top: (Platform.OS === 'ios') ? 60 : 40,
    left: 0,
    right: 0,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray,
    paddingTop: (Platform.OS === 'ios') ? 20 : 15,
    paddingHorizontal: Metrics.baseMargin 
  },
  filter: {
    marginTop: 5,
    width: Metrics.deviceWidth / 2
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
  description: {
    ...Fonts.style.bold,
    color: Colors.black
  }
});
