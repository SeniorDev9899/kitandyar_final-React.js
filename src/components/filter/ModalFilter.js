import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  StyleSheet,
  Text, 
  ScrollView,
  Platform
} from 'react-native';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';
import Slider from "react-native-slider";

import {
  AppStyles,
  Colors,
  Metrics
} from '../../themes';
import Button from '../common/Button';
import OptionRadio from '../common/OptionRadio';
import HeaderBar from '../header/HeaderBar';
import Categorie from '../modal/Categorie';

import { Categories } from '../../data/Categories';

export default class ModalFilter extends PureComponent {

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
    rating: 0,
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
            <HeaderBar
              title={"Filter"}
              onClose={() => onCancel()}
            />

            <View
              style={styles.block}
            >
              <Text style={[
                styles.title,
              ]}>
                Categorie
            </Text>
              <View style={[
                AppStyles.wrap
              ]}>
                {
                  categories.map((item, key) => <Categorie
                    key={key}
                    item={item}
                    styleText={{ color: Colors.white }}
                    styleButton={styles.buttonFilter}
                    changeStateCategorie={(item) => this.changeStateCategorie(item)}
                  />
                  )
                }
              </View>
            </View>

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

            <View
              style={styles.block}
            >
              <Text style={[
                styles.title,
              ]}>
                Cost
            </Text>
              <View style={[AppStyles.row]}>
                <OptionRadio
                  image={require('../../resources/icons/close.png')}
                  text={'$'}
                  selected={cost === "$" ? true : false}
                  onPress={() => { this.setState({ cost: "$" }) }}
                />
                <OptionRadio
                  image={require('../../resources/icons/close.png')}
                  text={'$$'}
                  selected={cost === "$$" ? true : false}
                  onPress={() => { this.setState({ cost: "$$" }) }}
                />
                <OptionRadio
                  image={require('../../resources/icons/close.png')}
                  text={'$$$'}
                  selected={cost === "$$$" ? true : false}
                  onPress={() => { this.setState({ cost: "$$$" }) }}
                />
              </View>
            </View>

            <Button
              text={"See Resultat"}
              onPress={() => onCancel()}
              styleButton={{ width: Metrics.deviceWidth - 100 }}
            />
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
    padding: Metrics.baseMargin,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'ios' ? 30 : 0,
  },
  button: {
    flex: 1,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.lightBg_gray
  },
  block: {
    marginVertical: Metrics.baseMargin,
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
    backgroundColor: '#f6bed4'
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: Colors.appColor,
    borderColor: '#c91058',
    borderWidth: 2,
  }
})
 