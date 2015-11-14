// HomeController.js

(function() {
  'use strict';

  angular
  .module('sbApp')
  .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'ArticleService'];
  function HomeController($scope, ArticleService) { 
    var vm = this;

    ArticleService.GetRecentArticles(5)
      .then(function(response) {
        if(response.data.success) {
          var articles = response.data.articles;
          vm.rows = [[articles[0]], [articles[1], articles[2]], [articles[3], articles[4]]];
          vm.grid_widths = [[12], [6, 6], [6, 6]];
        } else {
          console.log(response.data.message);
        }
      });
  }
})();