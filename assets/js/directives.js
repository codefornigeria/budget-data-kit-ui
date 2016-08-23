angular.module('app.directives', [])

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        })
    };
})

.directive('projectLoader', function () {
	return {
		template: '<div class="overlay" ng-if="!project"><div class="spinner"><div class="spinner__item1"></div><div class="spinner__item2"></div><div class="spinner__item3"></div><div class="spinner__item4"></div></div></div>'
	}
})

.directive('loader', function () {
	return {
		template: '<div class="overlay" ng-if="searching"><div class="spinner"><div class="spinner__item1"></div><div class="spinner__item2"></div><div class="spinner__item3"></div><div class="spinner__item4"></div></div></div>'
	}
})
