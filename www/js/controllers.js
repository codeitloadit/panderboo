angular.module('panderboo.controllers', ['firebase'])

    .controller('DashCtrl', function ($scope, $firebaseObject) {
        var ref = new Firebase('https://panderboo.firebaseio.com/questions/');
        $scope.questions = $firebaseObject(ref);
    })

    .controller('FriendsCtrl', function ($scope, $rootScope, $http, Auth, $ionicLoading) {
        $ionicLoading.show({
            template: 'Loading...'
        });

        $rootScope.authData = Auth.$getAuth();

        $scope.raw_friends = [];
        $scope.friends = [];

        $scope.filterByPhrase = function (phrase) {
            $scope.friends = [];
            angular.forEach($scope.raw_friends, function(friend) {
                if (friend.last_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0 || friend.first_name.toLowerCase().indexOf(phrase.toLowerCase()) >= 0) {
                    $scope.friends.push(friend);
                }
            });
        };

        if ($rootScope.authData) {
            $scope.url = 'https://graph.facebook.com/v2.3/me/invitable_friends?fields=id,picture,first_name,last_name&limit=9999&access_token=' + $rootScope.authData.facebook.accessToken;
            $http.get($scope.url)
                .then(function (response) {
                    $scope.raw_friends = response.data.data;
                    $scope.raw_friends.sort(function compare(a,b) {
                        if (a.last_name < b.last_name)
                            return -1;
                        if (a.last_name > b.last_name)
                            return 1;
                        return 0;
                    });
                    $scope.friends = $scope.raw_friends;
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
        };
    });
