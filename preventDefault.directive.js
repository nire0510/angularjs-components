(function (angular) {
	'use strict';

  angular.module('ngCollection')
  	.directive('preventDefault', PreventDefault);
  	
  function PreventDefault () {
    var directive = {
      restrict: 'A',
      link: _link
    };
    
    return directive;
    
    function _link (scope, element) {
			element.bind('click', function (event) {
				event.preventDefault();
			});
		}
  }
})(window.angular);
