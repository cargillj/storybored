(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('CloudinaryController', CloudinaryController);

  CloudinaryController.$inject = ['$scope', '$http', 'Upload', 'CloudinaryService'];
  function CloudinaryController($scope, $http, Upload, CloudinaryService) {
    var vm = this;
    vm.files = [];
    vm.folder = "";
    vm.folder_url = "";
    vm.uploadFiles = uploadFiles;
    $scope.$watch('vm.folder', function(current) {
      vm.folder_url = encodeURIComponent(current);
    });

    function uploadFiles(files, folder) {
      CloudinaryService.UploadImages(files, folder)
        .then(function(response) {
          if(response.data.success) {
            vm.cloudinaryFormSuccess = true;
            vm.cloudinaryFormError = false;
          } else {
            vm.cloudinaryFormSuccess = false;
            vm.cloudinaryFormError = true;
          }
        });
    }
  }
})();