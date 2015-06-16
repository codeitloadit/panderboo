angular.module('panderboo', ['ionic', 'panderboo.controllers', 'panderboo.services', 'firebase', 'ngCordovaOauth', 'angularMoment'])

    .run(function($ionicPlatform, $rootScope, AuthData, $state, Friends, $ionicLoading, amMoment) {
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

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (!AuthData.authData && toState.name != 'login') {
                $state.go('login');
                event.preventDefault();
            }
        });

        amMoment.changeLocale('en');
    })

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        // Enable native scrolls for Android platform only, as you see, we're disabling jsScrolling to achieve this.
        if (ionic.Platform.isAndroid()) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })

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
                url: '/friends/:friendObj',
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

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            if ($injector.get('AuthData').authData) {
                $state.go('tab.dash');
            } else {
                $state.go('login');
            }
        });
    });
