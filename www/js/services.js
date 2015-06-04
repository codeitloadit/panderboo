angular.module('panderboo.services', [])

    // Re-usable factory that generates the $firebaseAuth instance
    .factory('Auth', ['$firebaseAuth',
        function ($firebaseAuth) {
            var ref = new Firebase('https://panderboo.firebaseio.com');
            return $firebaseAuth(ref);
        }
    ]);
