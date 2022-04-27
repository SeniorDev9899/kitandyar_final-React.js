import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Slider from "react-native-slider";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Platform
} from 'react-native';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';

import {
  AppStyles,
  Colors,
  Metrics
} from '../../themes';
import Button from '../common/Button';
import OptionRadio from '../common/OptionRadio';
import Header from './Header';
import Categorie from './Categorie';

import { Categories } from '../../data/Categories';

export default class ModalFilterStore extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    onCancel: () => { }
  };

  state = {
    categories: Categories,
    selectedCategories: [],
    rating: 2,
    distance: 7,
    cost: "$"
  }

  changeStateCategorie = (item) => {
    const index = this.state.selectedCategories.indexOf(item.id);

    if (index !== -1) {
      this.setState(prevState => ({
        selectedCategories: [
          ...prevState.selectedCategories.slice(0, index),
          ...prevState.selectedCategories.slice(index + 1),
        ],
      }));
    }
    else {
      this.setState(prevState => ({
        selectedCategories: [
          ...prevState.selectedCategories,
          item.id
        ],
      }));
    }
  }

  render() {

    const {
      visible,
      onCancel
    } = this.props;

    const {
      categories,
      rating,
      distance,
      cost
    } = this.state;

    return (
      <Modal
        isVisible={visible}
        animationIn={'bounceInUp'}
        animationOut={'fadeOutUpBig'}
        animationInTiming={1200}
        animationOutTiming={900}
        backdropTransitionInTiming={1200}
        backdropTransitionOutTiming={900}
        onRequestClose={() => onCancel()}
      >
        <ScrollView >
          <View style={[
            AppStyles.spaceBetween,
            styles.modalContent
          ]}>
            <Header
              title={"Filter"}
              onClose={() => onCancel()}
            />

            <View
              style={styles.block}
            >
              <Text style={[
                styles.title,
              ]}>
                Rating
            </Text>
              <View style={{ width: Metrics.deviceWidth / 3 }}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={rating}
                  starColor={'#eae678'}
                  starSize={25}
                  selectedStar={(rating) => { this.setState({ rating: rating }) }}
                />
              </View>
            </View>

            <View
              style={styles.block}
            >
              <Text style={[
                styles.title,
              ]}>
                Distance
            </Text>
              <View >
                <Slider
                  value={distance}
                  minimumValue={0}
                  maximumValue={100}
                  trackStyle={styles.track}
                  thumbStyle={styles.thumb}
                  minimumTrackTintColor={Colors.appColor}
                  onValueChange={value => this.setState({ distance: value })}
                />
              </View>
              <View style={[
                AppStyles.row,
                AppStyles.spaceBetween
              ]}>
                <Text>0 Km</Text>
                <Text>50 Km</Text>
                <Text>Everywhere</Text>
              </View>
            </View>
            <View style={[AppStyles.row, { height: Metrics.navBarHeight }]} >
              <Button
                styleButton={styles.buttonLeft}
                styleText={{ color: Colors.white }}
                text={"Find"}
                onPress={() => {alert("Find Store Locator")}}
              />
              <Button
                styleButton={styles.buttonRight}
                styleText={{ color: Colors.black }}
                text={"Cancel"}
                onPress={() => onCancel()}
              />
            </View>
          </View> 
        </ScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    margin: Metrics.baseMargin,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'ios' ? 70 : 50,
  },
  button: {
    flex: 1,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.lightBg_gray
  },
  block: {
    marginVertical: Metrics.baseMargin,
    padding: Metrics.baseMargin,
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
    color: Colors.black,
    fontWeight: "bold"
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light_gray
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: Colors.appColor,
    borderColor: Colors.light_gray,
    borderWidth: 2,
  },
  buttonLeft: {
    flex: 1,
    borderBottomLeftRadius: 10,
    backgroundColor: Colors.appColor
  },
  buttonRight: {
    flex: 1,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.lightBg_gray
  },
}) 