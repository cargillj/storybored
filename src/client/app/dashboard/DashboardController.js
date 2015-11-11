(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$location', '$scope', '$rootScope', 'AuthenticationService', 'ArticleService'];
  function DashboardController($location, $scope, $rootScope, AuthenticationService, ArticleService) {
    var vm = this;
    vm.logout = logout;

    function logout() {
      AuthenticationService.ClearCredentials();
      $location.path('/login');
    }

    ArticleService.GetTints()
      .then(function(response) {
        if(response.data.success) {
          $rootScope.tints = response.data.tints;
        }
        else {
          console.log(response);
          console.log("error getting tint array");
        }
      });

      $rootScope.getTitles = function() {
        ArticleService.GetTitles($rootScope.globals.currentUser.username)
        .then(function(response) {
          if(response.data.success) {
            $scope.titles = response.data.titles;
          }
          else {
            console.log("error getting titles");
          }
        });
    }
  }
})();