angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller('WelcomeCtrl', function($scope){
    date = new Date();
    var hours = date.getHours();
    console.log(hours);
    if (hours >= 5 && hours <= 11) //MESSAGE FOR MORNING
    $scope.time = "Good Morning.";
    else if (hours >= 12 && hours <= 17) //MESSAGE FOR AFTERNOON
    $scope.time = 'Good Afternoon.';
    else if (hours >= 18 && hours <= 20) //MESSAGE FOR EVENING (6pm-8pm)
    $scope.time = 'Good Evening.';
    else //MESSAGE FOR NIGHT (9pm-4am)
    $scope.time = 'Good Night.';
    console.log('Control Working');
    
    $scope.create = function() {
        $state.go('app.bulletin');
    };
    $scope.close = function() { 
        $state.go('app.welcome'); 
    };
})

.controller('BulletinCtrl', function ($http){
$http.get('http://www.html5rocks.com/en/tutorials/cors/');
    jQuery('.bulletin').load('http://www.html5rocks.com/en/tutorials/cors/ .prettyprint');
})
.controller('LunchCtrl', function ($http){
$http.get('http://www.html5rocks.com/en/tutorials/cors/');
    jQuery('.lunch').load('http://www.html5rocks.com/en/tutorials/cors/ .prettyprint');
});