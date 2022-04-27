import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  StyleSheet,
  Text,
  FlatList,
  StatusBar,
  ScrollView,
  Image
} from 'react-native';
import Modal from 'react-native-modal';
import i18n from '../../helpers/I18n/I18n';

import {
  Colors,
  Metrics,
  Fonts,
  AppStyles
} from '../../themes';
import Layout from "./Layout";
import Button from "../../components/common/Button";
import OptionRadio from "../../components/common/OptionRadio";
import Color from "../../components/Product/Color"
import Size from "../../components/Product/Size"
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { FilterColor } from "../../data/FilterColor";
import { FilterSize } from "../../data/FilterSize";

export default class ModalFilter extends PureComponent {

  state = {
    subCategorieSelected: {
      id: this.props.subCategorie,
      name: this.props.nameCategorie
    },
    color: 1,
    size: 1,
    sliderOneChanging: false,
    sliderOneValue: [5],
    multiSliderValue: [40, 150],
    lang: "",
    isRTL: false,
  }

  static propTypes = {
    visible: PropTypes.bool,
    updateSubCategorie: PropTypes.func,
    list: PropTypes.any,
    categorie: PropTypes.any,
    onCancel: PropTypes.func,
    subCategories: PropTypes.any
  };

  static defaultProps = {
    visible: false,
    updateSubCategorie: () => { },
    onCancel: () => { },
    list: [],
    categorie: 0,
    subCategories: []
  };

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true,
    });
  }

  sliderOneValuesChange = (values) => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      sliderOneValue: newValues,
    });
  }

  sliderOneValuesChangeFinish = () => {
    this.setState({
      sliderOneChanging: false,
    });
  }

  multiSliderValuesChange = (values) => {
    this.setState({
      multiSliderValue: values,
    });
  }


  _keyExtractor = (item, index) => item.id;

  _renderRowCategory = (obj) => {
    return (
      <OptionRadio
        text={obj.name}
        selected={this.state.subCategorieSelected.id === obj.id ? true : false}
        setyleRadio={{ paddingLeft: Metrics.baseMargin }}
        width={15}
        sub={true}
        color={obj.color}
        onPress={() => this.setState({ subCategorieSelected: obj })}
      />
    )
  }

  _renderRowColor = (obj) => {
    return (
      <Color
        selected={this.state.color === obj.id ? true : false}
        color={obj.color}
        onPress={() => this.setState({ color: obj.id })}
      />
    )
  }

  _renderRowSize = (obj) => {
    return (
      <Size
        size={obj.name}
        selected={this.state.size === obj.id ? true : false}
        onPress={() => this.setState({ size: obj.id })}
      />
    )
  }

  render() {

    const { subCategorieSelected, lang, isRTL } = this.state;

    const {
      visible,
      updateItem,
      updateSubCategorie,
      onCancel,
      subCategories
    } = this.props;

    return (
      <Modal
        isVisible={visible}
        animationIn={'bounceInUp'}
        animationOut={'fadeOutUpBig'}
        animationInTiming={1200}
        animationOutTiming={900}
        backdropTransitionInTiming={1200}
        backdropTransitionOutTiming={900}
        onRequestClose={() => { alert("Liste a été fermé") }}
      >
        <View style={styles.modalContent}>
          <View style={[
            AppStyles.center,
            styles.header
          ]}
          >
            <Text
              style={[
                Fonts.style.large,
                Fonts.style.bold,
                Fonts.style.center
              ]}
            >
               {i18n.t('modal_filter_component.filter_by', { locale: lang } )}
            </Text>
          </View>
          <ScrollView style={{ padding: Metrics.baseMargin }}>

            <View style={styles.filter}>
              <Text
                style={[
                  Fonts.style.medium,
                  Fonts.style.bold
                ]}
              >
                 {i18n.t('modal_filter_component.category', { locale: lang } )}
            </Text>
              <OptionRadio
                text={this.props.nameCategorie}
                selected={this.props.subCategorie === this.state.subCategorieSelected.id ? true : false}
                onPress={() => this.setState({
                  subCategorieSelected: {
                    id: this.props.subCategorie,
                    name: this.props.nameCategorie
                  }
                })
                }
              />
              {
                subCategories.map((item, i) => this._renderRowCategory(item))
              }
            </View>

            <View style={styles.filter}>
              <Text
                style={[
                  Fonts.style.medium,
                  Fonts.style.bold
                ]}
              >
                {i18n.t('modal_filter_component.range_price', { locale: lang } )}
              </Text>
              <View style={{ marginTop: 10}}>
                <MultiSlider
                  values={[this.state.multiSliderValue[0], this.state.multiSliderValue[1]]}
                  sliderLength={280}
                  onValuesChange={this.multiSliderValuesChange}
                  min={0}
                  max={200}
                  step={1}
                  allowOverlap
                  snapped
                  selectedStyle={{
                    backgroundColor: '#000000',
                  }}
                  unselectedStyle={{
                    backgroundColor: 'silver',
                  }}
                  containerStyle={{
                    height: 30,
                  }}
                  trackStyle={{
                    height: 1,
                    backgroundColor: '#000000',
                  }} 
                  touchDimensions={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    slipDisplacement: 40 
                  }}
                />
              </View>
              <View style={[
                AppStyles.row,
                AppStyles.spaceBetween
              ]}>
                <Text
                  style={[
                    Fonts.style.normal
                  ]}
                >
                  {this.state.multiSliderValue[0]} $
                </Text>
                <Text
                  style={[
                    Fonts.style.normal
                  ]}
                >
                  {this.state.multiSliderValue[1]} $
                </Text>
              </View>
            </View>

            <View style={styles.filter}>
              <Text
                style={[
                  Fonts.style.medium,
                  Fonts.style.bold
                ]}
              >
                 {i18n.t('global.color', { locale: lang } )}
            </Text>
              <View style={[AppStyles.row, AppStyles.center]}>
                {
                  FilterColor.map((item, i) => this._renderRowColor(item))
                }
              </View>
            </View>

            <View style={styles.filter}>
              <Text
                style={[
                  Fonts.style.medium,
                  Fonts.style.bold
                ]}
              >
                 {i18n.t('global.size', { locale: lang } )}
            </Text>
              <View style={[AppStyles.row, AppStyles.center]}>
                {
                  FilterSize.map((item, i) => this._renderRowSize(item))
                }
              </View>
            </View>

          </ScrollView>
          <View style={[AppStyles.row, { height: Metrics.navBarHeight }]} >
            <Button
              styleButton={styles.buttonLeft}
              styleText={{ color: Colors.white }}
              text={ i18n.t('modal_filter_component.find', { locale: lang } )}
              onPress={() => updateSubCategorie(subCategorieSelected)}
            />
            <Button
              styleButton={styles.buttonRight}
              styleText={{ color: Colors.black }}
              text={ i18n.t('modal_filter_component.reset', { locale: lang } )}
              onPress={() => onCancel()}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    height: Metrics.deviceHeight * 0.8,
    margin: Metrics.baseMargin,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: 'white',
  },
  filter: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.transparent,
    marginTop: Metrics.baseMargin
  },
  header: {
    height: Metrics.navBarHeight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBg_gray
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
  image: {
    height: 40,
    width: 40
  }
})

