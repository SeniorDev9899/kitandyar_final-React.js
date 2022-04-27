import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  Text,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import axios from 'axios'

import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
import { PRODUCT_URL, JSON_FORMAT, HOME_URL, HEADER_ENCODED, THUMB_IMAGE_URL, FULL_JSON_FORMAT, API_KEY, IMAGE_WS_KEY } from '../../constants/constants';

class CategorieItemSmall extends PureComponent {

  static propTypes = {
    item: PropTypes.object
  };

  static defaultProps = {
    item: null,
  };

  state = {
    thumbImageUrl : " ",
    thumbProductId : "",
  };

  componentDidMount() {
    this.getThumbOfCategorie(this.props.item);
  };

  getThumbOfCategorie = (item) => {
    item.hasOwnProperty("associations") && (
      item.associations.hasOwnProperty("products") && (
        this.getFirstProductId(item)
      ) 
    )
  };

  getFirstProductId = (item) => {
      id = item.associations.products[0].id,
      this.setState({thumbProductId: id}),
      this.getThumbProductRequest(id)
  };

  getThumbProductRequest = (_thumbProductId) => {
    const url = PRODUCT_URL + _thumbProductId + JSON_FORMAT;

    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
    .then(res => res.json())
    .then(resJson => { 
      _thumbIdDefaultImageId = resJson.product.id_default_image;
      this.getThumbImageRequest(_thumbIdDefaultImageId, _thumbProductId);
      this.setState({
        error: resJson.error || null,
      })

    }).catch(error => {
      console.log(error);
      alert(i18n.t('global.server_connect_failed', { locale: lang } ));
    })

    // await axios.get(url, {headers:{'Authorization': 'Basic ' + HEADER_ENCODED}})
    // .then(json => {
    //   resJson = json.data;
    //   _thumbIdDefaultImageId = resJson.product.id_default_image;
    //   this.getThumbImageRequest(_thumbIdDefaultImageId, _thumbProductId);
    //   this.setState({
    //     error: resJson.error || null,
    //     loading: false,
    //   })
    // })

  };

  getThumbImageRequest = (_thumbIdDefaultImageId, _thumbProductId) => {
    url = THUMB_IMAGE_URL + _thumbProductId + "/" + _thumbIdDefaultImageId + IMAGE_WS_KEY;
    this.setState({thumbImageUrl: url});
  }

  render() {

    const { item } = this.props;
    return (
      <TouchableOpacity
        style={[
          AppStyles.imageView,
          AppStyles.blockRadius,
          AppStyles.center,
          styles.container,
        ]}
        onPress={() => {    console.log("item = ", item); this.props.navigation.navigate("ListProduct", { categorie: item} ) }}
      >
        <ImageBackground
          resizeMode={'contain'}
          resizeMethod={"resize"}
          style={[
            AppStyles.center,
            {
              width: Metrics.deviceWidth * 0.4,
              height: (Metrics.deviceHeight / 7)
            }
          ]}
          source={{ uri: this.state.thumbImageUrl }}
        >
          <View style={[
            AppStyles.center,
            styles.image,
          ]}>
            <Text style={[
              Fonts.style.bold,
              {
                fontSize: Fonts.size.h6,
                color: Colors.white,
                textAlign: 'center',
              }
            ]}
            >
              {item.name[0].value}
            </Text>
            {item.hasOwnProperty("associations") && (
              item.associations.hasOwnProperty("products") && (
                <Text style={[
                  Fonts.style.medium,
                  {
                    color: Colors.white
                  }
                ]}>
                {item.associations.products.length} products
                </Text>
              ))}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(CategorieItemSmall);

const styles = StyleSheet.create({
  container: {
    marginRight: Metrics.smallMargin,
    width: Metrics.deviceWidth * 0.4,
    height: (Metrics.deviceHeight / 7)
  },
  image: { 
    width: Metrics.deviceWidth * 0.4,
    height: (Metrics.deviceHeight / 7),
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  }
});
