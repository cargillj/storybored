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
    vm.uploadFiles = uploadFiles;

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