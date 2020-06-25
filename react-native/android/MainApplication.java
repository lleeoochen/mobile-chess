import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;

protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
            new WebViewBridgePackage() //<- this
    );
}