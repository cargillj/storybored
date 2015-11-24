// storybored.js

(function() {
	'use strict';

	angular
		.module('sbApp')
		.controller('indexController', indexController)
		.run(run)
		.config(interceptor);

	indexController.$inject = ['$scope', '$cookies', '$window', '$location', 'AuthenticationService'];
	function indexController($scope, $cookies, $window, $location, AuthenticationService) {
		$scope.metadata = {
			'title': 'StoryBored',
			'type': 'website',
			'description': 'StoryBored aims to provide an original, current, and unbiased take on pop-culture phenomena such as movies, television, comics, and music.',
			'img': 'img/storybored.jpg'
		};

		// whenever a controller emits a newPageLoaded event, the metadata is updated
		$scope.$on('newPageLoaded', function(event, metadata) {
			$scope.metadata = metadata;
		});

		// Check saved theme
		switch(localStorage.theme) {
			case null:
				setTheme($("#light-theme"), "light");
				localStorage.setItem("theme", "light");
				break;
			case 'dark':
				setTheme($("#light-theme"), "dark");
				break;
			default:
				setTheme($("#light-theme"), "light");
				break;
		}

		$scope.logout = function() {
      AuthenticationService.ClearCredentials();
      $location.path('/login');
    }

		$scope.toggleTheme = function() {
			var lightTheme = $("#light-theme");
			var darkTheme = $("#dark-theme");
			
			if(lightTheme.length == 0) {
				setTheme(darkTheme, "light");
			}
			else {
				setTheme(lightTheme, "dark");
			}
			// reload window to change disqus theme
			if($location.path().substring(0, $location.path().lastIndexOf('/')) == '/articles') {
				$window.location.reload();
			}
		};

		// Set style to 'light' or 'dark'
		function setTheme(theme, style) {
			var newTheme = document.createElement("link");
			newTheme.setAttribute("rel", "stylesheet");
			newTheme.setAttribute("type", "text/css");
			console.log("using "+style+" theme");
			newTheme.setAttribute("href", "css/theme."+style+".css");
			newTheme.setAttribute("id", style+"-theme");
			theme.replaceWith(newTheme);
			localStorage.setItem("theme", style);
			if(style == "dark") {
				$("#light-switch span").text('Turn lights on');
			}
			else {
				$("#light-switch span").text('Turn lights off');
			}
		}
	}
	run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
	function run($rootScope, $location, $cookies, $http) {
		// keep user logged in after page refresh
		if($cookies.get('globals')) {
			$rootScope.globals = JSON.parse($cookies.get('globals')) || {};
		} else {
			$rootScope.globals = {};
		}

		$rootScope.$on('$locationChangeStart', function (event, next, current) {
			// redirect to front page if not logged in and trying to access some thing restricted
			var restrictedPage = $.inArray($location.path(), ['/dashboard']) != -1;
			var loggedIn = $rootScope.globals.currentUser;
			if (restrictedPage && !loggedIn) {
				console.log("Restricted page, log in please");
				$location.path('/login');
			}
		});
	}

	function interceptor($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}
})();