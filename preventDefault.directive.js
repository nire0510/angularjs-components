(function (angular) {
	'use strict';

  angular.module('ngCollection', [])
  	.directive('preventDefault', function () {
  		return {
  			restrict: 'A',
  			link: function (scope, element) {
  				element.bind('click', function (event) {
  					event.preventDefault();
  				});
  			}
  		};
  	});
})(window.angular);
