  angular.module('app.controllers', [])

.factory('API', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
         RestangularConfigurer.setBaseUrl('https://sahara-datakit-api.herokuapp.com/');
    });
 }])
.controller('appCtrl', function($scope, Restangular, $state, $stateParams,$feathers) {

     var schemeService = $feathers.service('schemes')
      schemeService.find({
        query:{

        }
      }).then(function(schemes){
        if(schemes.data.length){
          $scope.schemes  =schemes.data
        }
      })
    Restangular.all('project').getList().then(function(response){

        $scope.projects = response;
    })

    Restangular.all('person').getList().then(function(response){
        $scope.persons = response;
        console.log(response.plain())
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
          var schemeService = $feathers.service('schemes')
           schemeService.find({
             query:{
                $text: { $search: $scope.searchKeyword },
                $populate:'sectors' }
           }).then(function(schemes){
          //   console.log('showing search schemes',schemes)
             if(schemes.data.length){
               $scope.total = schemes.total
               $scope.schemes  =schemes.data
               $scope.notFound = false
             }
           }).catch(function(err){
             $scope.error = err
           })

            // Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
            //     $scope.results = response;
            //     $scope.persons = $scope.results.person;
            //     $scope.projects = $scope.results.project;
            //     $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
            //  }, function(error){
            //     $scope.error = error;
            // })

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

.controller('resultCtrl', function($scope, Restangular, $state, $stateParams,$feathers) {
	$scope.searchKeyword = $stateParams.query;
  console.log($scope)
    $scope.search = function() {

    	if ($scope.searchKeyword){
          //  $state.go('results', {query: $scope.searchKeyword})
             $scope.searching = true;
            var schemeService = $feathers.service('schemes')
             schemeService.find({
               query:{
                  $text: { $search: $scope.searchKeyword },
                  $populate:'sectors' }
             }).then(function(schemes){
               console.log('showing search schemes',schemes)

               if(schemes.data.length){
                 $scope.$apply(function () {
                   $scope.searching = false;

                   $scope.total = schemes.total
                   $scope.schemes  =schemes.data
                   $scope.notFound = false
             });


                    // console.log($scope)
               }
             }).catch(function(err){
               $scope.error = err
             })


    		// Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
        //         $scope.searching = false;
        //         if (response.person == '' && response.project == '') {
        //             $scope.notFound = true;
        //         } else {
        //             $scope.results = response;
        //             $scope.persons = $scope.results.person;
        //             console.log($scope.persons)
        //             $scope.projects = $scope.results.project;
        //             $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
        //         }
        //      }, function(error){
        //         $scope.searching = false;
        //         $scope.error = error;
        //     });
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
                $scope.contracts = response.projects;
                $scope.total =  $scope.contracts.length;
             }, function(error){
                $scope.searching = false;
                $scope.error = error;
                console.log(error)
            });
        }
    }

    $scope.viewEntity();


    $scope.compare = function (contract) {
        $scope.compareProjects = true;
        $scope.contract = contract;
    }

    $scope.compareProject = function () {
        $scope.closeModal();
        $scope.searching = true;
        console.log($scope.contract);
        Restangular.one('project', $scope.contract.id).get({category: $scope.category})
            .then(function (response) {
                $scope.searching = false;
                $scope.showComparison = true;
                $scope.similarProjects = response.relatedProjects;
        })
    }

    $scope.closeComparison = function () {
        $scope.showComparison = false;
    }
    $scope.closeModal = function () {
        $scope.compareProjects = false;
    }
})

.controller('compareCtrl', function ($scope, Restangular, $state, $stateParams) {
    Restangular.one('project').get({matched: false}).then(function(response) {
        $scope.projects = response;
    })

    $scope.selectProject = function () {
        $scope.project = $scope.match.project.district.state.id;
        Restangular.one('person').get({state: $scope.project}).then(function (response) {
            $scope.persons = response;
        }, function(error){
        })
    }

    $scope.matchProject = function () {
        $scope.match.project = $scope.match.project.id;
        $scope.match.person = $scope.match.person.id;
        // console.log($scope.match)
        Restangular.all('match-project').post($scope.match).then(function (response) {
            console.log('matched')
            $state.reload();
        })
    }
})
