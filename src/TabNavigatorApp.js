import {
    Image,
    StyleSheet
  } from 'react-native';
  import React from "react";
  
  import {
    TabNavigator
  } from 'react-navigation';
  
  import SignInScreen from "./containers/Authentication/SignInScreen";
  import ListProductScreen from "./containers/Product/ListProductScreen";
  import CartScreen from "./containers/Cart/CartScreen";
  import MyStackNavigator from "./MyStackNavigator_En";
  
  export default TabNavigatorAPP = TabNavigator({
    Home: {
      screen: MyStackNavigator,
      navigationOptions: {
        header: null,
        tabBarIcon: ({ tintColor }) => (
          <Image
            resizeMode='contain'
            source={require('./resources/icons/home.png')}
            style={[styles.icon, { tintColor: tintColor }]}
          />
        ),
      },
    },
    Category: {
      screen: ListProductScreen,
      navigationOptions: {
        header: null,
        tabBarIcon: ({ tintColor }) => (
          <Image
            resizeMode='contain'
            source={require('./resources/icons/category.png')}
            style={[styles.icon, { tintColor: tintColor }]}
          />
        ),
      },
    },
    MyCart: {
      screen: CartScreen,
      navigationOptions: {
        header: null,
        tabBarIcon: ({ tintColor }) => (
          <Image
            resizeMode='contain'
            source={require('./resources/icons/shopping-cart.png')}
            style={[styles.icon, { tintColor: tintColor }]}
          />
        ),
      },
    },
    Logout: {
      screen: SignInScreen,
      navigationOptions: {
        header: null,
        tabBarIcon: ({ tintColor }) => (
          <Image
            resizeMode='contain'
            source={require('./resources/icons/logout.png')}
            style={[styles.icon, { tintColor: tintColor }]}
          />
        ),
      },
    }
  }, {
      tabBarPosition: 'bottom',
      tabBarOptions: {
        showIcon: true,
        animationEnabled: false,
        showLabel: true,
        activeTintColor: "#000000",  
        inactiveTintColor: '#555555',
        labelStyle: {
          fontSize: 10,
          color: '#000000',
        },
        style: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#d6d6d6',
          borderBottomWidth: 2,
          borderBottomColor: '#000000',  
          height: 60,
        },
        indicatorStyle: {
          backgroundColor: '#000000'  
        },
      },
      navigationOptions: ({ navigation }) => {
          const { routeName } = navigation.state;
          if (routeName === 'Category') {
            console.log("category tab");
            //this.props.navigation.navigate("ListProduct");
          } else if (routeName === 'Logout') {
            var storage = require("react-native-local-storage");
            storage.save('customer_id', null);
            storage.save('cart_id', null);
            storage.save('cart_price', null);
            storage.save('cart', null);
            storage.save('addresses', null);
            storage.save('guest', null);
            storage.save('guest_id', null);
            storage.save('email', null);
            storage.save('customer_firstname', null);
            storage.save('customer_lastname', null);
            storage.save('country_id', null);
            storage.save('shipping', null);
            storage.save('delivery_address', null);
            storage.save('invoice_address', null);
            storage.save('billingaddress_show', false);
            storage.save('tax_rate', null);
            storage.save('cart_rule',null);
          }
      }
    });
  
  var styles = StyleSheet.create({
    icon: {
      width: 20,
      height: 20,
    },
  });
  