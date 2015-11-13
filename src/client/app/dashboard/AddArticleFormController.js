// AddArticleFormController.js

(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('AddArticleFormController', AddArticleFormController);

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

  AddArticleFormController.$inject = ['$rootScope', '$scope', '$http', 'ArticleService'];
  function AddArticleFormController($rootScope, $scope, $http, ArticleService) {
    var article = this;
    this.body = '';
    article.author = $rootScope.globals.currentUser.username;
    $scope.createArticle = createArticle;

    $scope.$watch('article.body', function(current, original) {
      $scope.htmlBody = marked(current);
    });

    $scope.$watch('article.img', function(current) {
      if(article.img) {
        $('#add.ratio').css("background-image", 'url("'+article.img+'")');
      }
    });

    function createArticle(article, isValid) {
      if(isValid) {
        article.user_id = $rootScope.globals.currentUser.user_id;
        ArticleService.Create(article)
          .then(function(response) {
            if(response.data.success) {
              $scope.articleForm.error = false;
              $scope.articleForm.success = true;
              $scope.article_id = response.data.article_id;
              $rootScope.getTitles();
            }
            else {
              $scope.articleForm.success = false;
              $scope.articleForm.error = true;
              $scope.articleForm.msg = "error posting article";
            }
          })
        
      } else {
        $scope.articleForm.success = false;
        $scope.articleForm.error = true;
        $scope.articleForm.msg = response.data.message;
      }
    }
  }
})();