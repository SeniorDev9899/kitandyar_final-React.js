import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from "../common/Icon";
import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
// import Modal from 'react-native-modal';
const entryBorderRadius = 8;
export default class SliderProduct extends Component {
  state = {
    isVisble:false,
    shown:true,
    curIndex:0
  }
  static propTypes = {
    data: "",
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    itemWidth: PropTypes.number,
    slideHeight: PropTypes.number,
    itemHorizontalMargin: PropTypes.number,
    imageurls: PropTypes.array
  };

  componentDidMount(){

  }

  handleCloseModal() {
      this.setState({ isVisble: false });
  }

  get image() {
    const { data, parallax, parallaxProps, even, imageurls } = this.props;

    return parallax ? (
      <ParallaxImage
        resizeMethod={"resize"}
        source={{ uri: data}}
        containerStyle={[stylesSlide.imageContainer, even ? stylesSlide.imageContainerEven : {}]}
        style={stylesSlide.image}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
      // <Modal visible={true} transparent={true}>
      //           <ImageViewer imageUrls={images}/>
      //   </Modal>
    ) : (
        <Image
          resizeMethod={"resize"}
          source={{ uri: data }}
          style={stylesSlide.image}
        />
        // <Modal visible={true} transparent={true}>
        //         <ImageViewer imageUrls={images}/>
        // </Modal>
       );
  }
  closeViewer(){
    this.setState({
        shown:false,
        curIndex:0
    })
  }
  render() {
    const {data, even, itemWidth, slideHeight, itemHorizontalMargin, index, imageurls } = this.props;
    console.log("product_imageurls",imageurls);
    const images = [{
      url: data
    }];
    const urls = [];
    // for(i=0;i<imageurls.length; i++){
    //   urls[i] = {url: imageurls[i]}
    // }
    j=0;
    for(i=(index % imageurls.length); i<(imageurls.length + (index % imageurls.length)); i++)
    {
      urls[j] = {url: imageurls[(i + imageurls.length -2) % imageurls.length]};
      // urls[j] = {url: (i % imageurls.length)};
      j++;

    }
    console.log("slide",index, urls);
    title = "Title";
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
            paddingHorizontal: itemHorizontalMargin,

          }
        ]}
      //  onPress={() => { alert(index); }}
      onPress={() => { this.setState({isVisble:true}) }}
      >
        <View style={[stylesSlide.imageContainer, even ? stylesSlide.imageContainerEven : stylesSlide.imageContainerEven]}>
          {this.image} 
        </View>
        <Modal visible={this.state.isVisble}
          onRequestClose={() => {
            console.log('Close handled');
            this.handleCloseModal();
          }}>
        {/* <View style={stylesSlide.modal}> */}
            <Icon
                positionRight={true}
                tintColor={Colors.white}
                image={require("../../resources/icons/cancel.png")}
                onPress={() => this.setState({isVisble:false})}
                backgroundColor ={Colors.red}
                borderRadius = {true}
            />
        {/* </View> */}
            {/* <ImageViewer imageUrls={images} /> */}
            <ImageViewer backgroundColor={Colors.white}
                         imageUrls={urls}
                        //  index = {5}
            />
         </Modal>
      </TouchableOpacity>
      
    );
  }
}

const stylesSlide = StyleSheet.create({
  slideInnerContainer: {
    paddingBottom: 18 // needed for shadow
  },
  imageContainer: {
    flex: 1,
    backgroundColor: Colors.b,
    borderRadius: entryBorderRadius,
  },
  imageContainerEven: {
    backgroundColor: Colors.transparent,
    borderRadius: entryBorderRadius
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
    borderRadius: entryBorderRadius
  },
  modal:{
    backgroundColor:'black'
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 5,
    margin: 5,
    width: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  // image's border radius is buggy on ios; let's hack it!
  // radiusMask: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   height: entryBorderRadius,
  //   backgroundColor: 'white'
  // },
  // radiusMaskEven: {
  //   backgroundColor: Colors.black
  // },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: entryBorderRadius,
  },
  textContainerEven: {
    backgroundColor: Colors.black
  },
  title: {
    color: Colors.black,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  titleEven: {
    color: 'white'
  },
  subtitle: {
    marginTop: 6,
    color: Colors.gray,
    fontSize: 12,
    fontStyle: 'italic'
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
});



