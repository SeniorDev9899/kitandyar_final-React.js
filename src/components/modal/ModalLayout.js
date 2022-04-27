import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  StyleSheet,
  Text,
  FlatList,
  StatusBar
} from 'react-native';
import Modal from 'react-native-modal';

import {
  Colors,
  Metrics
} from '../../themes';
import Layout from "./Layout";
import { Layouts } from '../../data/Layouts';
 
export default class ModalPicker extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    updateLayout: PropTypes.func,
    list: PropTypes.any,
    layout: PropTypes.any
  };

  static defaultProps = {
    visible: false,
    updateLayout: () => { },
    list: [],
    layout: 1
  };

  _keyExtractor = (item, index) => item.layout;

  _renderRow = (obj) => {
    return (
      <Layout
        item={obj}
        select={this.props.layout}
        onPress={() => this.props.updateLayout(obj.layout)}
      />
    )
  }

  render() {
    const {
      visible,
      updateItem,
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
        <View style={{ flex: 1 }} />
        <View style={styles.modalContent}>
          <FlatList
            data={Layouts}
            numColumns={2}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => (this._renderRow(item))}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    margin: Metrics.baseMargin,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    padding: Metrics.baseMargin,
    backgroundColor: 'white',
  },
})

