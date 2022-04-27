import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { withNavigation } from 'react-navigation';

import { AppStyles, Metrics, Images, Fonts, Colors } from '../../themes';
import Icon from "../common/Icon";

class SearchBar extends PureComponent {

  static propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
    searching: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    context: null,
    placeholder: '',
    searchText: '',
    searching: false
  };

  state = {
    searchText: '',
  };

  componentWillReceiveProps({ searchText }) {
    this.setState({ searchText });
  }

  render() {

    const { placeholder, onSearch, searching } = this.props;

    return (
      <View style={styles.container}>
        <Icon
          tintColor={Colors.appColor}
          image={require("../../resources/icons/left-arrow.png")}
          onPress={() => { this.props.navigation.goBack() }}
        />
        {
          searching && <ActivityIndicator size={'small'} />
        }
        <TextInput
          ref={(searchText) => { this.searchText = searchText; }}
          placeholder={placeholder}
          placeholderTextColor={Colors.appColor}
          underlineColorAndroid={'transparent'}
          style={styles.searchInput}
          value={this.state.searchText}
          onChangeText={searchText => this.setState({ searchText })}
          autoCapitalize={'none'}
          returnKeyType={'search'}
          onSubmitEditing={() => onSearch(this.state.searchText, this.props.context)}
          autoCorrect={false}
          selectionColor={Colors.black}
        />
        {
          this.state.searchText !== '' &&
          <Icon
            tintColor={Colors.appColor}
            image={require("../../resources/icons/cancel.png")}
            onPress={() => {
              Keyboard.dismiss();
              this.setState({ searchText: '' });
            }}
          />
        }
        <Icon
          tintColor={Colors.appColor}
          image={require("../../resources/icons/search.png")}
          width={35}
          onPress={() => onSearch(this.state.searchText, this.props.context)}
        />
      </View>
    );
  }
}

export default withNavigation(SearchBar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.transparent,
    flexDirection: 'row',
    width: Metrics.deviceWidth,
    paddingHorizontal: Metrics.smallMargin,
    zIndex:1
  },
  searchInput: {
    flex: 5,
    height: Metrics.inputHeight,
    alignSelf: 'center',
    textAlign: 'left',
    padding: Metrics.smallMargin,
    fontFamily: Fonts.type.base,
    paddingHorizontal: 10,
    color: Colors.appColor 
  },
  searchIcon: {
    paddingHorizontal: Metrics.baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
