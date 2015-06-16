angular.module('panderboo.controllers', ['firebase'])

    .controller('DashCtrl', function ($scope, $firebaseObject, $ionicLoading, AuthData, Questions, Friends) {
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
                $ionicLoading.hide();
                Friends.fetchFriends(function(friends) {

                });
            });
        };
    })

    .controller('FriendsCtrl', function ($scope, $state, $ionicLoading, AuthData, Friends) {
        $scope.friends = Friends;
        //$scope.$on('$ionicView.beforeEnter', function () {
        //    if (!$scope.authData || $scope.authData.facebook.id != AuthData.authData.facebook.id) {
        //        $scope.refresh();
        //    }
        //});
        $scope.refresh = function () {
            $ionicLoading.show();
            //$scope.authData = AuthData.authData;
            $scope.phrase = '';
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
                    fromName: AuthData.authData.facebook.displayName,
                    toId: $scope.friend.id,
                    toName: $scope.friend.name,
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
    });
