angular.module('app.controllers', [])
  
.controller('appCtrl', function($scope, Restangular) {
	console.log('Here')

})

// .factory('MockAPI', ['Restangular', function(Restangular) {
//     return Restangular.withConfig(function(RestangularConfigurer) {
//          RestangularConfigurer.setBaseUrl('api');
//     });
//  }])

.controller('resultCtrl', function($scope, Restangular) {
	// Restangular.all('doctor').getList().then(function(response) {
		
	// 	$scope.doctors = response;
	// 	// console.log($scope.doctors.plain())
	// })

	// var inputMin = 1;
 //    $scope.search = function() {
 //    	if ($scope.doctorName && $scope.doctorName.length >= inputMin) {
 //            $scope.searching = true;
 //            Restangular.one('doctor/search').get({name: $scope.doctorName}).then(function(response){
 //                $scope.results = response;
 //                // console.log(response)
 //             }, function(error){
 //                $scope.error = error;
 //            });
 //        } else {
 //               $scope.searching = false;
 //          }     
 //    }

	// $scope.showDetail = function(result) {
	// 	$scope.information = result;
	// 	// console.log($scope.detail)
	// 	$scope.searching = false;
	// 	$scope.detail = true;
	// }

	// $scope.close = function() {
	// 	$scope.detail = false;
	// }
})