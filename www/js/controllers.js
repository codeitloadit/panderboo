angular.module('panderboo.controllers', ['firebase'])

    .controller('DashCtrl', function ($scope, $firebaseObject) {
        var ref = new Firebase('https://panderboo.firebaseio.com/questions/');
        $scope.questions = $firebaseObject(ref);
    })

    .controller('FriendsCtrl', function ($scope, $rootScope, $http, Auth, $ionicLoading, $window) {
        $ionicLoading.show({
            template: 'Loading...'
        });

        $scope.refresh = function () {
            $window.location.reload(true)
        };

        $rootScope.authData = Auth.$getAuth();

        $scope.rawPanderbooFriends = [];
        $scope.rawInvitableFriends = [];
        $scope.panderbooFriends = [];
        $scope.invitableFriends = [];
        $scope.phrase = '';

        $scope.filterByPhrase = function (phrase) {
            $scope.panderbooFriends = [];
            $scope.invitableFriends = [];
            angular.forEach($scope.rawPanderbooFriends, function (friend) {
                if (friend.last_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || friend.first_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || (friend.middle_name && friend.middle_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0)) {
                    $scope.panderbooFriends.push(friend);
                }
            });
            angular.forEach($scope.rawInvitableFriends, function (friend) {
                if (friend.last_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || friend.first_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || (friend.middle_name && friend.middle_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0)) {
                    $scope.invitableFriends.push(friend);
                }
            });
        };

        if ($rootScope.authData) {
            $scope.panderbooFriendsUrl = 'https://graph.facebook.com/v2.3/me?fields=friends.limit(9999){first_name,middle_name,last_name,picture}&limit=9999&access_token=' + $rootScope.authData.facebook.accessToken;
            $scope.invitableFriendsUrl = 'https://graph.facebook.com/v2.3/me/invitable_friends?fields=id,picture,first_name,last_name,middle_name&limit=9999&access_token=' + $rootScope.authData.facebook.accessToken;
            $http.get($scope.panderbooFriendsUrl)
                .then(function (response) {
                    $scope.rawPanderbooFriends = response.data.friends.data;
                    $scope.rawPanderbooFriends.sort(function compare(a, b) {
                        if (a.last_name == b.last_name) {
                            if (a.first_name < b.first_name)
                                return -1;
                            if (a.first_name > b.first_name)
                                return 1;
                        }
                        if (a.last_name < b.last_name)
                            return -1;
                        if (a.last_name > b.last_name)
                            return 1;
                        return 0;
                    });
                    $scope.panderbooFriends = $scope.rawPanderbooFriends;
                });
            $http.get($scope.invitableFriendsUrl)
                .then(function (response) {
                    $scope.rawInvitableFriends = response.data.data;
                    $scope.rawInvitableFriends.sort(function compare(a, b) {
                        if (a.last_name == b.last_name) {
                            if (a.first_name < b.first_name)
                                return -1;
                            if (a.first_name > b.first_name)
                                return 1;
                        }
                        if (a.last_name < b.last_name)
                            return -1;
                        if (a.last_name > b.last_name)
                            return 1;
                        return 0;
                    });
                    $scope.invitableFriends = $scope.rawInvitableFriends;
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }
    })

    .controller('FriendDetailCtrl', function ($scope) {
    })

    .controller('SettingsCtrl', function ($scope, $state, $rootScope, Auth) {
        $scope.logout = function () {
            Auth.$unauth();
            $rootScope.authData = null;
            $state.go('login');
        };
    })

    .controller('LoginCtrl', function ($scope, $state, $rootScope, Auth, $cordovaOauth) {
        $scope.errors = [];

        $scope.login = function () {
            $scope.errors = [];

            if ($rootScope.isCordovaApp) {
                $cordovaOauth.facebook('867761916650124', ['user_friends']).then(function (result) {
                    Auth.$authWithOAuthToken('facebook', result.access_token).then(function (authData) {
                        $rootScope.authData = authData;
                        $state.go('tab.dash');
                    }, function (error) {
                        $scope.errors.push(error.toString());
                    });
                }, function (error) {
                    $scope.errors.push(error.toString());
                });
            } else {
                Auth.$authWithOAuthPopup('facebook', function (error, authData) {
                    if (error) {
                        $scope.errors.push(error.toString());
                    } else {
                        $rootScope.authData = authData;
                        $state.go('tab.dash');
                    }
                });
            }
        };
    });
