(function (angular) {
  'use strict';

  angular.module('ngCollection')
    .directive('textareaMarker', textareaMarker);

  textareaMarker.$inject = ['$window', '$parse', '$timeout'];
  function textareaMarker($window, $parse, $timeout) {
    var directive = {
      compile: compile,
      restrict: 'A'
    };
    return directive;

    function compile(tElement, tAttributes, transcludeFn) {
      return {
        pre: function preLink(scope, $element, attributes, controller, transcludeFn) {
         
        },
        post: function postLink(scope, $element, attributes, controller, transcludeFn) {
          var element = $element[0],
            wrapper = $('<div class="textarea-marker-wrapper"></div>')[0],
            canvas = $('<div class="textarea-marker-canvas textarea-marker-control"></div>')[0];

          // Listen to model change one time only, just to highlight words when page loads:
          var unregister = scope.$watch(attributes.ngModel, function (newVal, oldVal) {
            if (newVal) {
              // Override styles of elements:
              _setStyle();

              // Add component to DOM:
              _buildDirective();

              // Register all event handlers
              _registerEventHandlars();

              // Highlight words:
              _highlightWords();

              // Unregister this watcher:
              unregister();
            }
          });

          function _buildDirective() {
            // Wrap input or textarea:
            $element.wrap(wrapper);
            $element.parent().prepend(canvas);
          }

          function _setStyle() {
            // Set style of wrapper:
            copyStyle(element, wrapper, ['backgroundColor', 'height', 'width']);

            // Set style of canvas:
            copyStyle(element, canvas, ['fontFamily', 'fontSize', 'lineHeight', 'paddingLeft', 'paddingRight', 'paddingBottom', 'paddingTop', 'marginLeft', 'marginRight', 'marginBottom', 'marginTop',
              'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth', 'borderLeftStyle', 'borderRightStyle', 'borderTopStyle', 'borderBottomStyle', 'overflowX', 'overflowY', 'minHeight']);
            canvas.style.borderColor = 'transparent';

            // Set style of control:
            element.classList.add('textarea-marker-control');
            element.style.backgroundColor = 'transparent';
          }

          // Copies a set of styles from one element to another.
          function copyStyle(source, dest, properties) {
            var computed = window.getComputedStyle(source, null);
            for (var i = computed.length; i--;) {
              var property = camelize(computed[i]);
              if (properties.indexOf(property) > -1) {
                dest.style[property] = computed[property];
              }
            }

            function camelize(text) {
              return text.replace(/-+(.)?/g, function (match, chr) {
                return chr ? chr.toUpperCase() : '';
              });
            }
          }

          function _registerEventHandlars() {
            // Listen to control scroll event:
            element.addEventListener('scroll', function (evt) {
                canvas.scrollTop = evt.target.scrollTop;
                canvas.scrollLeft = evt.target.scrollLeft;
            }, false);

            // Listen to typing:
            element.addEventListener('keyup', function (evt) {
              _highlightWords();
            }, false);
          }

          function _highlightWords() {
            // Update canvas on every change in content & highlight words:
            if (attributes.textareaMarker.length) {
              try {
                var words = $parse(attributes.textareaMarker)(scope);

                if (words && words.length > 0) {
                  var strContent = element.value;

                  if (strContent && strContent.length) {
                    words.forEach(function (word) {
                      var re = new RegExp('(' + word + ')', 'ig');

                      strContent = strContent.replace(re, '<mark>$1</mark>');
                    });
                  }
                  canvas.innerHTML = strContent.replace(/\r?\n/g, '<br />') + (element.scrollHeight > element.clientHeight ? '<br /><br />' : '');
                }
              }
              catch (e) {
                throw new Error('Words array is not valid');
              }
            }
          }
        }
      };
    }
  }

})(window.angular);
