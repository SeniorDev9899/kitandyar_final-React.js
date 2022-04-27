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
import CategorieItem from "../../components/categorie/CategorieItem";

import { Categories } from '../../data/Categories';
import { ProductsSwiper } from '../../data/ProductsSwiper';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class CategoriesScreen extends PureComponent {

  state = {
    layout: 2,
    ListCategories: Categories,
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

  _renderItem(item) {
    return (<CategorieItem item={item} />)
  }

  render() {

    const {
      layout,
      ListCategories,
      refreshing
    } = this.state;


    let ListImages = ProductsSwiper[0];

    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={"Categories"}
          cart={true}
        />
        <AnimatedFlatList
          contentContainerStyle={styles.container}
          data={ListCategories}
          renderItem={({ item }) => this._renderItem(item)
          }
          onRefresh={() => this._handleRefresh}
          refreshing={refreshing}
          extraData={this.state}
          keyExtractor={(item, i) => i}
        />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Metrics.baseMargin,
    paddingBottom: 0
  }
});
