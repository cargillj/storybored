// route-config.js

(function() {
  'use strict';

  angular
    .module('sbApp')
    .config(config);

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .when('/articles/:article_id', {
        templateUrl: 'views/article/article.html',
        controller: 'ArticleController',
        controllerAs: 'vm'
      });
    $locationProvider.html5Mode(true);
  }
})();