import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Image
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";

import { NavigationActions } from 'react-navigation';

import Config from '../../config';
const labels = ["Cart", "Delivery", "Payment", "Order"];

export default class ThankScreen extends PureComponent {

  state = {
    currentPosition: 3 
  };
 
  _renderItem(item) {
    return (<CartItem product={item} />)
  }

  render() {

    const {
      currentPosition  
    } = this.state;

    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={"Order"} 
        />
        <View style={styles.container}>
          <StepIndicator
            customStyles={Config.StepIndicator}
            stepCount={4}
            currentPosition={currentPosition}
            labels={labels}
          />
          <View style={[
            AppStyles.center,
            { flex: 1 }
          ]}>
            <Icon
              width={80}
              borderRadius={true}
              image={require('../../resources/icons/tick.png')}
              tintColor={Colors.appColor}
            />
            <Text style={styles.title}>Thank you </Text>
            <View style={[
              AppStyles.row,
              { alignItems: "center" }
            ]}>
              <Text style={styles.subTitle}>You order code is  </Text>
              <Text style={styles.number}>#KS2018 </Text>
            </View>
            <Text style={styles.subTitle}>successful, </Text>
            <Text style={styles.subTitle}>please go to order</Text>
            <Text style={styles.subTitle}>page to manage status</Text>
          </View>
        </View>
        <View style={{
          width: Metrics.deviceWidth,
          height: Metrics.navBarHeight,
        }}>
          <Button
            iconRight={require("../../resources/icons/right-arrow.png")}
            colorIcon={Colors.white}
            styleButton={{ backgroundColor: Colors.appColor }}
            styleText={{ color: Colors.white }}
            text={"Go home"}

            // onPress={() => { this.props.navigation.navigate("Home") }}
            
            // reset navigation stack
            onPress={() => {this.props.navigation.dispatch(NavigationActions.reset({
              index: 0,
              key: null,
              actions: [NavigationActions.navigate({ routeName: 'Home' })]
            }))}}
            //
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Metrics.baseMargin,
    marginTop: (Platform.OS === 'ios') ? 30 : Metrics.doubleBaseMargin
  },
  title: {
    fontFamily: Fonts.type.Bold,
    fontSize: 16,
    color: Colors.black,
    marginTop: 50
  },
  subTitle: {
    ...Fonts.style.small,
    color: Colors.dark_gray,
    marginTop: Metrics.smallMargin
  },
  number: {
    ...Fonts.style.large,
    ...Fonts.style.bold,
    color: Colors.black,
    marginTop: Metrics.smallMargin
  }
});
