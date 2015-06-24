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
                }, 2000);
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
        //var holdStart = 0;
        //$scope.touch = function (question) {
        //    if (question.status == 'unread' && question.fromId != $scope.authData.facebook.id) {
        //        holdStart = Date.now();
        //        var localStart = holdStart;
        //        $timeout(function () {
        //            if (localStart == holdStart) {
        //                $state.go('tab.question-detail', {questionObj: angular.toJson(question)});
        //            }
        //        }, 500);
        //    } else {
        //        $state.go('tab.question-detail', {questionObj: angular.toJson(question)});
        //    }
        //};
        //$scope.release = function (question) {
        //    if (question.status == 'unread' && question.fromId != $scope.authData.facebook.id) {
        //        holdStart = 0;
        //    } else {
        //        $state.go('tab.question-detail', {questionObj: angular.toJson(question)});
        //    }
        //};
        //$scope.resetHold = function () {
        //    holdStart = 0;
        //};
    })

    .controller('QuestionDetailCtrl', function ($scope, $stateParams, AuthData) {
        $scope.authData = AuthData.authData;
        $scope.question = angular.fromJson($stateParams.questionObj);
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
        }
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, AuthData, Questions) {
        $scope.friend = angular.fromJson($stateParams.friendObj);
        $scope.text = '';
        $scope.submitQuestion = function (text) {
            if (text) {
                Questions.$add({
                    question: text,
                    fromId: AuthData.authData.facebook.id,
                    toId: $scope.friend.id,
                    timestamp: Date.now(),
                    status: 'unread'
                });
                $scope.text = '';
            }
        };
    })

    .controller('SettingsCtrl', function ($scope, $state, AuthData, Friends, Questions) {
        $scope.authData = AuthData;
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
