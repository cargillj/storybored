// article.service.js

(function () {
  'use strict';

  angular
    .module('sbApp')
    .factory('ArticleService', ArticleService);

  ArticleService.$inject = ['$http', 'Upload'];
  function ArticleService($http, Upload) {
    var service = {};
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;
    service.GetArticleById = GetArticleById;
    service.GetTints = GetTints;
    service.GetRecentArticles = GetRecentArticles;
    service.GetTitles = GetTitles;
    service.GetArchive = GetArchive;
    service.GetTitleArchive = GetTitleArchive;
  
    return service;
    
    // Create an article
    function Create(article) {
      return $http.post('/api/articles', article).then(handleSuccess, handleError('Error posting article'));
    }

    // Update an article
    function Update(article) {
      return $http.put('/api/articles', article).then(handleSuccess, handleError('Error updating article'));
    }

    // Delete an article
    function Delete(article_id) {
      return $http.delete('/api/articles/'+article_id).then(handleSuccess, handleError('Error deleting article'));
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

    // Get all article titles and their ids by username
    function GetTitles(username) {
      return $http.get('/api/public/articles/titles/'+username).then(handleSuccess, handleError('Error getting titles'));
    }

    // Search archive
    function GetArchive(search_params) {
      return $http.get('/api/public/articles/archive?'+search_params.textsearch+'&'+search_params.username+'&'+search_params.order).then(handleSuccess, handleError('Error getting archive'));
    }

    // Search archive and get titles
    function GetTitleArchive(search_params) {
      return $http.get('/api/public/articles/titles/archive?'+search_params.textsearch+'&'+search_params.username).then(handleSuccess, handleError('Error getting titles'));
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