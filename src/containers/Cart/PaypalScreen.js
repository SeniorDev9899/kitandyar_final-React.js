import React, { PureComponent } from 'react';
import {
    WebView
} from 'react-native';
export default class PaypalScreen extends PureComponent {
    state = {
        index: 0,
        payerId: ""
    }
    _onNavigationStateChange(webViewState) {

        console.log(webViewState.url.substring(0, 15));
        if (webViewState.url.substring(0, 15) == "https://success") {
            index_temp = this.state.index + 1;
            this.setState({ index: index_temp });
            var payerId = "";
            if (index_temp == 2) {
                length = webViewState.url.length;
                for (i = 0; i < length; i++) {
                    if (webViewState.url[length - 1 - i] == "=") {
                        payerId = webViewState.url.slice(-i);
                        console.log("payerId", payerId);
                    }
                    if (payerId.length > 0) {
                        i = length;
                    }
                }
                const AccessToken = this.props.navigation.getParam('AccessToken');
                const PaymentId = this.props.navigation.getParam('paymentId');
                url = "https://api.sandbox.paypal.com/v1/payments/payment/" + PaymentId + "/execute/";
                console.log("aacess", AccessToken);
                fetch(url, {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer  ' + AccessToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "payer_id": payerId
                    })
                })
                    .then(res => res.json())
                    .then(resJson => {
                        console.log("ok", resJson);
                        if (resJson != null) {
                            this.props.navigation.navigate("OrderDetail", { card: this.props.navigation.state.params.card, carrierId: this.props.navigation.state.params.carrierId, address: this.props.navigation.state.params.address });
                            // alert("success");
                        }
                    }).catch(error => {
                        console.log(error);
                        this.setState({ loading: false });
                    })

            }

        }
        if(webViewState.url.substring(0, 14) == "https://cancel")
        {
            this.props.navigation.goBack();
        }
        // this.props.navigation.navigate('OrderDetail'
        //     // payerId:this.state.payerId
        //   );
        // get payer from of the url
    }
    render() {
        const { navigation } = this.props;
        const approvalUrl = navigation.getParam('approvalUrl');
        return (
            <WebView
                source={{ uri: approvalUrl }}
                onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // injectedJavaScript = {()=>{alert("ok")}}
                startInLoadingState={false}
                style={{ marginTop: 20 }}
            />

        );
    }
}