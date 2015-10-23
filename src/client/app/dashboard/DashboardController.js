(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$location', 'AuthenticationService'];
  function DashboardController($location, AuthenticationService) {
    var vm = this;
    vm.logout = logout;

    function logout() {
      AuthenticationService.ClearCredentials();
      $location.path('/login');
    }
  }
})();