angular.module('app.controllers', [])
  
.controller('appCtrl', function($scope, Restangular) {
	

})

.factory('MockAPI', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
         RestangularConfigurer.setBaseUrl('api');
    });
 }])

.controller('dodgyDoctorsCtrl', function($scope, Restangular) {
	Restangular.all('doctor').getList().then(function(response) {
		
		$scope.doctors = response;
		// console.log($scope.doctors.plain())
	})

	var inputMin = 1;
    $scope.search = function() {
    	if ($scope.doctorName && $scope.doctorName.length >= inputMin) {
            $scope.searching = true;
            Restangular.one('doctor/search').get({name: $scope.doctorName}).then(function(response){
                $scope.results = response;
                // console.log(response)
             }, function(error){
                $scope.error = error;
            });
        } else {
               $scope.searching = false;
          }     
    }

	$scope.showDetail = function(result) {
		$scope.information = result;
		// console.log($scope.detail)
		$scope.searching = false;
		$scope.detail = true;
	}

	$scope.close = function() {
		$scope.detail = false;
	}
})

// .controller('medicineFinderCtrl', function($scope, Restangular) {
// 	Restangular.all('medicine').getList().then(function(response) {
// 		$scope.medicine = response;
// 		// console.log(response.plain())  
// 	})

// 	var inputMin = 3;
//     $scope.search = function() {
//     	if ($scope.medicineName && $scope.medicineName.length >= inputMin) {
//             $scope.searching = true;
//             Restangular.one('medicine/search').get({name: $scope.medicineName}).then(function(response){
//                 $scope.results = response;
//              }, function(error){
//                 $scope.error = error;
//             });
//         } else {
//                $scope.searching = false;
//           }     
//     }

// 	$scope.showDetail = function(result) {
// 		$scope.information = result;
// 		// console.log($scope.detail)
// 		$scope.searching = false;
// 		$scope.detail = true;
// 	}
// 	$scope.showDetail = function() {
// 		$scope.detail = true;
// 	}

// 	$scope.close = function() {
// 		$scope.detail = false;
// 	}
// })

.controller('hospitalFinderCtrl', function($scope, Restangular, $http) {

	$scope.search = function() {
	    	var address = $scope.hospital.name
			var inputMin = 1;
			
	    	if ($scope.hospital.name && $scope.hospital.name.length >= inputMin) {
	            // $scope.searching = true;
			    $http({
			        method: 'GET',
			        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
			                         address + '&key=AIzaSyCq_hPKdxEybYoangnVh1Fs_ARyjnmdSqs' + '&sensor=false&components=country:NG',

			        transformRequest: function(data, headersGetter) {
			            var headers = headersGetter();

			            delete headers['Authorization'];

			            return headers;
			        }
			    }).then(function(results){
			    	$scope.searching = true;
			    	$scope.results = results.data.results;
				})
	        } else {
               $scope.searching = false;
          } 	   
	    }

	$scope.addLocation = function(result) {
		$scope.hospital.name = result.formatted_address;
		$scope.hospital.latitude = result.geometry.location.lat;
		$scope.hospital.longitude = result.geometry.location.lng;
		// console.log(result.formatted_address);
		$scope.searching = false;
	}

	$scope.showDetail = function() {
		$scope.load = true;
		Restangular.all('hospital/search').post($scope.hospital).then(function(response) {
			$scope.hospitals = response;
			// console.log(response.plain())
		}), function(error){
            $scope.error = error;
            console.log(error)
        };
	}

	$scope.showHospital = function(hospital) {
		$scope.hospitalDetails = true;
		$scope.hospital = hospital.obj;
		console.log($scope.hospital)
	}

	$scope.close = function() {
		$scope.hospitalDetails = false;
	}

	$scope.closeList = function() {
		$scope.hospitals = [];
		$scope.load = false;
	}
})

.controller('articleCtrl', function($scope, Restangular) {
	Restangular.all('content').getList().then(function(response) {
		$scope.articles = response;
		// console.log(response.plain())
	})

})

.controller('articleReadCtrl', function($scope, Restangular, $stateParams) {
	console.log($stateParams)
	Restangular.one('content', $stateParams.id).get().then(function(response) {
		$scope.article = response;
		console.log(response)
	})
})
