/**
 * Created by hugotan on 2016/4/10.
 */
index.controller('rechargeCtrl', ['$scope', '$http', '$location',
	function ($scope, $http, $location) {

    var priceRe = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/;
	// 获取当前余额
	$http.post('/user/getcurrentbalance.json', postCfg)
	.success(function (data) {
		console.log(data);
		if (-1 === data.code) {
			$location.path('login');
			return;
		}
		if (1 === data.code) {
			$scope.balance = data.data.balance;
		}

	})

    // 获取所有vip信息
    $http.post('/user/getallvip.json', postCfg)
    .success(function (data) {
    	console.log(data);
    	if (1 === data.code) {
    		var vipList = data.data.viplist;
    		for (var i = 0; i < vipList.length; i++) {
    			vipList[i].imgurl = picBasePath + '/' + vipList[i].imgurl;
    		}
    		$scope.vipList = vipList;
    	}
    })
    .error(function (data) {
    	console.log(data);
    	alert('数据请求失败，请稍后再试！')
    });

    // 选择vip
    $scope.selectVip = function (vip) {
    	var state = !vip.selected;
    	for (var i = 0; i < $scope.vipList.length; i++) {
    		$scope.vipList[i].selected = false;
    	}
        $scope.otherPrice = false;
    	vip.selected = state;
    };

    // 选择其他金额
    $scope.selectOtherPrice = function () {
        $scope.otherPrice = !$scope.otherPrice;
        for (var i = 0; i < $scope.vipList.length; i++) {
            $scope.vipList[i].selected = false;
        }
    };

    $scope.buyVip = function () {
        if (-1 === checkParams()) {
            return;
        }
        var data = {
            paymoney: $scope.payMoney
        };
        $http.post('/user/buyvipfirststep.json', data, postCfg)
        .success(function (data) {
            console.log(data);
        })
        .error(function (data) {
            console.log(data);
            alert('数据请求失败，请稍后再试！');
        });
    };

    function checkParams() {
        var flag = false;
        if ($scope.otherPrice) {
            if (!priceRe.test($scope.otherPriceNum)) {
                alert('输入金额无效');
                return -1;
            }
            else {
                $scope.payMoney = parseFloat($scope.otherPriceNum);
                return 1;
            }
        }
        else {
            for (var i = 0; i < $scope.vipList.length; i++) {
                if ($scope.vipList[i].selected) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                $scope.payMoney = parseFloat($scope.vipList[i].price);
                return 1;
            }
            else {
                alert('请选择需要购买的vip');
                return -1;
            }
        }
    }

}]);