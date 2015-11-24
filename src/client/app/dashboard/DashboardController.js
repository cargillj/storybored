(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$location', '$scope', '$rootScope', 'AuthenticationService', 'ArticleService'];
  function DashboardController($location, $scope, $rootScope, AuthenticationService, ArticleService) {
    $scope.$emit('newPageLoaded', {
      'title': 'StoryBored - Dashboard',
      'type': 'website',
      'description': 'StoryBored aims to provide an original, current, and unbiased take on pop-culture phenomena such as movies, television, comics, and music.',
      'img': 'http://storybored.news/img/storybored.jpg',
      'url': 'http://storybored.news/dashboard'
    });
    var vm = this;
    vm.logout = logout;

    function logout() {
      AuthenticationService.ClearCredentials();
      $location.path('/login');
    }

    ArticleService.GetTints()
      .then(function(response) {
        if(response.data.success) {
          $rootScope.tints = response.data.tints;
        }
        else {
          console.log(response);
          console.log("error getting tint array");
        }
      });

      $rootScope.getTitles = function() {
        ArticleService.GetTitles($rootScope.globals.currentUser.username)
        .then(function(response) {
          if(response.data.success) {
            $scope.titles = response.data.titles;
          }
          else {
            console.log("error getting titles");
          }
        });
    }
  }
})();