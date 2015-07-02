angular.module('panderboo', ['ionic', 'panderboo.controllers', 'panderboo.services', 'firebase', 'ngCordovaOauth', 'angularMoment'])

    .run(function ($ionicPlatform, $rootScope, AuthData, $state, Friends, $ionicLoading, amMoment) {
        $ionicPlatform.ready(function () {
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

        moment.locale('en', {
            calendar: {
                sameDay: 'LT',
                nextDay: '[Tomorrow]',
                nextWeek: 'MMM DD',
                lastDay: '[Yesterday]',
                lastWeek: 'MMM DD',
                sameElse: 'MMM DD'
            },
            meridiem: function (hours) {
                if (hours > 11) {
                    return 'pm';
                } else {
                    return 'am';
                }
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $provide) {
        // Enable native scrolls for Android platform only, as you see, we're disabling jsScrolling to achieve this.
        if (ionic.Platform.isAndroid() && !!window.cordova) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }
        function $LocationDecorator($location) {
            $location.hash = function (value) {
                return $location.__hash(value);
            };
            return $location;
        }

        $provide.decorator('$location', ['$delegate', $LocationDecorator]);

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('tab.conversations', {
                url: '/conversations',
                views: {
                    'tab-conversations': {
                        templateUrl: 'templates/tab-conversations.html',
                        controller: 'ConversationsCtrl'
                    }
                }
            })
            .state('tab.conversation-detail', {
                url: '/conversation/:conversationObj',
                views: {
                    'tab-conversations': {
                        templateUrl: 'templates/conversation-detail.html',
                        controller: 'QuestionDetailCtrl'
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
                $state.go('tab.conversations');
            } else {
                $state.go('login');
            }
        });
    })

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    .directive('focusInput', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    $timeout(function () {
                        element.parent().find('input')[0].focus();
                    });
                });
            }
        };
    });
