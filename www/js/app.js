angular.module('panderboo', ['ionic', 'panderboo.controllers', 'panderboo.services', 'firebase'])

    .run(function($ionicPlatform, $rootScope, $firebaseAuth, $state) {
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

        //$rootScope.authData = Auth.$getAuth();

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

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            //.state('login', {
            //    url: '/login',
            //    templateUrl: 'templates/login.html',
            //    controller: 'LoginCtrl'
            //})
            //
            //.state('register', {
            //    url: '/register',
            //    templateUrl: 'templates/register.html',
            //    controller: 'RegisterCtrl'
            //})
            //
            //.state('tab', {
            //    url: '/tab',
            //    abstract: true,
            //    templateUrl: 'templates/tabs.html'
            //})
            //.state('tab.dash', {
            //    url: '/dash',
            //    views: {
            //        'tab-dash': {
            //            templateUrl: 'templates/tab-dash.html',
            //            controller: 'DashCtrl'
            //        }
            //    }
            //})
            //.state('tab.friends', {
            //    url: '/friends',
            //    views: {
            //        'tab-friends': {
            //            templateUrl: 'templates/tab-friends.html',
            //            controller: 'FriendsCtrl'
            //        }
            //    }
            //})
            //.state('tab.settings', {
            //    url: '/settings',
            //    views: {
            //        'tab-settings': {
            //            templateUrl: 'templates/tab-settings.html',
            //            controller: 'SettingsCtrl'
            //        }
            //    }
            //})
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

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

            .state('tab.login', {
                url: '/login',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('tab.register', {
                url: '/register',
                views: {
                    'tab-register': {
                        templateUrl: 'templates/tab-register.html',
                        controller: 'RegisterCtrl'
                    }
                }
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/login');
        //$urlRouterProvider.otherwise(function ($injector, $location, $firebaseAuth) {
        //    var $state = $injector.get('$state');
        //    var ref = new Firebase('https://panderboo.firebaseio.com');
        //    if ($firebaseAuth(ref).$getAuth()) {
        //        $state.go('tab.dash');
        //    } else {
        //        $state.go('tab.login');
        //    }
        //});

    });
