(function() {
  'use strict';

  angular
    .module('sbApp')
    .controller('ArchiveController', ArchiveController);

  ArchiveController.$inject = ['$scope', 'ArticleService'];
  function ArchiveController($scope, ArticleService) {
    $scope.$emit('newPageLoaded', {
      'title': 'StoryBored - Archive',
      'type': 'website',
      'description': 'StoryBored aims to provide an original, current, and unbiased take on pop-culture phenomena such as movies, television, comics, and music.',
      'img': 'http://storybored.news/img/storybored.jpg',
      'url': 'http://storybored.news/archive'
    });
    var vm = this;
    vm.currentPage = 1;
    vm.articlesPerPage = 5;
    vm.lower = vm.articlesPerPage*(vm.currentPage-1)+1;
    vm.upper = vm.articlesPerPage*(vm.currentPage);
    vm.search = search;
    vm.pageChanged = pageChanged;
    vm.max = 5;
    vm.isReadonly = true;

    function search(textsearch, username, order) {
      // check if we are doing a new search
      if(!vm.currentSearch) {
        vm.currentSearch = {};
      }
      else if(vm.currentSearch.textsearch != textsearch || vm.currentSearch.username != username || vm.currentSearch.order != order) {
        vm.currentPage = 1;
      }
      vm.currentSearch.textsearch = textsearch;
      vm.currentSearch.username = username;
      vm.currentSearch.order = order;
      var search_params = {};
      search_params.textsearch = "";
      search_params.username = "";
      search_params.order = "order=DESC";
      search_params.limit = "limit="+vm.articlesPerPage;
      search_params.offset = "offset="+vm.articlesPerPage * (vm.currentPage - 1);
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
            vm.num_pages = vm.count / vm.articlesPerPage;
            vm.lower = vm.articlesPerPage*(vm.currentPage-1)+1;
            if(Math.ceil(vm.count / vm.articlesPerPage) == 1) {
              vm.upper = vm.lower + (vm.count % vm.articlesPerPage) - 1;
            } else {
              vm.upper = vm.articlesPerPage*(vm.currentPage);
            }
          } else {
            vm.success = false;
            vm.error = true;
            console.log(response.data.message);
          }
        });
      vm.num_pages = vm.count / vm.articlesPerPage;
    }

    function pageChanged() {
      search(vm.textsearch, vm.author, vm.order);
      vm.lower = vm.articlesPerPage*(vm.currentPage-1)+1;
      // in case we're on the last page
      if(vm.currentPage == Math.ceil(vm.count / vm.articlesPerPage)) {
        vm.upper = vm.lower + (vm.count % vm.articlesPerPage) - 1;
      }
      else {
        vm.upper = vm.articlesPerPage*(vm.currentPage);
      }
    }

    // initial query
    ArticleService.GetRecentArticles(vm.articlesPerPage)
      .then(function(response) {
        if(response.data.success) {
          vm.success = true;
          vm.error = false;
          vm.articles = response.data.articles;
          vm.count = response.data.count;
          vm.num_pages = vm.count / vm.articlesPerPage;
        } else {
          vm.success = false;
          vm.error = true;
        }
      });
  }
})();