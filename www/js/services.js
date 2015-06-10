angular.module('panderboo.services', [])

    .factory('FirebaseAuth', ['$firebaseAuth',
        function ($firebaseAuth) {
            var ref = new Firebase('https://panderboo.firebaseio.com');
            return $firebaseAuth(ref);
        }
    ])

    .factory('AuthData', ['FirebaseAuth',
        function (FirebaseAuth) {
            var authData = FirebaseAuth.$getAuth();
            var factory = {};

            factory.accessToken = function () {
                if (authData) {
                    return authData.facebook.accessToken;
                }
            };

            factory.facebookPictureUrl = function () {
                if (authData) {
                    return authData.facebook.cachedUserProfile.picture.data.url;
                }
            };

            factory.displayName = function () {
                if (authData) {
                    return authData.facebook.displayName;
                }
            };

            factory.email = function () {
                if (authData) {
                    return authData.facebook.email;
                }
            };

            factory.get = function () {
                return authData;
            };

            factory.set = function (newAuthData) {
                authData = newAuthData;
            };

            factory.unauth = function () {
                FirebaseAuth.$unauth();
                authData = undefined;
            };

            return factory;
        }
    ])

    .factory('PanderbooFriends', ['AuthData', '$http',
        function (AuthData, $http) {
            var friends = [];
            var factory = {};

            factory.fetchFriends = function (callback) {
                var panderbooFriendsUrl = 'https://graph.facebook.com/v2.3/me?fields=friends.limit(9999){first_name,middle_name,last_name,picture}&limit=9999&access_token=' + AuthData.accessToken();
                $http.get(panderbooFriendsUrl)
                    .then(function (response) {
                        friends = response.data.friends.data;
                        friends.sort(function compare(a, b) {
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
                        return callback(friends);
                    });
            };

            factory.getFriends = function () {
                if (!friends) {
                    return factory.fetchFriends();
                }
                return friends;
            };

            return factory;
        }
    ])

    .factory('InvitableFriends', ['AuthData', '$http',
        function (AuthData, $http) {
            var friends = [];
            var factory = {};

            factory.fetchFriends = function (callback) {
                var invitableFriendsUrl = 'https://graph.facebook.com/v2.3/me/invitable_friends?fields=id,picture,first_name,last_name,middle_name&limit=9999&access_token=' + AuthData.accessToken();
                $http.get(invitableFriendsUrl)
                    .then(function (response) {
                        friends = response.data.data;
                        friends.sort(function compare(a, b) {
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
                        return callback(friends);
                    });
            };

            factory.getFriends = function () {
                if (!friends) {
                    return factory.fetchFriends();
                }
                return friends;
            };

            return factory;
        }
    ]);
