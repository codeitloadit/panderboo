angular.module('panderboo.controllers', ['firebase'])

    .controller('DashCtrl', function ($scope, $firebaseObject, $ionicLoading, AuthData, Questions) {
        $scope.$on('$ionicView.enter', function () {
            if (!$scope.authData || $scope.authData.facebook.id != AuthData.authData.facebook.id) {
                $scope.refresh();
            }
        });
        $scope.refresh = function () {
            $ionicLoading.show();
            $scope.authData = AuthData.authData;
            Questions.fetchQuestions(function (questions) {
                $scope.allQuestions = questions;
                $scope.questions = [];
                $scope.allQuestions.$loaded(function () {
                    angular.forEach($scope.allQuestions.reverse(), function (question) {
                        if (question.fromId == $scope.authData.facebook.id) {
                            $scope.questions.push(question);
                        }
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                });
            });
        };
    })

    .controller('FriendsCtrl', function ($scope, $state, $ionicLoading, AuthData, Friends) {
        $scope.$on('$ionicView.enter', function () {
            if (!$scope.authData || $scope.authData.facebook.id != AuthData.authData.facebook.id) {
                $scope.refresh();
            }
        });
        $scope.refresh = function () {
            $ionicLoading.show();
            $scope.authData = AuthData.authData;
            $scope.panderbooFriends = [];
            $scope.invitableFriends = [];
            $scope.phrase = '';
            Friends.fetchFriends(function (friends) {
                $scope.panderbooFriends = friends.panderbooFriends;
                $scope.invitableFriends = friends.invitableFriends;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            });
        };
        $scope.filterByPhrase = function (phrase) {
            $scope.panderbooFriends = [];
            $scope.invitableFriends = [];
            angular.forEach(Friends.panderbooFriends, function (friend) {
                if (friend.last_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || friend.first_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || (friend.middle_name && friend.middle_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0)) {
                    $scope.panderbooFriends.push(friend);
                }
            });
            angular.forEach(Friends.invitableFriends, function (friend) {
                if (friend.last_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || friend.first_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || (friend.middle_name && friend.middle_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0)) {
                    $scope.invitableFriends.push(friend);
                }
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
                Questions.qustions.$add({
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

    .controller('SettingsCtrl', function ($scope, $state, AuthData, FirebaseAuth, Friends, Questions) {
        $scope.authData = AuthData;
        $scope.logout = function () {
            FirebaseAuth.$unauth();
            AuthData.authData = null;
            Questions.questions = [];
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
    });
