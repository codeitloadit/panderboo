angular.module('panderboo', ['ionic', 'panderboo.controllers', 'panderboo.services', 'firebase', 'ngCordovaOauth'])

    .run(function($ionicPlatform, $rootScope, $state, Auth) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });

        //$rootScope.useCordova = true;
        $rootScope.authData = Auth.$getAuth();
        //$rootScope.platform = ionic.Platform.platform();
        //$rootScope.cordovaResult = null;
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })

            // Abstract state for the auth tabs
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('tab.friends', {
                url: '/friends',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/tab-friends.html',
                        controller: 'FriendsCtrl'
                    }
                }
            })
            .state('tab.friend-detail', {
                url: '/friends/:friendId',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/friend-detail.html',
                        controller: 'FriendDetailCtrl'
                    }
                }
            })
            .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/tab-settings.html',
                        controller: 'SettingsCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        //$urlRouterProvider.otherwise('/anon/login');
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            var authData = $injector.get('$rootScope').authData;
            if (authData) {
                $state.go('tab.dash');
            } else {
                $state.go('login');
            }
        });

    });
