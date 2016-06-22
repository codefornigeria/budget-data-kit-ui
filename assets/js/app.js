
angular.module('app', [
    'ui.router',
    'ngAnimate',
    'restangular',
    'ui.bootstrap',
    'app.controllers'
    ])

.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider',
  function($stateProvider, $urlRouterProvider, RestangularProvider) {
      RestangularProvider.setBaseUrl('https://budget-datakit-api.herokuapp.com/');

      RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
          if (data.response && data.response.data) {
              var returnedData = data.response.data;
              return returnedData;
          } else {
              return data;
          };
      });
      
      $stateProvider
      .state('home', {
        url: '',
        templateUrl: 'modules/home.html',
        controller: 'appCtrl'
    })
      .state('results', {
          url: '/search?query',
          templateUrl: 'modules/search-result.html',
          controller: 'resultCtrl'
      })  

      $urlRouterProvider.otherwise('/404')  
  }])

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