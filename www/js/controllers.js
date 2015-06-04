angular.module('panderboo.controllers', ['firebase'])

    .controller('DashCtrl', function ($scope, $firebaseObject, Auth) {
        $scope.authData = Auth.$getAuth();
        //var ref = new Firebase('https://panderboo.firebaseio.com/questions/');
        //$scope.questions = $firebaseObject(ref);
    })

    .controller('FriendsCtrl', function ($scope, Auth) {
        $scope.authData = Auth.$getAuth();
    })

    .controller('FriendDetailCtrl', function ($scope, Auth) {
        $scope.authData = Auth.$getAuth();
    })

    .controller('SettingsCtrl', function ($scope, $state, Auth) {
        $scope.authData = Auth.$getAuth();

        $scope.logout = function () {
            Auth.$unauth();
            $state.go('tab.login');
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

    .controller('LoginCtrl', function ($scope, $state, Auth) {
        $scope.authData = Auth.$getAuth();
        if ($scope.authData) {
            $state.go('tab.dash')
        }

        $scope.data = {};

        $scope.login = function () {
            console.log('Login');
            Auth.$authWithPassword({
                email: $scope.data.email,
                password: $scope.data.password
            }).then(function (authData) {
                console.log('then');
                $state.go('tab.dash');
            }).catch(function (error) {
                console.log('Login Failed!', error);
            });
        };
    })

    .controller('RegisterCtrl', function ($scope, $state, Auth) {
        $scope.authData = Auth.$getAuth();
        $scope.data = {};

        $scope.register = function () {
            Auth.$createUser({
                email: $scope.data.email,
                password: $scope.data.password
            }).then(function (userData) {
                Auth.$authWithPassword({
                    email: $scope.data.email,
                    password: $scope.data.password
                }).then(function (authData) {
                    $state.go('tab.dash');
                }).catch(function (error) {
                    console.log('Login Failed!', error);
                });
            }).catch(function (error) {
                console.log('Error creating user:', error);
            });
        };
    });
