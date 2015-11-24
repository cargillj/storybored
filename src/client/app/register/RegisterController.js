// RegisterController.js

(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', 'AuthenticationService', 'UserService'];
  function RegisterController($location, AuthenticationService, UserService) {
    $scope.$emit('newPageLoaded', {
      'title': 'StoryBored - register',
      'type': 'website',
      'description': 'StoryBored aims to provide an original, current, and unbiased take on pop-culture phenomena such as movies, television, comics, and music.',
      'img': 'http://storybored.news/img/storybored.jpg',
      'url': 'http://storybored.news/register'
    });
    var vm = this;
    vm.invKey = {};
    vm.checkKey = checkKey;
    vm.register = register;

    function checkKey(key) {
      UserService.CheckInvitation(key)
        .then(function(response) {
          if(response.data.success) {
            if(response.data.invitation) {
              vm.invKey.success = true;
              vm.invKey.error = false;
              vm.invKey.valid = true;
              vm.invKey.message = "Your invitation key is valid. Now you can create an account.";
            } else {
              console.log("invalid invitation key");
              vm.invKey.success = false;
              vm.invKey.error = true;
              vm.invKey.valid = false;
              vm.invKey.message = "the invitation key you entered is invalid";
            }
          } else {
            console.log("Error checking invitation key");
            vm.invKey.success = false;
            vm.invKey.error = true;
            vm.invKey.message = "there was an error checking your invitation key. Please make sure you are inputting the key correctly and try again.";
          }
        });
    }

    function register() {
      UserService.Create(vm.user)
        .then(function(response) {
          if(response.data.success) {
            console.log("Registration success");
            AuthenticationService.ClearCredentials();
            $location.path('/login');
          } else {
            console.log(response.data);
            vm.registerFormError = true;
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