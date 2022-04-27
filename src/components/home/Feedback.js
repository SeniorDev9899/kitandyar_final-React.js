import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  ImageBackground,
  Text,
  Dimensions
} from 'react-native';
import StarRating from 'react-native-star-rating';

import Swiper from '../common/Swiper';
import BackgroundGradient from "../common/BackgroundGradient";
import Profile from "../common/Profile";
import {
  AppStyles,
  Colors,
  Fonts,
  Metrics,
  Images
} from '../../themes';

export default class Feedback extends PureComponent {

  static propTypes = {
    feedback: PropTypes.any
  };

  static defaultProps = {
    feedback: null
  };

  render() {

    const { feedback } = this.props;

    return (
      <Animated.View style={[
        styles.container,
      ]}
      >
        <Text style={styles.title}>
          Client Say
        </Text>
        <Swiper >
          {
            feedback.map((item, key) =>
              <View style={[styles.slide]}>
                <ImageBackground
                  resizeMode={'cover'}
                  style={[
                    {
                      width: Metrics.deviceWidth,
                      height: Metrics.deviceHeight/2.7,
                    }
                  ]}
                  source={require("../../resources/users/Feedback.jpg")}
                >
                  <BackgroundGradient
                    color={Colors.gradientBlackColor}
                    styleBackground={[
                      AppStyles.center,
                      {
                        flex: 1,
                        padding: Metrics.baseMargin,
                        zIndex: 1
                      }
                    ]}
                  >
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50 / 2,
                        borderColor: Colors.black,
                        borderWidth: 1
                      }}
                      source={item.image}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.message}>"{item.message}"  </Text>
                    <Text style={styles.name}>{item.date}  </Text>
                    <View style={{ width: Metrics.deviceWidth / 3, marginVertical: Metrics.baseMargin }}>
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={item.rating}
                        starColor={'#eae678'}
                        starSize={15}
                      />
                    </View>
                  </BackgroundGradient>
                </ImageBackground>
              </View>
            )
          }
        </Swiper>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Metrics.smallMargin,
    height: Metrics.deviceHeight/2.7,
    backgroundColor: Colors.white
  },
  name: {
    ...Fonts.style.small,
    textAlign: "center",
    color: Colors.black,
  },
  message: {
    ...Fonts.style.Bold,
    fontSize: 16,
    textAlign: "center",
    color: Colors.black,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Fonts.style.h4,
    ...Fonts.style.bold,
    color: Colors.black, 
    marginLeft: Metrics.smallMargin,
    marginVertical: Metrics.baseMargin
  },
});