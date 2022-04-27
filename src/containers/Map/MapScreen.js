import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform
} from "react-native";

import MapView from "react-native-maps";

import { Markers } from "../../data/Markers";
import styles from "./styles";

import Marker from "../../components/map/Marker";
import Card from "../../components/map/Card";
import Icon from "../../components/common/Icon";
import ModalFilterStore from '../../components/filter/ModalFilterStore';
import HeaderBar from "../../components/Header/HeaderBar";

import { AppStyles, Colors, Metrics } from "../../themes/index";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = width - 50;

export default class MapScreen extends Component {
  state = {
    openIndex: null,
    render: false,
    show: false,
    overlayImage: false,
    coords: {
      left: new Animated.Value(0),
      top: new Animated.Value(0),
      width: new Animated.Value(0),
      height: new Animated.Value(0),
    },
    transition: {},
    markers: Markers,
    region: {
      latitude: 45.52220671242907,
      longitude: -122.6653281029795,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
    modalVisible: false
  };

  componentWillMount() {
    this.index = 0;
    this.images = {};
    this.animation = new Animated.Value(0);
    this.opacityAnimation = new Animated.Value(0);
  }

  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  handleClose = () => {
    const { openIndex: index } = this.state;

    this.tImage.measure(
      (tframeX, tframeY, tframeWidth, tframeHeight, tpageX, tpageY) => {
        this.state.coords.top.setValue(tpageY);
        this.state.coords.left.setValue(tpageX);
        this.state.coords.width.setValue(tframeWidth);
        this.state.coords.height.setValue(tframeHeight);
        Animated.timing(this.opacityAnimation, {
          toValue: 0,
          duration: 100, // THIS SHOULD BE INTERPOLATION FROM X AND Y!
        }).start();

        this.setState(
          {
            overlayImage: true,
          },
          () => {
            this.images[
              index
            ].measure(
              (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                Animated.parallel([
                  Animated.timing(this.state.coords.top, {
                    toValue: pageY,
                    duration: 250,
                  }),
                  Animated.timing(this.state.coords.left, {
                    toValue: pageX,
                    duration: 250,
                  }),
                  Animated.timing(this.state.coords.width, {
                    toValue: frameWidth,
                    duration: 250,
                  }),
                  Animated.timing(this.state.coords.height, {
                    toValue: frameHeight,
                    duration: 250,
                  }),
                ]).start(() => {
                  this.setState({
                    overlayImage: false,
                    render: false,
                    openIndex: null,
                  });
                });
              }
              );
          }
        );
      }
    );
  };

  handleShow = index => {
    this.setState(
      {
        openIndex: index,
        render: true,
        transition: this.state.markers[index],
      },
      () => {
        this.images[
          index
        ].measure((frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
          this.state.coords.top.setValue(pageY);
          this.state.coords.left.setValue(pageX);
          this.state.coords.width.setValue(frameWidth);
          this.state.coords.height.setValue(frameHeight);
          this.setState(
            {
              overlayImage: true,
            },
            () => {
              this.tImage.measure(
                (
                  tframeX,
                  tframeY,
                  tframeWidth,
                  tframeHeight,
                  tpageX,
                  tpageY
                ) => {
                  Animated.parallel([
                    Animated.timing(this.state.coords.top, {
                      toValue: tpageY,
                      duration: 250,
                    }),
                    Animated.timing(this.state.coords.left, {
                      toValue: tpageX,
                      duration: 250,
                    }),
                    Animated.timing(this.state.coords.width, {
                      toValue: tframeWidth,
                      duration: 250,
                    }),
                    Animated.timing(this.state.coords.height, {
                      toValue: tframeHeight,
                      duration: 250,
                    }),
                  ]).start(() => {
                    this.opacityAnimation.setValue(1);
                    this.setState({
                      overlayImage: false,
                    });

                  });
                }
              );
            }
          );
        });
      }
    );
  };

  openModal = () => {
    this.setState({ modalVisible: true });
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH + 1,
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    const { transition, coords, render, region, markers, modalVisible } = this.state;

    return (
      <View style={styles.container}>
        <HeaderBar
          title={"Store Locator"}
          back={true}
          cart={true}
        />
        <MapView
          ref={map => this.map = map}
          initialRegion={region}
          style={styles.container}
        >
          {markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker
                key={index}
                coordinate={marker.coordinate}
              >
                <Marker
                  image={marker.image}
                  color={"red"}
                />
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {markers.map((marker, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this.handleShow(index)}
            >
              <Card
                index={index}
                images={this.images}
                marker={marker}
              />
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
        {this.state.overlayImage &&
          <Animated.Image
            resizeMode="cover"
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              height: coords.height,
            }}
            source={{ uri: transition.image }}
          />}
        {render &&
          <Animated.View
            style={[
              styles.transitionContainer,
              StyleSheet.absoluteFill,
              {
                opacity: this.opacityAnimation,
                paddingTop: 60
              },
            ]}
          >
            <Icon
              width={35}
              image={require('../../resources/icons/cancel.png')}
              tintColor={Colors.black}
              styleIcon={{ marginTop: Platform.OS === 'ios' ? 100 : 60 }}
              onPress={this.handleClose}
            />
            <Image
              source={{ uri: transition.image }}
              style={styles.transitionImage}
              ref={tImage => this.tImage = tImage}
              resizeMode="contain"
            />
            <View style={{ flex: 3 }}>
              <Text>{transition.title}</Text>
              <Text>{transition.description}</Text>
            </View>
          </Animated.View>
        }
        <Icon
          width={45}
          backgroundColor={Colors.white}
          borderRadius={true}
          tintColor={Colors.black}
          image={require("../../resources/icons/control.png")}
          styleIcon={[style.filter, AppStyles.shadow]}
          onPress={() => this.openModal()}
        />
        <ModalFilterStore
          visible={modalVisible}
          onCancel={this.closeModal}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  filter: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 70 : 60,
    right: 0,
    margin: Metrics.baseMargin
  },
})
