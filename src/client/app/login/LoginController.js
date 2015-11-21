// LoginController.js

(function() {
  'use strict';

  angular
  .module('sbApp')
  .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$location', '$window', '$uibModal', 'AuthenticationService', 'UserService'];
  function LoginController($scope, $location, $window, $uibModal, AuthenticationService, UserService) { 
    var vm = this;
    vm.login = login;

    $scope.open = function() {  
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'forgotModal.html',
        controller: 'ForgotModalController'
      });
    }

    function login() {
      AuthenticationService.Login(vm.username, vm.password, function (response) {
        if (response.success) {
          $window.sessionStorage.token = response.token;
          console.log("authentication success for " + vm.username);
          // Get user info
          UserService.GetByUsername(vm.username)
            .then(function(response) {
              if(response.data.success) {
                console.log("User query successful");
                AuthenticationService.SetCredentials(response.data.user);
                $location.path('/dashboard');
              } else {
                console.log("User query unsuccessful");
                AuthenticationService.ClearCredentials();
                $location.path('/');
              }
            });
        } else {
          console.log("authentication failure " + vm.username);
          delete $window.sessionStorage.token;
          vm.error = true;
        }
     });
    }
  }
})();



