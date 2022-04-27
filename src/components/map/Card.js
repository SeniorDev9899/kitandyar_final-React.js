import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';

import {
  AppStyles,
  Metrics,
  Images,
  Fonts,
  Colors
} from '../../themes';
import Open from "./Open";
import Profile from "../common/Profile";
import Ratings from "../common/Ratings";
import Cost from "../common/Cost";
import Distance from "./Distance";

import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = width - 50;

export default class Card extends PureComponent {

  static propTypes = {
    index: PropTypes.number,
    marker: PropTypes.any,
    images: PropTypes.any
  };

  static defaultProps = {
    index: 0,
    marker: null,
    images: []
  };

  render() {

    const {
      index,
      marker,
      images
    } = this.props;

    return (
      <View style={[
        AppStyles.shadow,
        styles.container
      ]}>

        <View style={[
          AppStyles.row,
          { flex: 1 }
        ]}>
          <View
            style={[
              AppStyles.center,
              { width: 80, height: 80 }
            ]}
          >
            <Image
              source={{ uri: marker.image }}
              style={[
                AppStyles.center,
                {
                  borderWidth: 1,
                  width: 60,
                  height: 60,
                  borderRadius: 60 / 2,
                  marginBottom: 8,
                  borderColor: "#3a3a3a"
                }
              ]}
              resizeMode={"cover"}
              ref={img => images[index] = img}
            />
          </View>

          <View style={styles.textContent}>
            <View style={[
              AppStyles.row,
              AppStyles.spaceBetween,
              { alignItems: "center" }
            ]}>
              <Text numberOfLines={2} style={styles.title}>{marker.title}</Text>
              <Open open={marker.open} />
            </View>
            <Text numberOfLines={2} style={styles.description}>
              {marker.description}
            </Text>
          </View>
        </View>
        <View style={[
          AppStyles.row,
          styles.bottomContent
        ]}>
          <Ratings value={marker.rating} />
          <Cost value={marker.cost} />
          <Distance value={"7"} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    borderRadius: 10,
    marginBottom: 20
  },
  textContent: {
    width: CARD_WIDTH - 100,
    margin: Metrics.smallMargin
  },
  noteContent: {
    marginTop: 20
  },
  bottomContent: {
    flex: 1,
    marginTop: Metrics.baseMargin,
    marginHorizontal: Metrics.baseMargin,
    paddingTop: Metrics.baseMargin,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2"
  },
  image: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#444",
  },
})
