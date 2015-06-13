angular.module('panderboo.services', [])

    .factory('FirebaseAuth', function ($firebaseAuth) {
        return $firebaseAuth(new Firebase('https://panderboo.firebaseio.com'));
    })

    .factory('AuthData', function (FirebaseAuth) {
        return FirebaseAuth.$getAuth();
    })

    .factory('Friends', function (AuthData, $http) {
        var factory = {fetched: false};
        factory.fetchFriends = function (callback) {
            var panderbooFriendsUrl = 'https://graph.facebook.com/v2.3/me?fields=friends.limit(9999){name,first_name,middle_name,last_name,picture}&limit=9999&access_token=' + AuthData.facebook.accessToken;
            $http.get(panderbooFriendsUrl)
                .then(function (response) {
                    factory.panderbooFriends = response.data.friends.data;
                    factory.panderbooFriends.sort(function compare(a, b) {
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
                    var invitableFriendsUrl = 'https://graph.facebook.com/v2.3/me/invitable_friends?fields=id,picture,name,first_name,last_name,middle_name&limit=9999&access_token=' + AuthData.facebook.accessToken;
                    $http.get(invitableFriendsUrl)
                        .then(function (response) {
                            factory.invitableFriends = response.data.data;
                            factory.invitableFriends.sort(function compare(a, b) {
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
                            factory.fetched = true;
                            return callback(factory);
                        });
                });
        };
        factory.clear = function () {
            factory.panderbooFriends = {};
            factory.invitableFriends = {};
            factory.fetched = false;
        };
        return factory;
    })

    .factory('Questions', function ($firebaseArray) {
        var ref = new Firebase('https://panderboo.firebaseio.com/questions');
        return $firebaseArray(ref);
    });
