// authentication.service.js

(function () {
    'use strict';

    angular
        .module('sbApp')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', 'UserService'];
    function AuthenticationService($http, $cookies, $rootScope, UserService) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, callback) {

            $http.post('/authenticate', { username: username, password: password })
               .success(function (response) {
                   callback(response);
               });
        }

        function SetCredentials(user) {
            $rootScope.globals = {
                currentUser: user
            };
            var cookie = $rootScope.globals;

            $cookies.put('globals', JSON.stringify(cookie));
            $rootScope.globals.currentUser = user;
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
        }
    }
})();