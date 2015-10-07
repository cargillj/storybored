// RegisterController.js

(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', 'AuthenticationService', 'UserService'];
  function RegisterController($location, AuthenticationService, UserService) {
    var vm = this;
    vm.register = register;

    function register() {
      UserService.Create(vm.user)
        .then(function(response) {
          if(response.data.success) {
            console.log("Registration success");
            AuthenticationService.Login(vm.user.username, vm.user.password, function (response) {
              if (response.success) {
                $('#registerModal').modal('hide');
                $('#loginModal').modal('show');
              } else {
                console.log("authentication failure " + vm.user.username);
                FlashService.Error(response.message);
                vm.dataLoading = false;
              }
            });
          } else {
            vm.error = true;
            switch(response.data.err.code) {
              case '23505':
                vm.message = "the username you chose is already in use."
                break;
              default: 
                vm.message = "there was an error creating your user.";
                break;
            }
          }
        });
    }
  }
})();