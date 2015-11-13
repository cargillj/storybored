// authInterceptor.service.js

(function() {
  'use strict';

  angular
    .module('sbApp')
    .factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['$rootScope', '$q', '$window', '$location', '$cookies'];
  function authInterceptor($rootScope, $q, $window, $location, $cookies) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      response: function (response) {
        return response || $q.when(response);
      },
      responseError: function (response) {
        if (response.status === 401) {
          // handle the case where the user is not authenticated
          $rootScope.globals = {};
          $cookies.remove('globals');
          $location.path('/login');
          alert('Your session ran out of time, please log back in.');
        }
        return response || $q.when(response);
      }
    };
  }
})();