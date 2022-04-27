// @flow
import React, {
  Component
} from 'react';

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Route_En from './MyStackNavigator_En';
import Route_Ar from './MyStackNavigator_Ar';
import rootReducer from './redux/reducers'

const store = createStore(rootReducer)
var storage = require("react-native-local-storage");

class App extends Component {

    constructor(props) {
      super(props);

      this.state = {
        lang: "en"
      }
    }

    componentDidMount(){
      storage.get('lang').then((lang_) => {
        if (lang_ != null) {
           this.setState({lang: lang_});
        }
      });
    }

    render() {
      
      console.log("language_app =", this.state.lang);

      return (
        <Provider store={store}>
          {(this.state.lang == 'en') ? (
            <Route_En />
          ) : (
            <Route_Ar />
          )}
        </Provider>
      )
    }

  };

  export default App;
