(function () {
	'use strict';

	angular
		.module('sbApp')
		.factory('UserService', UserService);

	UserService.$inject = ['$http', 'Upload'];
	function UserService($http, Upload) {
		var service = {};

		service.GetAll = GetAll;
		service.GetById = GetById;
		service.GetByUsername = GetByUsername;
		service.Create = Create;
		service.UpdateInfo = UpdateInfo;
		service.UpdateUsername = UpdateUsername;
		service.UpdatePassword = UpdatePassword;
    service.UploadProfile = UploadProfile;
		service.Delete = Delete;
    service.SendInvitation = SendInvitation;
    service.CheckInvitation = CheckInvitation;

		return service;

		function GetAll() {
			return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
		}

		function GetById(id) {
			return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
		}

		function GetByUsername(username) {
			return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
		}

		function Create(user) {
			return $http.post('/api/public/users', user).then(handleSuccess, handleError('Error creating user'));
		}
		
		function UpdateInfo(data) {
      return $http.put('/api/users/info/', data).then(handleSuccess, handleError('Error updating user'));
    }

    function UpdateUsername(data) {
      return $http.put('/api/users/username/', data).then(handleSuccess, handleError('Error updating user'));
    }

   	function UpdatePassword(data) {
      return $http.put('/api/users/password/', data).then(handleSuccess, handleError('Error updating user'));
    }

    function UploadProfile(image, user_id) {
    	return Upload.upload({
    		url: '/api/users/profile/'+user_id,
        method: 'PUT',
        file: image
      }).then(handleSuccess, handleError("Error uploading profile image"));
    }

		function Delete(user_id) {
			return $http.delete('/api/users/' + user_id).then(handleSuccess, handleError('Error deleting user'));
		}

    function SendInvitation(data) {
      return $http.put('/api/users/invitation/', data).then(handleSuccess, handleError('Error sending verification email'));
    }

    function CheckInvitation(key) {
      return $http.get('/api/users/invitation/'+key).then(handleSuccess, handleError('Error checking invitation'));
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