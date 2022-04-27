import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class ProductTabView extends PureComponent {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Product Details' },
      { key: 'second', title: 'Reviews' } 
    ],
  };

FirstRoute = () => <View style={[styles.container, { padding: Metrics.baseMargin }]} >
  <Text style={styles.textDesction}>
    Reference {this.props.productDetail.reference}
  </Text>
  {this.props.productDetail.quantity>=0 && 
  <Text style={styles.textDesction}>
    In stock {this.props.productDetail.quantity} items
  </Text>
  }
</View>;

SecondRoute = () => <View style={[styles.container, { padding: Metrics.baseMargin }]} >
<Text style={styles.textDesction}>
  {this.props.reviews}
  </Text>
</View>;

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = (props) => {
    return <TabBar {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />;
  };

  _renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute 
  });

  render() {
    console.log("description",this.props.productDetail);
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 250,
  },
  tabbar: {
    backgroundColor: Colors.white,
    height: 50
  },
  tab: {},
  indicator: {
    backgroundColor: Colors.appColor,
    color: Colors.red,
  },
  label: {
    color: Colors.black,
    fontWeight: '400',
  },
});