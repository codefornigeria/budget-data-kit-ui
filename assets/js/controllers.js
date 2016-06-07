angular.module('app.controllers', [])
  
.controller('appCtrl', function($scope, Restangular, $state, $stateParams) {
	// console.log('Here')
	$scope.search = function() {
        if ($scope.searchKeyword){
            $state.go('results', {query: $scope.searchKeyword});
        }

  //       Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
  //               $scope.results = response;
  //               console.log(response.plain())
  //            }, function(error){
  //               $scope.error = error;
  //       });
		// console.log("works")
    	
    }
})

.controller('resultCtrl', function($scope, Restangular, $state, $stateParams) {
	$scope.searchKeyword = $stateParams.query;

    $scope.search = function() {
    	if ($scope.searchKeyword){

    		Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
                $scope.results = response;
                console.log(response.plain())
             }, function(error){
                $scope.error = error;
            });
    	}
    }

    $scope.showResult = function() {
        $scope.overlay = true;
    }

    $scope.close = function() {
        $scope.overlay = false;
    }
})