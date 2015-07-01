angular.module('panderboo.controllers', ['firebase'])

    .controller('DashCtrl', function ($scope, $state, $firebaseObject, $ionicLoading, $timeout, AuthData, Questions, Friends) {
        $scope.$on('$ionicView.beforeEnter', function () {
            if (!$scope.authData || $scope.authData.facebook.id != AuthData.authData.facebook.id) {
                $scope.refresh();
            }
        });
        $scope.refresh = function () {
            $ionicLoading.show();
            $scope.authData = AuthData.authData;
            $scope.questions = Questions;
            $scope.questions.$loaded(function () {
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1000);
            });
        };
        $scope.tap = function (question) {
            if (question.status != 'unread' || question.fromId == $scope.authData.facebook.id) {
                $state.go('tab.question-detail', {questionObj: angular.toJson(question)});
            }
        };
        $scope.doubleTap = function (question) {
            $state.go('tab.question-detail', {questionObj: angular.toJson(question)});
        };
    })

    .controller('QuestionDetailCtrl', function ($scope, $stateParams, AuthData, $rootScope, $firebaseArray, $ionicScrollDelegate) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.hideTabs = true;
        });
        $scope.$on('$ionicView.beforeLeave', function () {
            $rootScope.hideTabs = false;
        });
        $scope.authData = AuthData.authData;
        $scope.question = angular.fromJson($stateParams.questionObj);
        var ref = new Firebase('https://panderboo.firebaseio.com/questions/' + $scope.question.id + '/thread');
        $scope.thread = new $firebaseArray(ref);
        $scope.thread.$loaded(function () {
            $ionicScrollDelegate.scrollBottom();
        });
        ref.on('value', function() {
            $ionicScrollDelegate.scrollBottom();
        });
        $scope.submitMessage = function (text) {
            if (text) {
                $scope.thread.$add({
                    message: text,
                    fromId: AuthData.authData.facebook.id,
                    timestamp: Date.now()
                });
                $scope.text = '';
            }
        };
    })

    .controller('FriendsCtrl', function ($scope, $state, $ionicLoading, AuthData, Friends) {
        $scope.friends = Friends;
        $scope.refresh = function () {
            $ionicLoading.show();
            Friends.fetchFriends(function (friends) {
                $scope.friends = friends;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            });
        };
        $scope.loadFriend = function (friend) {
            $state.go('tab.friend-detail', {friendObj: angular.toJson(friend)});
        };
        $scope.clearSearch = function () {
            $scope.friends.phrase = '';
            $scope.friends.filterFriends();
        };
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, AuthData, Questions, $firebaseArray) {
        $scope.friend = angular.fromJson($stateParams.friendObj);
        $scope.submitQuestion = function (text) {
            if (text) {
                var timestamp = Date.now();
                Questions.$add({
                    thread: [],
                    question: text,
                    fromId: AuthData.authData.facebook.id,
                    toId: $scope.friend.id,
                    timestamp: timestamp,
                    status: 'unread'
                }).then(function(ref) {
                    ref.update({id: ref.key()});
                    var threadRef = new Firebase('https://panderboo.firebaseio.com/questions/' + ref.key() + '/thread');
                    var thread = $firebaseArray(threadRef);
                    thread.$add({
                        message: text,
                        fromId: AuthData.authData.facebook.id,
                        timestamp: timestamp
                    });
                });
                $scope.text = '';
            }
        };
    })

    .controller('SettingsCtrl', function ($scope, $state, AuthData, Friends, Questions) {
        $scope.authData = AuthData.authData;
        $scope.logout = function () {
            AuthData.unauth();
            Questions = [];
            Friends.clear();
            $state.go('login');
        };
    })

    .controller('LoginCtrl', function ($scope, $state, AuthData, FirebaseAuth, $cordovaOauth) {
        $scope.errors = [];
        $scope.login = function () {
            $scope.errors = [];
            if (!!window.cordova) {
                $cordovaOauth.facebook('867761916650124', ['user_friends']).then(function (result) {
                    FirebaseAuth.$authWithOAuthToken('facebook', result.access_token).then(function (authData) {
                        AuthData.authData = authData;
                        $state.go('tab.dash');
                    }, function (error) {
                        $scope.errors.push(error.toString());
                    });
                }, function (error) {
                    $scope.errors.push(error.toString());
                });
            } else {
                FirebaseAuth.$authWithOAuthPopup('facebook').then(function (authData) {
                    AuthData.authData = authData;
                    $state.go('tab.dash');
                }, function (error) {
                    $scope.errors.push(error.toString());
                });
            }
        };
    }
);
