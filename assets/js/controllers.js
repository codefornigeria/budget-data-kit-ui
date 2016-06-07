angular.module('app.controllers', [])
  
.controller('appCtrl', function($scope, Restangular, $state) {
	// console.log('Here')
	$scope.search = function() {
		// console.log("works")
    	if ($scope.searchKeyword){
    		$state.go('results', {keyword: $scope.searchKeyword});
    	}
    }
})

.controller('resultCtrl', function($scope, Restangular, $state, $stateParams) {
	$scope.searchKeyword = $stateParams.keyword;

    $scope.search = function() {
    	if ($scope.searchKeyword){
    		$state.go('results', {keyword: $scope.searchKeyword});
    		console.log($stateParams);
    	}
    }

    $scope.showResult = function() {
        $scope.overlay = true;
    }

    $scope.close = function() {
        $scope.overlay = false;
    }
})