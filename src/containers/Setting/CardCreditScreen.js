import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import CardItem from "../../components/card/CardItem";
import Icon from "../../components/common/Icon";

// import { Cards } from '../../data/Cards';

export default class CardCreditScreen extends PureComponent {
  state = {
    Cards : []
  }
  render() {

    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={"My Card Credit"}
          back={true}
        />

        <View style={styles.container}>
          {this.state.Cards != [] &&
            <FlatList
              style={{
                marginTop: Metrics.baseMargin,
                backgroundColor: Colors.transparent,
                paddingHorizontal: Metrics.baseMargin
              }}
              data={this.state.Cards}
              keyExtractor={this._keyExtractor}
              renderItem={({ item }) => <CardItem
                item={item}
                selected={true}
              />
              }
              keyExtractor={(item, i) => i}
            />
          }
          <View
            style={[AppStyles.center, { marginBottom: Metrics.baseMargin }]}
          >
            <Icon
              width={40}
              tintColor={Colors.black}
              image={require("../../resources/icons/addQuantity.png")}
              onPress={() => { this.props.navigation.navigate("AddCardCredit") }}
            />
            <Text style={styles.title}>
              ADD NEW CARD CREDIT
            </Text>
            <Text style={styles.description}>
              Please complete the information of the credit
            </Text>
            <Text style={styles.description}>
              card newly added.
            </Text>
          </View>
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: (Platform.OS === 'ios') ? 60 : 0
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
  description: {
    ...Fonts.style.bold,
    color: Colors.light_gray
  },
});
