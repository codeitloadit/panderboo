angular.module('panderboo.controllers', ['firebase'])

    .controller('DashCtrl', function ($scope, $firebaseObject) {
        var ref = new Firebase('https://panderboo.firebaseio.com/questions/');
        $scope.questions = $firebaseObject(ref);
    })

    .controller('FriendsCtrl', function ($scope, Friends) {
        $scope.friends = Friends.all();
        $scope.remove = function (friend) {
            Friends.remove(friend);
        }
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })

    .controller('SettingsCtrl', function ($scope, $state, $rootScope) {
        var ref = new Firebase('https://panderboo.firebaseio.com');

        $scope.logout = function () {
            ref.unauth();
            $rootScope.is_authenticated = false;
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

    .controller('LoginCtrl', function ($scope, $state, $rootScope) {
        $scope.data = {};

        $scope.login = function () {
            var ref = new Firebase('https://panderboo.firebaseio.com');
            ref.authWithPassword({
                email: $scope.data.email,
                password: $scope.data.password
            }, function (error, authData) {
                if (error) {
                    console.log('Login Failed!', error);
                } else {
                    $rootScope.is_authenticated = true;
                    $state.go('tab.dash');
                }
            });
        };
    })

    .controller('RegisterCtrl', function ($scope) {
        $scope.data = {};

        $scope.register = function () {
            var ref = new Firebase('https://panderboo.firebaseio.com');
            ref.createUser({
                email: $scope.data.email,
                password: $scope.data.password
            }, function (error, userData) {
                if (error) {
                    console.log('Error creating user:', error);
                } else {
                    console.log('Successfully created user account with uid:', userData.uid);
                }
            });
        };
    });
