angular.module('app.controllers', [])

.factory('API', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
         RestangularConfigurer.setBaseUrl('https://sahara-datakit-api.herokuapp.com/');
    });
 }])
  
.controller('appCtrl', function($scope, Restangular, $state, $stateParams) {
    Restangular.all('project').getList().then(function(response){
        $scope.projects = response;
    })

    Restangular.all('person').getList().then(function(response){
        $scope.persons = response;
    })
    $scope.options = {
        tooltipEvents: [],
        showTooltips: true,
        tooltipCaretSize: 0,
        onAnimationComplete: function () {
            this.showTooltip(this.segments, true);
        },
    };

    $scope.quantity = 3;

	$scope.search = function() {
        if ($scope.searchKeyword){ 
            Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
                $scope.results = response;
                $scope.persons = $scope.results.person;
                $scope.projects = $scope.results.project;
                $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
             }, function(error){
                $scope.error = error;
            })
            
            $state.go('results', {query: $scope.searchKeyword})
        }
    }

    $scope.showResult = function(person) {
        $state.go('entity', {query: person.id})
    }

    $scope.showProject = function(project) {
        Restangular.one('project', project.id).get().then(function(response){
            $scope.entity = response;
            console.log($scope.entity.plain());
        })
        $scope.projectNode = true;
    }

    $scope.close = function() {
        $scope.personNode = false;
        $scope.projectNode = false;
    }
})

.controller('resultCtrl', function($scope, Restangular, $state, $stateParams) {
	$scope.searchKeyword = $stateParams.query;

    $scope.search = function() {
    	if ($scope.searchKeyword){
            $state.go('results', {query: $scope.searchKeyword})
            $scope.searching = true;
    		Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
                $scope.searching = false;
                if (response.person == '' && response.project == '') {
                    $scope.notFound = true;
                } else {
                    $scope.results = response;
                    $scope.persons = $scope.results.person;
                    console.log($scope.persons)
                    $scope.projects = $scope.results.project;
                    $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
                }
             }, function(error){
                $scope.searching = false;
                $scope.error = error;
            });
    	}
    }

    $scope.search();

    $scope.showResult = function(person) {
        $state.go('entity', {query: person.id})
    }

    $scope.showProject = function(project) {
        Restangular.one('project', project._id).get().then(function(response){
            $scope.entity = response;
            console.log($scope.entity.plain());
        })
        $scope.projectNode = true;
    }

    $scope.close = function() {
        $scope.personNode = false;
        $scope.projectNode = false;
    }
})

.controller('entityCtrl', function($scope, Restangular, $state, $stateParams) {
    $scope.searchedEntity = $stateParams.query;

    $scope.search = function() {
        if ($scope.searchKeyword){
            $state.go('results', {query: $scope.searchKeyword})
            $scope.searching = true;
            Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
                $scope.searching = false;
                if (response.person == '' && response.project == '') {
                    $scope.notFound = true;
                } else {
                    $scope.results = response;
                    $scope.persons = $scope.results.person;
                    console.log($scope.persons)
                    $scope.projects = $scope.results.project;
                    $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
                }
             }, function(error){
                $scope.searching = false;
                $scope.error = error;
            });
        }
    }

    $scope.viewEntity = function() {
        if ($scope.searchedEntity){
            $scope.searching = true;
            Restangular.one('person', $scope.searchedEntity).get().then(function(response){
                $scope.searching = false;
                $scope.entity = response;
                $scope.searchKeyword = response.name;
                console.log($scope.entity.plain());
                $scope.contracts = response.projects;
             }, function(error){
                $scope.searching = false;
                $scope.error = error;
            });
        }
    }

    $scope.viewEntity();
})