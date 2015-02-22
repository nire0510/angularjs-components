(function (angular) {
	'use strict';

	angular.module('ngCollection')
	  .directive('infiniteScroll', ['$timeout', InfiniteScroll]);

	function InfiniteScroll($timeout) {
		return {
			restrict: 'A',
			scope: {
				loadMore: '&',
				scrollThreshold: '@',
				timeThreshold: '@'
			},
			link: function (scope, elem) {
				var item = elem[0],
					intScrollThreshold = parseInt(scope.scrollThreshold) || 200,
					intTimeThreshold = parseInt(scope.timeThreshold) || 300,
					intScrollRemain,
					intLastRemaining = 9999,
					promise = null,
					intScrollTop = 0;

				// Listen to document scroll event:
				angular.element(document).bind('scroll', function () {
					intScrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
					// Check how much scroll bottom left:
					intScrollRemain = document.body.scrollHeight - (intScrollTop + document.body.offsetHeight);

					// Check if scrollbar position is below the threshold:
					if (intScrollRemain < intScrollThreshold && (intScrollRemain - intLastRemaining) < 0) {
						// Debounce for better performance:
						if (promise !== null) {
							$timeout.cancel(promise);
						}
						// Call load more:
						promise = $timeout(function () {
							scope.$apply(scope.loadMore);
							promise = null;
						}, intTimeThreshold);
					}
					intLastRemaining = intScrollRemain;
				});
			}
		};
	}
})(window.angular);
