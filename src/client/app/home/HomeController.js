// HomeController.js

(function() {
  'use strict';

  angular
  .module('sbApp')
  .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'ArticleService'];
  function HomeController($scope, ArticleService) {
    $scope.$emit('newPageLoaded', {
      'title': 'StoryBored',
      'type': 'website',
      'description': 'StoryBored aims to provide an original, current, and unbiased take on pop-culture phenomena such as movies, television, comics, and music.',
      'img': 'http://storybored.news/img/storybored.jpg',
      'url': 'http://storybored.news'
    });
    var vm = this;

    ArticleService.GetRecentArticles(5)
      .then(function(response) {
        if(response.data.success) {
          var articles = response.data.articles;
          vm.rows = [[articles[0]], [articles[1], articles[2]], [articles[3], articles[4]]];
          vm.grid_widths_sm = [[12], [12, 12], [12, 12]];
          vm.grid_widths_md = [[12], [6, 6], [6, 6]];
        } else {
          console.log(response.data.message);
        }
      });
  }
})();
