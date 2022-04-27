import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import { AppStyles, Colors, Fonts, Metrics } from '../../themes';

class Profile extends PureComponent {

  static propTypes = {
    name: PropTypes.any,
    image: PropTypes.any,
    source: PropTypes.any,
    onPress: PropTypes.func,
    border: PropTypes.number,
    width: PropTypes.number,
    color: PropTypes.string,
    camera: PropTypes.bool,
    gallery: PropTypes.bool,
  };

  static defaultProps = {
    border: 1,
    name: "",
    image: null,
    source: require('../../resources/icons/imageProfile.png'),
    width: 100,
    color: Colors.white,
    onPress: () => { },
    camera: false,
    gallery: false
  };

  render() {

    const {
      name,
      image,
      source,
      onPress,
      border,
      color,
      width,
      camera,
      gallery
    } = this.props;

    return (
      <View>
        <TouchableOpacity
          style={AppStyles.center}
          onPress={onPress}
        >
          {
            image !== null ?
              <Image
                style={{
                  width: width,
                  height: width,
                  borderRadius: width / 2,
                  borderColor: color,
                  borderWidth: border
                }}
                source={{ uri: image }}
              />
              :
              <Image
                style={{
                  width: width,
                  height: width,
                  borderRadius: width / 2,
                  borderColor: color,
                  borderWidth: border 
                }}
                source={source}
              />
          }
        </TouchableOpacity>
        {
          camera &&
          <TouchableOpacity
            style={[
              AppStyles.center,
              styles.cCamera
            ]}
            onPress={() => { alert("Take Photo.") }}
          >
            <Image
              resizeMode={"cover"}
              style={styles.icon}
              source={require('../../resources/icons/camera.png')}
            />
          </TouchableOpacity>
        }
        {
          gallery &&
          <TouchableOpacity
            style={[
              AppStyles.center,
              styles.cGallery
            ]}
            onPress={() => { alert("Open Gallery") }}
          >
            <Image
              resizeMode={"cover"}
              style={styles.icon}
              source={require('../../resources/icons/image-gallery.png')}
            />
          </TouchableOpacity>
        }
        {
          name !== "" &&
          <Text style={[styles.text, { color: color }]}>
            {name}
          </Text>
        }
      </View>
    );
  }
}
export default (Profile);

const styles = StyleSheet.create({
  text: {
    ...Fonts.style.bold,
    marginTop: Metrics.baseMargin,
    textAlign: "center"
  },
  cCamera: {
    backgroundColor: Colors.white,
    position: "absolute",
    zIndex: 1,
    top: 1,
    left: 1,
    width: 25,
    height: 25,
    borderRadius: 25/2,
  },
  cGallery: {
    backgroundColor: Colors.white,
    position: "absolute",
    zIndex: 1,
    bottom: 22,
    right: 1,
    width: 25,
    height: 25,
    borderRadius: 25/2,
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: Colors.appColor
  }
})