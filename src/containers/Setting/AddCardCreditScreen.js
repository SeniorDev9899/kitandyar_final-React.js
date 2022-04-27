import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import FormInput from '../../components/common/FormInput';
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";
import SelectBox from "../../components/common/SelectBox";
import BackgroundGradient from "../../components/common/BackgroundGradient";

import { Cards } from '../../data/Cards';

export default class AddCardCreditScreen extends PureComponent {

  state = {
    selected: false,
    card: 1,
  }

  changeState(value) {
    this.setState({ selected: value });
  }

  render() {

    const { selected, card } = this.state;

    return (
      <View style={[
        AppStyles.mainContainer,
        { paddingTop: (Platform.OS === 'ios') ? 60 : 0 }
      ]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={"Add New Card Credit"}
          back={true}
        />
        <View style={[
          styles.containerHeader,
          AppStyles.center
        ]}>
        </View>
        <View style={[
          AppStyles.center,
          { flex: 1 }
        ]}>
          <Icon
            width={80}
            tintColor={Colors.black}
            image={require("../../resources/icons/creditCard2.png")}
          />
          <Text style={styles.title}>
            Credit Card Details
          </Text>
        </View>
        <View style={[
          AppStyles.row,
          { marginHorizontal: Metrics.baseMargin }
        ]}>
          {
            Cards.map((item, i) => 
                <BackgroundGradient
                  color={card === item.id ? item.color : Colors.other}
                  styleBackground={[
                    AppStyles.center,
                    {
                      flex: 1,
                      paddingHorizontal: Metrics.baseMargin,
                      borderColor: Colors.transparent,
                      borderWidth: 1,
                      borderRadius: 10,
                    }
                  ]}
                >
                  <Icon
                    width={50}
                    tintColor={Colors.white}
                    image={item.icon}
                    onPress={() => { this.setState({ card: item.id }) }}
                  />
                </BackgroundGradient> 
            )
          }
        </View>
        <View style={styles.containerForm}>
          <FormInput
            placeholder={"Card Number"}
          />
          <FormInput
            placeholder={"Cardholder name"}
          />
          <View style={[AppStyles.row]}>
            <FormInput
              placeholder={"Exp. Month"}
              styleInput={{ width: Metrics.deviceWidth * 0.3 }}
            />
            <FormInput
              placeholder={"Exp. Year"}
              styleInput={{ width: Metrics.deviceWidth * 0.3, marginLeft: Metrics.baseMargin }}
            />
          </View>
          <FormInput
            placeholder={"CVV"}
            styleInput={{ width: Metrics.deviceWidth * 0.2 }}
            secureTextEntry={true}
          />

          <View style={[
            AppStyles.row,
            { marginVertical: Metrics.smallMargin }
          ]}>
            <SelectBox
              selected={selected === true}
              onPress={() => this.changeState(!selected)}
            />
            <Text style={styles.description}>
              Default Card Credit
            </Text> 
          </View> 
        </View>
        <View style={[
          AppStyles.row,
          {
            // width: Metrics.deviceWidth,
            // height: Metrics.navBarHeight,
          }
        ]}>
          <Button
            styleButton={{ flex: 1, backgroundColor: Colors.appColor }}
            text={"Add Card"}
            styleText={{ color: Colors.white }}
            onPress={() => { this.props.navigation.goBack() }}
          />
          <Button
            styleButton={styles.buttonBack}
            styleText={{ color: Colors.black }}
            text={"Cancel"}
            onPress={() => { this.props.navigation.goBack() }}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  containerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    paddingVertical: 30
  },
  containerForm: {
    flex: 2,
    marginHorizontal: Metrics.baseMargin
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black,
    marginTop: Metrics.baseMargin
  },
  buttonBack: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    backgroundColor: Colors.lightBg_gray
  },
  description: {
    ...Fonts.style.medium,
    color: Colors.black,
  },
});
