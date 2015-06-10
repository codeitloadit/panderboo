angular.module('panderboo.controllers', ['firebase'])

    .controller('DashCtrl', function ($scope, $firebaseObject, AuthData, $window) {
        //var ref = new Firebase('https://panderboo.firebaseio.com/questions/');
        //$scope.questions = $firebaseObject(ref);

        $scope.refresh = function () {
            $window.location.reload(true)
        };

        $scope.facebookPictureUrl = AuthData.facebookPictureUrl();

    })

    .controller('FriendsCtrl', function ($scope, $ionicLoading, PanderbooFriends, InvitableFriends) {
        $scope.refresh = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $scope.phrase = '';
            PanderbooFriends.fetchFriends(function (friends) {
                $scope.panderbooFriends = friends;
                InvitableFriends.fetchFriends(function (friends) {
                    $scope.invitableFriends = friends;
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                });
            });
        };
        $scope.refresh();

        $scope.filterByPhrase = function (phrase) {
            $scope.panderbooFriends = [];
            $scope.invitableFriends = [];
            angular.forEach(PanderbooFriends.getFriends(), function (friend) {
                if (friend.last_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || friend.first_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || (friend.middle_name && friend.middle_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0)) {
                    $scope.panderbooFriends.push(friend);
                }
            });
            angular.forEach(InvitableFriends.getFriends(), function (friend) {
                if (friend.last_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || friend.first_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || (friend.middle_name && friend.middle_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0)) {
                    $scope.invitableFriends.push(friend);
                }
            });
        };

        $scope.loadFriend = function (friendId) {
            console.log(friendId);
        }
    })

    .controller('FriendDetailCtrl', function ($scope, AuthData) {

    })

    .controller('SettingsCtrl', function ($scope, $state, AuthData) {
        $scope.facebookPictureUrl = AuthData.facebookPictureUrl();
        $scope.displayName = AuthData.displayName();
        $scope.email = AuthData.email();
        $scope.logout = function () {
            AuthData.unauth();
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
                        AuthData.set(authData);
                        $state.go('tab.dash');
                    }, function (error) {
                        $scope.errors.push(error.toString());
                    });
                }, function (error) {
                    $scope.errors.push(error.toString());
                });
            } else {
                FirebaseAuth.$authWithOAuthPopup('facebook').then(function(authData) {
                    AuthData.set(authData);
                    $state.go('tab.dash');
                }, function (error) {
                    $scope.errors.push(error.toString());
                });
            }
        };
    });
