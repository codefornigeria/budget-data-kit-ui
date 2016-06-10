angular.module('app.controllers', [])

.factory('API', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
         RestangularConfigurer.setBaseUrl('https://sahara-datakit-api.herokuapp.com/');
    });
 }])
  
.controller('appCtrl', function($scope, Restangular, $state, $stateParams) {
	// console.log('Here')
	$scope.search = function() {
        if ($scope.searchKeyword){ 
            Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
                $scope.results = response;

                $scope.persons = $scope.results.person;
                $scope.projects = $scope.results.project;
                $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
                // console.log($scope.results.plain())
             }, function(error){
                $scope.error = error;
            })
            
            $state.go('results', {query: $scope.searchKeyword})
        }
    }
})

.controller('resultCtrl', function($scope, Restangular, $state, $stateParams) {
	$scope.searchKeyword = $stateParams.query;

    $scope.search = function() {
    	if ($scope.searchKeyword){
            $scope.searching = true;
    		Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
                $scope.searching = false;
                if (response.person == '' && response.project == '') {
                    $scope.notFound = true;
                } else {
                    $scope.results = response;
                    $scope.persons = $scope.results.person;
                    $scope.projects = $scope.results.project;
                    $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
                }
                
                // console.log($scope.results.plain())
             }, function(error){
                $scope.searching = false;
                $scope.error = error;
            });
    	}
    }

    $scope.search();

    $scope.showResult = function(person) {
        // console.log(person)
        Restangular.one('person', person.id).get().then(function(response){
            console.log(response.plain())
            $scope.entity = response;
            $scope.contracts = response.projects;
        })
        $scope.overlay = true;
    }

    $scope.showProject = function(project) {
        // console.log(project)
        Restangular.one('project', project._id).get().then(function(response){
            // console.log(response.plain())

        })
        $scope.overlay = true;
    }

    $scope.close = function() {
        $scope.overlay = false;
    }
})