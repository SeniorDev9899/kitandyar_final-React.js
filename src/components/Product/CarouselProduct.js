import React, { Component } from 'react';
import { View, ScrollView, Text, StatusBar, Dimensions, StyleSheet, TouchableHighlight, Image } from 'react-native';
import PropTypes from 'prop-types';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderProduct from './SliderProduct';

import { Colors, Metrics } from "../../themes";
import { wp } from '../../helpers/function';

const SLIDER_1_FIRST_ITEM = 1;


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const slideHeight = viewportHeight * 0.5;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
var imageurls = [];

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;


export default class CarouselProduct extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      slider1Ref: null
    };
  }

  static propTypes = {
    items: PropTypes.any,
  };

  static defaultProps = {
    items: [],
  };

 componentDidMount(){
  //  console.log("abcdefg");
  // imageurls  = this.props.items;
  console.log("mount_urls",imageurls);
 }
  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      <SliderProduct
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
        itemWidth={itemWidth}
        slideHeight={slideHeight}
        index={index}
        imageurls = {imageurls}
      />
    );
  }

  render() {

    //const { slider1ActiveSlide, slider1Ref } = this.state;
    const { items } = this.props;
    imageurls  = this.props.items;
    console.log("items",imageurls);
    return (
      <View style={{ marginBottom: 0}}>
        <Carousel
          ref={(c) => { if (!this.state.slider1Ref) { this.setState({ slider1Ref: c }); } }}
          data={items}
          renderItem={this._renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          enableMomentum={false}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          loopClonesPerSide={2}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={4000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        /> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  },  
  slider: {
    marginTop: 25
  },
  sliderContentContainer: {
  },
  paginationContainer: {
    paddingVertical: 5
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: Colors.appColor,
  }
})