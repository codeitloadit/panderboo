angular.module('panderboo.controllers', ['firebase'])

    .controller('ConversationsCtrl', function ($scope, $state, $ionicLoading, $firebaseArray, AuthData, Conversations, Friends) {
        $scope.$on('$ionicView.beforeEnter', function () {
            if (!$scope.authData || $scope.authData.facebook.id != AuthData.authData.facebook.id) {
                $scope.refresh();
            }
        });
        var addFriendsToConversations = function() {
            angular.forEach($scope.conversations, function (conversation) {
                angular.forEach($scope.friends.panderbooFriends, function (friend) {
                    if (conversation.senderId == AuthData.authData.facebook.id && conversation.recipientId == friend.id) {
                        conversation.friend = friend;
                    }
                });
            });
        };
        $scope.refresh = function () {
            $ionicLoading.show();
            $scope.errors = [];
            $scope.authData = AuthData.authData;
            Friends.fetchFriends(function (friends) {
                $scope.friends = friends;
                Conversations.$loaded().then(function(conversations) {
                    $scope.conversations = conversations;
                    if ($scope.conversations.length === 0) {
                        $state.go('tab.friends');
                    }
                    addFriendsToConversations();
                    Conversations.$watch(function() {
                        addFriendsToConversations();
                    });
                    $ionicLoading.hide();
                }).catch(function(error) {
                    $scope.errors.push(error.toString());
                });
            });
        };

        $scope.tap = function (conversation) {
            if (conversation.status != 'unread' || conversation.senderId == $scope.authData.facebook.id) {
                $state.go('tab.conversation-detail', {conversationObj: angular.toJson(conversation)});
            }
        };
        $scope.doubleTap = function (conversation) {
            $state.go('tab.conversation-detail', {conversationObj: angular.toJson(conversation)});
        };
    })

    .controller('ConversationDetailCtrl', function ($scope, $stateParams, AuthData, $rootScope, $firebaseArray, $ionicScrollDelegate, Messages) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.hideTabs = true;
        });
        $scope.$on('$ionicView.beforeLeave', function () {
            $rootScope.hideTabs = false;
        });
        $scope.authData = AuthData.authData;
        $scope.conversation = angular.fromJson($stateParams.conversationObj);
        Messages.$loaded(function (messages) {
            $scope.messages = messages;
            Messages.$watch(function() {
                $ionicScrollDelegate.scrollBottom();
            });
            $ionicScrollDelegate.scrollBottom();
        });
        $scope.submitMessage = function (text) {
            if (text) {
                $scope.messages.$add({
                    text: text,
                    senderId: AuthData.authData.facebook.id,
                    conversationId: $scope.conversation.$id,
                    timestamp: Date.now(),
                    status: 'unread'
                });
                $scope.text = '';
            }
        };
    })

    .controller('FriendsCtrl', function ($scope, $state, $ionicLoading, AuthData, Friends) {
        $scope.$on('$ionicView.beforeEnter', function () {
            if (($scope.friends && $scope.friends.lastFetched === 0) || !$scope.authData || $scope.authData.facebook.id != AuthData.authData.facebook.id) {
                $scope.refresh();
            }
        });
        $scope.refresh = function () {
            $ionicLoading.show();
            $scope.authData = AuthData.authData;
            Friends.fetchFriends(function (friends) {
                $scope.friends = friends;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            });
        };
        $scope.refresh();
        $scope.loadFriend = function (friend) {
            $state.go('tab.friend-detail', {friendObj: angular.toJson(friend)});
        };
        $scope.clearSearch = function () {
            $scope.friends.phrase = '';
            $scope.friends.filterFriends();
        };
    })

    .controller('FriendDetailCtrl', function ($scope, $state, $stateParams, AuthData, Conversations, Messages) {
        $scope.authData = AuthData.authData;
        $scope.friend = angular.fromJson($stateParams.friendObj);
        $scope.conversations = Conversations;
        $scope.submitQuestion = function (text) {
            if (text) {
                var timestamp = Date.now();
                $scope.conversations.$add({
                    message: text,
                    senderId: AuthData.authData.facebook.id,
                    recipientId: $scope.friend.id,
                    timestamp: timestamp,
                    status: 'unread'
                }).then(function(ref) {
                    Messages.$add({
                        conversationId: ref.key(),
                        text: text,
                        senderId: AuthData.authData.facebook.id,
                        recipientId: $scope.friend.id,
                        timestamp: timestamp,
                        status: 'unread'
                    }).then(function() {
                        $state.go('tab.conversations');
                    });
                });
                $scope.text = '';
            }
        };

        $scope.tap = function (conversation) {
            $state.go('tab.conversation-detail', {conversationObj: angular.toJson(conversation)});
        };
    })

    .controller('SettingsCtrl', function ($scope, $state, AuthData, Friends, Conversations, Messages) {
        $scope.$on('$ionicView.beforeEnter', function () {
            if (!$scope.authData || $scope.authData.facebook.id != AuthData.authData.facebook.id) {
                $scope.authData = AuthData.authData;
            }
        });

        $scope.logout = function () {
            AuthData.unauth();
            Conversations = [];
            Messages = [];
            Friends.clear();
            $state.go('login');
        };
    })

    .controller('LoginCtrl', function ($scope, $state, AuthData, FirebaseAuth, $cordovaOauth) {
        $scope.errors = [];
        $scope.login = function () {
            $scope.errors = [];
            if (!!window.cordova) {
                $cordovaOauth.facebook('867761916650124', ['user_friends']).then(function (result) {
                    FirebaseAuth.$authWithOAuthToken('facebook', result.access_token).then(function (authData) {
                        AuthData.authData = authData;
                        $state.go('tab.conversations');
                    }, function (error) {
                        $scope.errors.push(error.toString());
                    });
                }, function (error) {
                    $scope.errors.push(error.toString());
                });
            } else {
                FirebaseAuth.$authWithOAuthPopup('facebook').then(function (authData) {
                    AuthData.authData = authData;
                    $state.go('tab.conversations');
                }, function (error) {
                    $scope.errors.push(error.toString());
                });
            }
        };
    }
);
