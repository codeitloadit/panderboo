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
    ]);
