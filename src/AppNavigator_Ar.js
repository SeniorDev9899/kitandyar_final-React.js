import {
  DrawerNavigator,
} from 'react-navigation';

import CartScreen from "./containers/Cart/CartScreen";
import OrderScreen from "./containers/Setting/OrderScreen";
import MyAccountScreen from "./containers/Setting/MyAccountScreen";
import SingleSelectDialog from "./components/SingleSelectDialog"
import HomeScreen from './containers/Home/HomeScreen';


export default Drawer_Ar = DrawerNavigator(
  {
    الصفحةالرئيسية: { screen: HomeScreen },
    حسابي: { screen: MyAccountScreen },
    الدفع: { screen: CartScreen},
    نوعالعملة: { screen: OrderScreen},
    لغة: { screen: OrderScreen},
    // Login: { screen: SignInScreen},
  },
  {
    navigationOptions: {
      gesturesEnabled: false
    },
    initialRouteName: "الصفحةالرئيسية",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    drawerPosition: 'left',

    contentComponent:  SingleSelectDialog 
  }
);
