(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$rootScope', '$scope', '$location', '$cookies', 'UserService', 'AuthenticationService', 'Upload', '$http'];
  function DashboardController($rootScope, $scope, $location, $cookies, UserService, AuthenticationService, Upload, $http) {
    var vm = this;
    vm.deleteUser = deleteUser;
    vm.changeInfo = changeInfo;
    vm.changeUsername = changeUsername;
    vm.changePassword = changePassword;
    vm.onFileSubmit = onFileSubmit;

    function deleteUser() {
      if (confirm("Delete " + $rootScope.globals.currentUser.username + "?")) {
        UserService.Delete($rootScope.globals.currentUser.user_id)
          .then(function(response) {
            if(response.data.success) {
              console.log("User deletion successful");
              AuthenticationService.ClearCredentials();
              $location.path('/')
            } else {
              console.log("User deletion unsuccessful");
            }
          });
      }
    }
    function changeInfo(info) {
      if(confirm("Change user info?")) {
        info.id = $rootScope.globals.currentUser.user_id;
        UserService.UpdateInfo(info)
          .then(function(response) {
            if(response.data.success) {
              vm.infoFormSuccess = true;
              vm.infoFormError = false;
              console.log("User update successful");
              var user = $.extend({}, $rootScope.globals.currentUser);
              user.first_name = info.first_name;
              user.last_name = info.last_name;
              user.email = info.email; 
              AuthenticationService.SetCredentials(user);
              // $rootScope.globals = JSON.parse($cookies.get('globals'));
            } else {
              vm.infoFormSuccess = false;
              vm.infoFormError = true;
              console.log("User info update unsuccessful");
            }
          });
      }
    }

    function changeUsername(username, isValid) {
      if(isValid) {
        if(confirm("Change username?")) {
          var data = {};
          data.username = username;
          data.id = $rootScope.globals.currentUser.user_id;
          UserService.UpdateUsername(data)
            .then(function(response) {
              if(response.data.success) {
                vm.usernameFormSuccess = true;
                vm.usernameFormError=false;
                console.log("Username update successful");
                var user = $.extend({}, $rootScope.globals.currentUser);
                user.username = username;
                AuthenticationService.SetCredentials(user);
              } else {
                vm.usernameFormSuccess = false;
                vm.usernameFormError = true;
                console.log("Username update unsuccessful");
              }
            });
        } else {
          vm.usernameFormError = true;
          console.log("Bad username");
        }
      }
    }

    function changePassword(data) {
      if(confirm("Change password?")) {
        data.user_id = $rootScope.globals.currentUser.user_id;
        UserService.UpdatePassword(data)
          .then(function(response) {
            if(response.data.success) {
              vm.passwordFormSuccess = true;
              vm.passwordFormError = false;
              console.log("Password update successful");
            } else {
              vm.passwordFormSuccess = false;
              vm.passwordFormError = true;
              console.log("Password update unsuccessful");
            }
          });
      } 
    }

    function onFileSubmit(image) {
      if (angular.isArray(image)) {
        image = image[0];
      }
      var user_id = $rootScope.globals.currentUser.user_id;
      UserService.UploadProfile(image, user_id)
      .then(function(response){
        if(response.data.success) {
          vm.profileFormSuccess = true;
          vm.profileFormError = false;
          var user = $.extend({}, $rootScope.globals.currentUser);
          var extension = image.name.substring(image.name.lastIndexOf('.'));
          user.profile_img = "img/profiles/"+user_id+extension;
          AuthenticationService.SetCredentials(user);
        } else {
          vm.profileFormSuccess = false;
          vm.profileFormError = true;
          console.log(response.data.err);
        }
      });
    }
  }
})();