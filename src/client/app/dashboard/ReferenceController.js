(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('ReferenceController', ReferenceController);

  ReferenceController.$inject = ['$scope', '$http'];
  function ReferenceController($scope, $http) {
    var vm = this;
  }
})();
