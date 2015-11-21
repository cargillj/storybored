// ForgotModalController.js

(function() {
  'use strict';

  angular
  .module('sbApp')
  .controller('ForgotModalController', ForgotModalController);

  ForgotModalController.$inject = ['$scope', '$uibModalInstance', 'UserService'];
  function ForgotModalController($scope, $uibModalInstance, UserService) { 
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }

    $scope.submit = function(email) {
      UserService.Forgotten(email)
        .then(function(response) {
          if(response.data.success) {
            if(response.data.exists) {
              $scope.forgotFormSuccess = true;
              $scope.forgotFormError = false;
              $scope.message = "an email has been sent to "+email+".";
            } else {
              $scope.forgotFormSuccess = false;
              $scope.forgotFormError = true;
              $scope.message = "there is no user associated with the email you provided.";
            }
          } else {
            $scope.forgotFormSuccess = false;
            $scope.forgotFormError = true;
            $scope.message = "there was an error sending an email to " +email+".";
          }
        });
    }
  }
})();