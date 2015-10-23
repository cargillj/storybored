// HomeController.js

(function() {
  'use strict';

  angular
  .module('sbApp')
  .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'ArticleService'];
  function HomeController($scope, ArticleService) { 
    var vm = this;

    ArticleService.GetRecentArticles(6)
      .then(function(response) {
        if(response.data.success) {
          vm.articles = response.data.articles;
          vm.grid_widths = [12, 6, 6, 4, 4, 4];
        } else {
          console.log(response.data.message);
        }
      });
  }
})();