// storybored.js

(function() {
	'use strict';

	angular
		.module('sbApp')
		.controller('indexController', indexController)
		.run(run)
		.config(interceptor);

	indexController.$inject = ['$scope', '$cookies', '$location', 'AuthenticationService'];
	function indexController($scope, $cookies, $location, AuthenticationService) {
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

		$scope.toggleTheme = function() {
			var lightTheme = $("#light-theme");
			var darkTheme = $("#dark-theme");
			
			if(lightTheme.length == 0) {
				setTheme(darkTheme, "light");
			}
			else {
				setTheme(lightTheme, "dark");
			}
		};

		// Set style to 'light' or 'dark'
		function setTheme(theme, style) {
			var newTheme = document.createElement("link");
			newTheme.setAttribute("rel", "stylesheet");
			newTheme.setAttribute("type", "text/css");
			console.log("using "+style+" theme");
			newTheme.setAttribute("href", "static/css/theme."+style+".css");
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

		$scope.logout = function() {
			AuthenticationService.ClearCredentials();
			$location.path('/');
			console.log("logging out");
		}
	}
})();

run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
function run($rootScope, $location, $cookies, $http) {
	// keep user logged in after page refresh
	if($cookies.get('globals')) {
		$rootScope.globals = JSON.parse($cookies.get('globals')) || {};
	} else $rootScope.globals = {};

	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// redirect to front page if not logged in and trying to access some thing restricted
		var restrictedPage = $.inArray($location.path(), ['/']) === -1;
		var loggedIn = $rootScope.globals.currentUser;
		if (restrictedPage && !loggedIn) {
			console.log("Restricted page, log in please");
			$location.path('/login');
		}
	});
}

function interceptor($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor')
}