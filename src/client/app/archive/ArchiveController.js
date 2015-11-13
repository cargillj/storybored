(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('ArchiveController', ArchiveController);

  ArchiveController.$inject = ['ArticleService'];
  function ArchiveController(ArticleService) {
    var vm = this;
    vm.search = search;

    function search(textsearch, username, order) {
      var search_params = {};
      search_params.textsearch = "";
      search_params.username = "";
      search_params.order = "order=DESC";

      if(textsearch) {
        search_params.textsearch = "textsearch="+encodeURIComponent(textsearch);
      }
      if(username) {
        search_params.username = "username="+username;
      }
      if(order) {
        switch(order) {
          case 'Date Asc.':
            search_params.order = 'order=ASC';
            break;
          case 'Date Desc.':
            search_params.order = 'order=DESC';
            break;
          default:
            break;
        }
      }
      ArticleService.GetArchive(search_params)
        .then(function(response) {
          if(response.data.success) {
            vm.success = true;
            vm.error = false;
            vm.articles = response.data.articles;
            vm.count = response.data.count;
          } else {
            vm.success = false;
            vm.error = true;
            console.log(response.data.message);
          }
        });
      var num_pages = count / 10;
    }

    // initial query
    ArticleService.GetRecentArticles(10)
      .then(function(response) {
        if(response.data.success) {
          vm.success = true;
          vm.error = false;
          vm.articles = response.data.articles;
        } else {
          vm.success = false;
          vm.error = true;
        }
      });
  }
})();