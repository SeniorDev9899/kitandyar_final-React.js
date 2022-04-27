import {
  DrawerNavigator,
} from 'react-navigation';

import OrderScreen from "./containers/Setting/OrderScreen";
import MyAccountScreen from "./containers/Setting/MyAccountScreen";
import SingleSelectDialog from "./components/SingleSelectDialog";
import HomeScreen from './containers/Home/HomeScreen';
import CartScreen from './containers/Cart/CartScreen';

export default Drawer = DrawerNavigator(
  {
    Home: {screen: HomeScreen},
    MyAccount: { screen: MyAccountScreen },
    Checkout: { screen: CartScreen},
    CurrencyType: { screen: OrderScreen},
    // Language: { screen: OrderScreen},
  },
  {
    navigationOptions: {
      gesturesEnabled: false
    },
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    drawerPosition: 'left',

    contentComponent:  SingleSelectDialog 
  }
);
