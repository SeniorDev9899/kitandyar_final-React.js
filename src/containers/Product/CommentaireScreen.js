import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import CommentaireItem from "../../components/commentaire/CommentaireItem";
import Button from "../../components/common/Button";
import RatingReview from "../../components/common/RatingReview";

import { Commentaires } from '../../data/Commentaires';

export default class CommentaireScreen extends PureComponent {

  render() {

    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={"All Commenters"}
          back={true}
        />
        <View style={{ height: 200 }}>
          <Text style={styles.rate}>
            Rating & Review
          </Text>
          <View style={{ flex: 1 }}>
            <RatingReview />
          </View>
        </View>
        <ScrollView style={styles.container} >
          <FlatList
            style={{
              marginTop: Metrics.baseMargin,
              backgroundColor: Colors.transparent
            }}
            data={Commentaires}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => <CommentaireItem
              item={item}
            />
            }
            keyExtractor={(item, i) => i}
          />
        </ScrollView>

        <View style={[
          AppStyles.row,
          {
            width: Metrics.deviceWidth,
            height: Metrics.navBarHeight,
          }
        ]}>
          <Button
            styleButton={{ flex: 1, backgroundColor: Colors.appColor }}
            text={"Rate & Write a Review"}
            styleText={{ color: Colors.white }}
            onPress={() => { this.props.navigation.navigate("AddCommenter") }}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    paddingHorizontal: Metrics.baseMargin
  },
  rate: {
    ...Fonts.style.normal,
    ...Fonts.style.bold,
    color: Colors.black,
    margin: Metrics.baseMargin
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
