angular.module('panderboo.services', [])

    .factory('FirebaseAuth', function ($firebaseAuth) {
        var ref = new Firebase('https://panderboo.firebaseio.com');
        return $firebaseAuth(ref);
    })

    .factory('AuthData', function (FirebaseAuth) {
        return authData = FirebaseAuth.$getAuth();
    })

    .factory('PanderbooFriends', function (AuthData, $http) {
        var factory = {};
        factory.fetchFriends = function (callback) {
            var panderbooFriendsUrl = 'https://graph.facebook.com/v2.3/me?fields=friends.limit(9999){name,first_name,middle_name,last_name,picture}&limit=9999&access_token=' + AuthData.facebook.accessToken;
            $http.get(panderbooFriendsUrl)
                .then(function (response) {
                    factory.friends = response.data.friends.data;
                    factory.friends.sort(function compare(a, b) {
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
                    return callback(factory.friends);
                });
        };
        return factory;
    })

    .factory('InvitableFriends', function (AuthData, $http) {
        var factory = {};
        factory.fetchFriends = function (callback) {
            var invitableFriendsUrl = 'https://graph.facebook.com/v2.3/me/invitable_friends?fields=id,picture,name,first_name,last_name,middle_name&limit=9999&access_token=' + AuthData.facebook.accessToken;
            $http.get(invitableFriendsUrl)
                .then(function (response) {
                    factory.friends = response.data.data;
                    factory.friends.sort(function compare(a, b) {
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
                    return callback(factory.friends);
                });
        };
        return factory;
    })

    .factory('Questions', function ($firebaseArray) {
        var ref = new Firebase('https://panderboo.firebaseio.com/questions');
        return $firebaseArray(ref);
    });
