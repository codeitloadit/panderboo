angular.module('panderboo.services', [])

    .factory('FirebaseAuth', function ($firebaseAuth) {
        return $firebaseAuth(new Firebase('https://panderboo.firebaseio.com'));
    })

    .factory('AuthData', function (FirebaseAuth) {
        var factory = {};
        factory.authData = FirebaseAuth.$getAuth();
        return factory;
    })

    .factory('Friends', function (AuthData, $http) {
        var factory = {};
        factory.phrase = '';
        function sortByLastThenFirst(a, b) {
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
        }
        factory.fetchFriends = function (callback) {
            factory.clear();
            var panderbooFriendsUrl = 'https://graph.facebook.com/v2.3/me?fields=friends.limit(9999){name,first_name,middle_name,last_name,picture}&limit=9999&access_token=' + AuthData.authData.facebook.accessToken;
            var invitableFriendsUrl = 'https://graph.facebook.com/v2.3/me/invitable_friends?fields=id,picture,name,first_name,last_name,middle_name&limit=9999&access_token=' + AuthData.authData.facebook.accessToken;
            $http.get(panderbooFriendsUrl)
                .then(function (response) {
                    factory.allPanderbooFriends = response.data.friends.data.sort(sortByLastThenFirst);
                    factory.panderbooFriends = factory.allPanderbooFriends;
                    $http.get(invitableFriendsUrl)
                        .then(function (response) {
                            factory.allInvitableFriends = response.data.data.sort(sortByLastThenFirst);
                            factory.invitableFriends = factory.allInvitableFriends;
                            return callback(factory);
                        });
                });
        };
        function filterByPhrase (friends) {
            var result = [];
            angular.forEach(friends, function (friend) {
                if (friend.last_name.toLowerCase().indexOf(factory.phrase.toLowerCase()) >= 0 || friend.first_name.toLowerCase().indexOf(factory.phrase.toLowerCase()) >= 0 || (friend.middle_name && friend.middle_name.toLowerCase().indexOf(factory.phrase.toLowerCase()) >= 0)) {
                    result.push(friend);
                }
            });
            return result;
        }
        factory.filterFriends = function () {
            factory.panderbooFriends = filterByPhrase(factory.allPanderbooFriends);
            factory.invitableFriends = filterByPhrase(factory.allInvitableFriends);
        };
        factory.clear = function () {
            factory.panderbooFriends = [];
            factory.invitableFriends = [];
            factory.phrase = '';
        };
        return factory;
    })

    .factory('Questions', function ($firebaseArray) {
        var ref = new Firebase('https://panderboo.firebaseio.com/questions');
        return $firebaseArray(ref);
    }
);