angular.module('panderboo', ['ionic', 'panderboo.controllers', 'panderboo.services', 'firebase'])

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

        //$ionicPlatform.registerBackButtonAction(function (event) {
        //    event.preventDefault();
        //    event.stopPropagation();
        //}, 100);
        //$ionicPlatform.onHardwareBackButton(function() {
        //    event.preventDefault();
        //    event.stopPropagation();
        //});

        $rootScope.authData = Auth.$getAuth();

        //stateChange event
        //$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //    if ($rootScope.authData === null && toState != 'tab.login') {
        //        console.log('redirecting');
        //        $state.go('tab.login');
        //        event.preventDefault();
        //        //$state.reload();
        //    }
        //});
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            // Abstract state for the auth tabs
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/auth-tabs.html"
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
            })

            // Abstract state for the anon tabs
            .state('anon', {
                url: "/anon",
                abstract: true,
                templateUrl: "templates/anon-tabs.html"
            })
            .state('anon.login', {
                url: '/login',
                views: {
                    'anon-login': {
                        templateUrl: 'templates/tab-login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('anon.register', {
                url: '/register',
                views: {
                    'anon-register': {
                        templateUrl: 'templates/tab-register.html',
                        controller: 'RegisterCtrl'
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
                $state.go('anon.login');
            }
        });

    });
