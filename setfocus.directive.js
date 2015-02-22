(function(angular) {
  'use strict';

  angular
    .module('ngCollection')
    .directive('setFocus', setFocus);

  setFocus.$inject = ['$timeout'];

  function setFocus ($timeout) {
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link($scope, $element, attrs) {
      $scope.$watch(attrs.setFocus, function(isFocused) {
        if(isFocused === true) {
          $timeout(function() {
            $element.focus();
          },50);
        }
      });
    }
  }

})(window.angular);
