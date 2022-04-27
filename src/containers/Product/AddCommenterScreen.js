import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  Image
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import FormInput from '../../components/common/FormInput';
import Button from "../../components/common/Button";
import StarRating from 'react-native-star-rating';

export default class AddCommenterScreen extends PureComponent {

  state = {
    rating: 0
  }

  onStarRatingPress(rating) {
    this.setState({
      rating: rating
    });
  }

  render() {

    const { rating } = this.state;

    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={"Write a review"}
          back={true}
        />
        <View style={styles.containerForm}>
          <Text style={styles.rate}>
            Comment about this product
          </Text>
          <View style={{ width: Metrics.deviceWidth / 4 }}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={rating}
              starColor={'#eae678'}
              starSize={20}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
            />
          </View>
          <FormInput
            placeholder={"Your comments ..."}
          />
        </View>
        <View style={[
          AppStyles.row,
          {
            width: Metrics.deviceWidth,
            height: Metrics.navBarHeight,
          }
        ]}>
          <Button
            styleButton={{ flex: 1, backgroundColor: Colors.appColor }}
            text={"Add comment"}
            styleText={{ color: Colors.white }}
            onPress={() => { this.props.navigation.navigate("Commentaire") }}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  containerForm: {
    flex: 1,
    marginHorizontal: Metrics.baseMargin
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
  rate: {
    ...Fonts.style.normal,
    ...Fonts.style.bold,
    color: Colors.black,
    marginVertical: Metrics.baseMargin
  },
});
