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
      .when('/register', {
        templateUrl: 'views/register/register.html',
        controller: 'RegisterController',
        controllerAs: 'vm'
      })
      .when('/articles/:article_id', {
        templateUrl: 'views/article/article.html',
        controller: 'ArticleController',
        controllerAs: 'vm'
      })
      .when('/archive', {
        templateUrl: '/views/archive/archive.html',
        controller: 'ArchiveController',
        controllerAs: 'vm'
      });
    $locationProvider.html5Mode(true);
  }
})();