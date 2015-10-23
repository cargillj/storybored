// ArticleFormController.js

(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('ArticleFormController', ArticleFormController);

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

  ArticleFormController.$inject = ['$rootScope', '$scope', '$http', 'ArticleService'];
  function ArticleFormController($rootScope, $scope, $http, ArticleService) {
    var article = this;
    this.body = '';
    $scope.createArticle = createArticle;

    $scope.$watch('article.body', function(current, original) {
      $scope.htmlBody = marked(current);
    });

    ArticleService.GetTints()
      .then(function(response) {
        if(response.data.success) {
          $scope.tints = response.data.tints;
        }
        else {
          console.log(response);
          console.log("error getting tint array");
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
            }
            else {
              $scope.articleForm.success = false;
              $scope.articleForm.error = true;
              $scope.articleForm.msg = response.data.message;
            }
          })
        
      } else {
        $scope.articleForm.success = false;
        $scope.articleForm.error = true;
        $scope.articleForm.msg = "your form is invalid."
      }
    }
  }
})();