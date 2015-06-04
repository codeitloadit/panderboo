angular.module('panderboo.controllers', ['firebase'])

    .controller('DashCtrl', function ($scope, $firebaseObject) {
        var ref = new Firebase('https://panderboo.firebaseio.com/questions/');
        $scope.questions = $firebaseObject(ref);
    })

    .controller('FriendsCtrl', function ($scope) {
    })

    .controller('FriendDetailCtrl', function ($scope) {
    })

    .controller('SettingsCtrl', function ($scope, $state, $rootScope, Auth) {
        $scope.logout = function () {
            Auth.$unauth();
            $rootScope.authData = null;
            $state.go('anon.login');
        };

        //$scope.addQuestion = function () {
        //    var questionsRef = ref.child('questions');
        //    questionsRef.push({
        //        icon: 'ion-ios-bell',
        //        img: 'https://pbs.twimg.com/profile_images/383577663/sally_bigger.jpg',
        //        username: 'Anonymous',
        //        status: 'Unread',
        //        text: 'What time is it?',
        //        date: 'Asked of you 4 minutes ago'
        //    });
        //};
    })

    .controller('LoginCtrl', function ($scope, $state, $rootScope, Auth) {
        $scope.data = {email: 'pwntology@gmail.com', password: '1qaz'};
        $scope.errors = [];

        $scope.login = function () {
            $scope.errors = [];
            Auth.$authWithPassword({
                email: $scope.data.email,
                password: $scope.data.password
            }).then(function (authData) {
                $rootScope.authData = authData;
                $state.go('tab.dash');
            }).catch(function (error) {
                $scope.errors.push(error.toString());
            });
        };
    })

    .controller('RegisterCtrl', function ($scope, $state, $rootScope, Auth) {
        $scope.data = {};
        $scope.errors = [];

        $scope.register = function () {
            $scope.errors = [];
            Auth.$createUser({
                email: $scope.data.email,
                password: $scope.data.password
            }).then(function (userData) {
                Auth.$authWithPassword({
                    email: $scope.data.email,
                    password: $scope.data.password
                }).then(function (authData) {
                    $rootScope.authData = authData;
                    $state.go('tab.dash');
                }).catch(function (error) {
                    $scope.errors.push(error.toString());
                });
            }).catch(function (error) {
                $scope.errors.push(error.toString());
            });
        };
    });
