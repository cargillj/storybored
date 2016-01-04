// EditArticleFormController.js

(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('EditArticleFormController', EditArticleFormController);

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

  EditArticleFormController.$inject = ['$rootScope', '$scope', '$http', 'ArticleService'];
  function EditArticleFormController($rootScope, $scope, $http, ArticleService) {
    var article = this;
    article.markdownBody = "";
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.editArticle = editArticle;
    $scope.deleteArticle = deleteArticle;
    $scope.search = "";
    var search_params = {};

    $scope.$watch('search', function(current) {
      if(!current || current.length == 0) {
        return 0;
      } else {
        search_params.textsearch = "textsearch="+encodeURIComponent(current);
        search_params.username = "username="+$rootScope.globals.currentUser.username;
        ArticleService.GetTitleArchive(search_params)
          .then(function(response) {
            if(response.data.success) {
              $scope.titles = response.data.titles;
              $scope.selectedArticle = $scope.titles[0];
              if(response.data.titles.length == 0) {
                $scope.article_search.msg = "no results";
              }
              else {
                $scope.article_search.msg = false;
              }
            }
            else {
              console.log("error getting titles");
            }
          });
      }
    });

    $scope.$watch('selectedArticle', function(current) {
      if($scope.selectedArticle) {
        ArticleService.GetArticleById($scope.selectedArticle.article_id)
          .then(function(response) {
            if(response.data.success) {
              article.article_id = response.data.article.article_id;
              article.author = response.data.article.author;
              article.title = response.data.article.title;
              article.byline = response.data.article.byline;
              article.markdownBody = response.data.article.body;
              article.img = response.data.article.img;
              article.img_tint = response.data.article.img_tint;
              $scope.articleForm.success = false;
              $scope.articleForm.error = false;
            } else {
              console.log("error getting article");
            }
          });
      }
    });

    $scope.$watch('article.markdownBody', function(current, original) {
      article.body = marked(current);
    });

    $scope.$watch('article.img', function(current) {
      if(article.img) {
        $('#edit.ratio').css("background-image", 'url("'+article.img+'")');
      }
    });
    
    function editArticle(article, isValid) {
      if(isValid) {
        var new_article = $.extend({}, article);
        new_article.body = article.markdownBody;
        delete new_article.markdownBody;
        ArticleService.Update(new_article)
          .then(function(response) {
            if(response.data.success) {
              $scope.articleForm.success = true;
              $scope.articleForm.error = false;
              $scope.articleForm.msg = "Your article has been updated";
            } else {
              $scope.articleForm.success = false;
              $scope.articleForm.error = true;
              $scope.articleForm.msg = response.data.message;
            }
          });
        
      } else {
        $scope.articleForm.success = false;
        $scope.articleForm.error = true;
        $scope.articleForm.msg = "your form is invalid."
      }
    }

    function deleteArticle(id, isValid) {
      if(isValid) {
        ArticleService.Delete(id)
          .then(function(response) {
            if(response.data.success) {
              $scope.articleForm.success = true;
              $scope.articleForm.error = false;
              $scope.articleForm.msg = "Article deleted successfully";
              $rootScope.getTitles();
              article.title = "";
              article.byline = "";
              article.markdownBody = "";
              article.img = "";
              article.author = "";
            } else {
              $scope.articleForm.success = false;
              $scope.articleForm.error = true;
              $scope.articleForm.msg = response.message;
            }
          });
      } else {
        $scope.articleForm.success = false;
        $scope.articleForm.error = true;
        $scope.articleForm.msg = "Please select an article to delete"
      }
    }
  }
})();