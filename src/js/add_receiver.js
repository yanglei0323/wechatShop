/**
 * Created by hugotan on 2016/4/16.
 */
angular.module('addReceiver', []).controller('addReceiverCtrl', ['$scope', '$http', function ($scope, $http) {
	var transFn = function(data) {
                return $.param(data);
        },
        postCfg = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        };
	$scope.save = function () {
		var data = {
			name: $scope.name,
			telephone: $scope.phone,
			city: $scope.city,
			address: $scope.address
		};
		var promise = $http.post('/user/addaddress.json', data, postCfg);
		promise.then(function (resp) {
			console.log(resp);
		}, function (resp) {
			console.log(resp);
		});
	};
}]);