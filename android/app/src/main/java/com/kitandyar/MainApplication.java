package com.kitandyar;

import android.app.Application;
 
import com.facebook.react.ReactApplication;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import cl.json.RNSharePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
// import com.github.orhan.bottomnavigation.ReactBottomNavigationPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            // new ReactBottomNavigationPackage(),     
            new ReactNativeRestartPackage(),
            new RandomBytesPackage(),
            new RNPermissionsPackage(),
            new RNSpinkitPackage(),
            new LinearGradientPackage(),
            new RNSharePackage(),
            new ImagePickerPackage(),
            new RNLanguagesPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
