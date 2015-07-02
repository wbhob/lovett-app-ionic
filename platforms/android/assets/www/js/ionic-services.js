// Add the 'ionic.service.core' module to your main angular module:
angular.module('ionic-services', ['ionic', 'ngCordova', 'ionic.service.core', 'ionic.service.analytics'])
// Identify App
.config(['$ionicAppProvider', function($ionicAppProvider) {
  // Identify app
  $ionicAppProvider.identify({
    // The App ID for the server
    app_id: 'Lovett',
    // The API key all services will use for this app
    api_key: 'ef581894f393b5ca0109017cd15355fb3ba03ea51aa53784'
  });
}])
