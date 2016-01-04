(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('ArticleController', ArticleController);

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function(code, lang) {
      if(lang) {
        return hljs.highlight(lang, code).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    }
  });

  ArticleController.$inject = ['$scope', '$routeParams', 'ArticleService'];
  function ArticleController($scope, $routeParams, ArticleService) {
    var article_id = $routeParams.article_id;
    var vm = this;
    vm.disqusShortname = "storybored";
    vm.disqusId = article_id;
    vm.disqusUrl = "http://storybored.news/articles/"+article_id;
    vm.max = 5;
    vm.isReadonly = true;

    ArticleService.GetArticleById(article_id)
      .then(function(response) {
        if(response.data.success) {
          vm.img = response.data.article.img;
          $('.ratio').css("background-image", 'url("'+vm.img+'")');
          vm.title = response.data.article.title;
          vm.byline = response.data.article.byline;
          vm.body = marked(response.data.article.body);
          vm.date = response.data.article.date;
          vm.author = response.data.article.author;
          vm.role = response.data.article.role;
          vm.rate = response.data.article.rate;
          // update metadata
          $scope.$emit('newPageLoaded', {'title': vm.title, 'description': vm.byline, 'img': vm.img, 'type': 'article', 'author': vm.author, 'url': 'http://storybored.news/articles/'+article_id});
        } else {
          console.log(response.data.message);
        }
      });
  }
})();