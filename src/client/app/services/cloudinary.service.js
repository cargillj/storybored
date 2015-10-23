(function () {
  'use strict';

  angular
    .module('sbApp')
    .factory('CloudinaryService', CloudinaryService);

  CloudinaryService.$inject = ['$http', 'Upload'];
  function CloudinaryService($http, Upload) {
    var service = {};

    service.UploadImages = UploadImages;

    return service;

    function UploadImages(files, folder) {
      return Upload.upload({
        url: '/api/cloudinary/'+folder,
        method: 'POST',
        file: files
      }).then(handleSuccess, handleError("Error uploading to cloudinary"));
    }

    // Private functions

    function handleSuccess(data) {
      return data;
    }

    function handleError(error) {
      return function () {
        return { data: { success: false, message: error } };
      };
    }
  }
})();