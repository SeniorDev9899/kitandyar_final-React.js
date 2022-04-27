import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

import { Onboarding } from '../../data/Onboarding';
const entryBorderRadius = 8;

export default class SliderEntry extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    itemWidth: PropTypes.number,
    slideHeight: PropTypes.number,
    itemHorizontalMargin: PropTypes.number
  };

  get image() {
    const { data: { illustration }, parallax, parallaxProps, even } = this.props;

    return parallax ? (
      <ParallaxImage
        source={illustration}
        containerStyle={[stylesSlide.imageContainer, even ? stylesSlide.imageContainerEven : {}]}
        style={stylesSlide.image}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
        <Image
          source={illustration}
          style={stylesSlide.image}
        />
      );
  }
 
  render() {
    const { data: { title, subtitle }, index, even, itemWidth, slideHeight, itemHorizontalMargin } = this.props;

    let length = Onboarding.length;
    arrayMap = new Array(length + 1);
    for (var i = 1; i < arrayMap.length; i++) {
      arrayMap[i] = i;
    }

    const uppercaseTitle = title ? (
      <Text
        style={[stylesSlide.title, even ? stylesSlide.titleEven : {}]}
        numberOfLines={2}
      >
        {title.toUpperCase()}
      </Text>
    ) : false;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          stylesSlide.slideInnerContainer,
          {
            width: itemWidth,
            height: slideHeight,
            paddingHorizontal: itemHorizontalMargin
          }
        ]}
        // onPress={}
      >
        {
          <View style={[
            AppStyles.row,
            AppStyles.center,
            { height: 40 }
          ]}>
            {
              arrayMap.map((item, i) => {
                return (
                  <View style={[
                    AppStyles.row,
                    {
                      justifyContent: "center",
                      alignItems: "flex-end",
                      paddingBottom: Metrics.baseMargin
                    }
                  ]}>
                    {(item === index - 1) && (index - 1 === length) &&
                      <Image
                        resizeMode={'contain'}
                        style={stylesSlide.icon}
                        source={require("../../resources/icons/bar.png")}
                      />
                    }
                    <Text style={item != index - 1 ? stylesSlide.numberDisable : stylesSlide.number}>{item} </Text>
                    {(item === index - 1) && (index - 1 != length) &&
                      <Image
                        resizeMode={'contain'}
                        style={stylesSlide.icon}
                        source={require("../../resources/icons/bar.png")}
                      />
                    }
                  </View>
                )
              })
            }
          </View>
        }
        <View style={[stylesSlide.imageContainer, even ? stylesSlide.imageContainerEven : stylesSlide.imageContainerEven]}>
          {this.image}
        </View>
        {
          <View style={[
            AppStyles.center,
            { marginTop: 20 }
          ]}>
            {
              //uppercaseTitle
            }
            <Text
              style={stylesSlide.title}
              numberOfLines={2}
            >
              {title.toUpperCase()}
            </Text>
            <Text
              style={stylesSlide.subtitle}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          </View>
        }
      </TouchableOpacity>
    );
  }
}

const stylesSlide = StyleSheet.create({
  slideInnerContainer: {
    paddingBottom: 18, // needed for shadow 
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: entryBorderRadius,
  },
  imageContainerEven: {
    backgroundColor: 'white',
    borderRadius: entryBorderRadius
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
    borderRadius: entryBorderRadius,
  },
  // image's border radius is buggy on ios; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white'
  },
  radiusMaskEven: {
    backgroundColor: Colors.black
  },
  titleEven: {
    color: 'black'
  },


  number: {
    ...Fonts.style.large,
    fontFamily: Fonts.type.Bold,
    color: Colors.appColor,
    marginHorizontal: Metrics.baseMargin
  },
  numberDisable: {
    ...Fonts.style.medium,
    fontFamily: Fonts.type.Bold,
    color: Colors.dark_gray,
    marginHorizontal: Metrics.baseMargin
  },
  nextNumber: {
    ...Fonts.style.large,
    fontFamily: Fonts.type.Bold,
    color: Colors.dark_gray,
  },
  title: {
    ...Fonts.style.normal,
    fontFamily: Fonts.type.Bold,
    color: Colors.appColor,
    textAlign: "center"
  },
  subtitle: {
    ...Fonts.style.normal,
    color: Colors.dark_gray,
    textAlign: "center",
    marginTop: Metrics.baseMargin
  },
  subtitleEven: {
    color: 'rgba(0, 0, 0, 0.7)'
  },
  icon: {
    width: 30,
    tintColor: Colors.appColor,
    marginTop: 10
  }
});



