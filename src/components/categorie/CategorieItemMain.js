import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground
} from 'react-native';
import { withNavigation } from 'react-navigation';
import axios from 'axios'

import Icon from "../common/Icon";
import ProductColors from "../Product/ProductColors";
import Promo from "../Product/Promo";

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import { PRODUCT_URL, JSON_FORMAT, HEADER_ENCODED, IMAGE_WS_KEY, THUMB_IMAGE_URL } from '../../constants/constants';

class CategorieItemMain extends PureComponent {

    static propTypes = {
        item: PropTypes.object
    };

    static defaultProps = {
        item: null,
    };

    state = {
        selected: false,
        thumbImageUrl : " ",
        thumbProductId : "",
    }

    renderWidth = (layout) => {
        if (layout === 1)
        return (Metrics.deviceWidth - Metrics.baseMargin)
        if (layout === 2)
        return (Metrics.deviceWidth - Metrics.baseMargin * 2) / 2
        else if (layout === 3)
        return (Metrics.deviceWidth - Metrics.baseMargin * 3) / 3
        else if (layout === 4)
        return (Metrics.deviceWidth - 40 - Metrics.baseMargin * 2) / 2
        else
        return null
    }

    renderHeight = (layout) => {
        if (layout === 1)
        return (Metrics.deviceWidth + 20)
        if (layout === 2)
        return (Metrics.deviceHeight * 0.45)
        else if (layout === 3)
        return (Metrics.deviceHeight * 0.45)
        if (layout === 4)
        return (Metrics.deviceHeight * 0.35)
        else
        return null
    }
    
    changeState = (value) => {
        this.setState({ selected: value });
    }
    
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
        this.setState({thumbProductId: id})
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
        //     resJson = json.data;
        //     _thumbIdDefaultImageId = resJson.product.id_default_image;
        //     this.getThumbImageRequest(_thumbIdDefaultImageId, _thumbProductId);
        //     this.setState({
        //         error: resJson.error || null,
        //         loading: false,
        //     })
        // })
       
    };

    getThumbImageRequest = (_thumbIdDefaultImageId, _thumbProductId) => {
        url = THUMB_IMAGE_URL + _thumbProductId + "/" + _thumbIdDefaultImageId + IMAGE_WS_KEY;
        // this.setState({thumbImageUrl:url}); // dynamic version
    }

    render() {
        const { layout, item } = this.props;
        const { selected } = this.state;
    
        return (
        <TouchableOpacity
            style={[
            styles.container,
            {
                width: this.renderWidth(layout),
                height: this.renderHeight(layout),
            }
            ]}
            onPress={() => { this.props.navigation.navigate("ListProduct", { categorie: item.content }) }}
        >
            <View
            style={[
                AppStyles.imageView,
                AppStyles.blockRadius,
                { flex: 3 }
            ]}
            >
            <ImageBackground
                resizeMode={"cover"}
                resizeMethod={"resize"}
                style={{
                    width: this.renderWidth(layout),
                    height: this.renderHeight(layout),
                    alignItems: "center"
                }} 
                source={{ uri: item.thumb}}
            >
            </ImageBackground>
            </View>
            <View style={[
            styles.center,
            styles.sectionBottom
            ]} >
            <Text style={[
                styles.productName,
                { fontSize: layout === 3 ? 12 : 14 }
            ]}>
                {item.name}
            </Text>
            </View>

        </TouchableOpacity>
        );}
    }

    export default withNavigation(CategorieItemMain);

    const styles = StyleSheet.create({
    container: {
        margin: Metrics.smallMargin
    },
    sectionBottom: {
        height: 50,
        paddingTop: Metrics.smallMargin
    },
    productName: {
        fontFamily: Fonts.type.Book,
        textAlign: "center",
        color: Colors.dark,
    },
    productPrice: {
        fontFamily: Fonts.type.Bold,
        textAlign: "center",
        color: Colors.dark_gray,
    },
    });