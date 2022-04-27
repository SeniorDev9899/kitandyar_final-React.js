import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import CarouselView from "../../components/onboarding/CarouselView";
import Button from "../../components/common/Button";
import { Onboarding } from '../../data/Onboarding';

export default class OnboardingScreen extends PureComponent {

  render() {
    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <CarouselView
          items={Onboarding}
        />

        <View style={[
          {
            width: Metrics.deviceWidth,
            height: Metrics.navBarHeight,
          }
        ]}>
          <Button
            iconRight={require("../../resources/icons/right-arrow.png")}
            colorIcon={Colors.white}
            styleButton={{
              backgroundColor: Colors.appColor,
              borderRadius: Metrics.borderRadius,
              marginHorizontal: Metrics.baseMargin
            }}
            styleText={{ color: Colors.white }}
            text={"Shop Now"}
            onPress={() => { this.props.navigation.navigate("Home") }}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
});
