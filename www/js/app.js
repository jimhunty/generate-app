// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.network', {
      url: "/network",
      views: {
        'menuContent' :{
          templateUrl: "templates/network.html",
          controller: 'NetworkCtrl'
        }
      }
    })

    // personId is passed through as a variable so we can see which contact has been chosen
    .state('app.person', {
      url: "/person/:personId",
      views: {
        'menuContent' :{
          templateUrl: "templates/person.html",
          controller: 'PersonCtrl'
        }
      }


    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/network');
});

