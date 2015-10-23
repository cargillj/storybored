(function () {
  'use strict';

  angular
    .module('sbApp')
    .factory('ArticleService', ArticleService);

  ArticleService.$inject = ['$http', 'Upload'];
  function ArticleService($http, Upload) {
    var service = {};
    service.Create = Create;
    service.GetArticleById = GetArticleById;
    service.GetTints = GetTints;
    service.GetRecentArticles = GetRecentArticles;
  
    return service;
    
    // Create an article
    function Create(article) {
      return $http.post('/api/articles', article).then(handleSuccess, handleError('Error posting article'));
    }

    // Get an article
    function GetArticleById(article_id) {
      return $http.get('/api/public/articles/'+article_id).then(handleSuccess, handleError('Error getting article'));
    }

    // Get n recent articles for lists (title, byline, img, writer, date, article_id)
    function GetRecentArticles(n) {
      return $http.get('/api/public/articles/recent/'+n).then(handleSuccess, handleError('Error getting recent articles'));
    }

    // Get an array of possible image tints
    function GetTints() {
      return $http.get('/api/public/articles/tints').then(handleSuccess, handleError('Error getting tints'));
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