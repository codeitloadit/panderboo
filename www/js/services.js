angular.module('panderboo.services', [])

    .factory('FirebaseAuth', function ($firebaseAuth) {
        return $firebaseAuth(new Firebase('https://panderboo.firebaseio.com'));
    })

    .factory('AuthData', function (FirebaseAuth) {
        var factory = {};
        factory.authData = FirebaseAuth.$getAuth();
        factory.unauth = function () {
            FirebaseAuth.$unauth();
        };
        return factory;
    })

    .factory('Conversations', function ($firebaseArray) {
        var ref = new Firebase('https://panderboo.firebaseio.com/conversations');
        return $firebaseArray(ref);
    })

    .factory('Messages', function ($firebaseArray) {
        var ref = new Firebase('https://panderboo.firebaseio.com/messages');
        return $firebaseArray(ref);
    })

    .factory('Friends', function (AuthData, $http) {
        var factory = {};
        factory.lastFetched = 0;
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
            if (factory.lastFetched !== 0 && Date.now() - factory.lastFetched < 60 * 1000) {
                return callback(factory);
            }
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
                            factory.lastFetched = Date.now();
                            return callback(factory);
                        });
                });
        };
        function filterByPhrase(friends) {
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
            factory.lastFetched = 0;
        };
        return factory;
    });
