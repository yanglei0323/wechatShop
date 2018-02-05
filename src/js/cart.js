index.controller('cartCtrl',
	['$scope', '$http', '$location', '$rootScope', '$q', '$window',
	function ($scope, $http, $location, $rootScope, $q, $window) {
	$scope.selectedNum=0;
	$scope.noContant = false;
	var cartPromise = $http.post('/user/mycart.json', postCfg);
	cartPromise.then(function (resp) {
		// console.log(resp.data);
		var data = resp.data;
		if (-1 === data.code) {
			// 用户未登录
			$location.path('fast_login');
		}
		else if (1 === data.code && 0 < data.data.cartlist.length) {
			var cartList = data.data.cartlist;
			$scope.cartInfo = data.data.info;
			for (var i =0, j  = cartList.length; i < j; i++) {
				cartList[i].imgurl = picBasePath + cartList[i].imgurl;
				cartList[i].count = addNum(cartList[i].price, cartList[i].num);
				cartList[i].selected = false;
			}
			$scope.cartList = cartList;
			if($scope.cartList.length >= 1){
				$scope.noContant = false;
			}else{
				$scope.noContant = true;
			}
			// 获取合计总价
			$scope.getTotalPrice = function () {
				var totalPrice = 0;
				$scope.selectedNum=0;
				for (var i = 0, j = $scope.cartList.length; i < j; i++) {
					if ($scope.cartList[i].selected === true) {
						totalPrice += parseFloat(cartList[i].count);
						$scope.selectedNum+=parseFloat(cartList[i].num);
					}
				}
				return totalPrice;
			};
		}else if(data.data.cartlist.length <= 0){
			$scope.cartInfo = data.data.info;
			$scope.noContant = true;
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});
	// 跳转到商品详情
    $scope.toGoodsDetail = function (goods, isFlash) {
        $location.path('mall_goods_detail/' + goods.goodsid);
        
    };
	// 增加商品购物车数量
	$scope.increaseNum = function (goods) {
		var index = $scope.cartList.indexOf(goods),
		    data = {
			'id': [parseInt(goods.id)],
			'number': [parseInt(goods.num) + 1]
		};
		$http.post('/user/changecart.json', data, postCfg)
		.then(function (resp) {
			// console.log(resp);
			if (1 === resp.data.code) {
				var cartList = resp.data.data.cartlist;
				$scope.cartList[index].num = cartList[index].num;
				// $scope.cartList[index].count = cartList[index].price * cartList[index].num;
				$scope.cartList[index].count = addNum(cartList[index].price, cartList[index].num);
			}
		}, function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	};
	// 减少商品购物车数量
	$scope.decreaseNum = function (goods) {
		if (1 === goods.num) {
			return;
		}
		var index = $scope.cartList.indexOf(goods);
		    data = {
			'id': [parseInt(goods.id)],
			'number': [parseInt(goods.num) - 1]
		};
		$http.post('/user/changecart.json', data, postCfg)
		.then(function (resp) {
			// console.log(resp);
			if (1 === resp.data.code) {
				var cartList = resp.data.data.cartlist;
				$scope.cartList[index].num = cartList[index].num;
				// $scope.cartList[index].count = cartList[index].price * cartList[index].num;
				$scope.cartList[index].count = addNum(cartList[index].price, cartList[index].num);
			}
		}, function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	function addNum (num, count) {
		var sq;
	    try {
	        sq = num.toString().split(".")[1].length;
	    }
	    catch (e) {
	        sq = 0;
	    }
	    var m = Math.pow(10, sq);
	    return (num * m * count) / m;
	}

	$scope.selectAll = function () {
		$scope.isSelectAll = !$scope.isSelectAll;
		var i = 0, j = 0;
		if ($scope.isSelectAll === true) {
			// 遍历购物车的商品，选中状态设置为true
			for (i = 0, j = $scope.cartList.length; i < j; i++) {
				$scope.cartList[i].selected = true;
			}
		}
		else {
			// 遍历购物车的商品，选中状态设置为false
			for (i = 0, j = $scope.cartList.length; i < j; i++) {
				$scope.cartList[i].selected = false;
			}
		}
	};

	// 检查是否全部选中了
	function checkSelectAll() {
		for (var i = 0, j = $scope.cartList.length; i < j; i++) {
			if ($scope.cartList[i].selected === false) {
				return false;
			}
		}
		return true;
	}

	// 点击购物车中的商品选中按钮
	$scope.selectGoods = function (goods) {
		goods.selected = !goods.selected;
		$scope.isSelectAll = checkSelectAll();
	};

	// 点击去结算，跳转到订单确认页面
	$scope.calculate = function () {
		var goodsArr = [];
		var numArr = [];
		var colorArr = [];
		var sizeArr = [];
		var flag = 0;    // 代表购物车是否有商品被选中
		for (var i = 0; i < $scope.cartList.length; i++) {
			if ($scope.cartList[i].selected) {
				$scope.cartList[i].buyNum = $scope.cartList[i].num;
				$scope.cartList[i].price = $scope.cartList[i].price;
				$scope.cartList[i].realprice = $scope.cartList[i].price;
				$scope.cartList[i].id=$scope.cartList[i].goodsid;
				goodsArr.push($scope.cartList[i]);
				numArr.push($scope.cartList[i].num);
				colorArr.push($scope.cartList[i].colorid);
				sizeArr.push($scope.cartList[i].sizeid);
				flag = 1;
			}
		}
		if (0 === flag) {
			alert('请先选择商品!');
			return;
		}
		$rootScope.goodsArr = goodsArr;
		// console.log($rootScope.goodsArr);
		$rootScope.numArr = numArr;
		$rootScope.colorArr = colorArr;
		$rootScope.sizeArr = sizeArr;
		$rootScope.cartFlag = 1;
		$location.path('order_confirm');
	};
	// 删除某件商品
	$scope.deleteGoods = function (item){
		var data = {
			'id': [item.id]
		};
		var confirm = $window.confirm('确认删除此项商品吗？');
		if (confirm) {
			$http.post('/user/deletecart.json', data, postCfg)
			.success(function (data) {
				if (1 === data.code) {
					// 删除成功
					alert('删除成功');
					for (var i = 0; i < $scope.cartList.length; i++) {
						if ($scope.cartList[i].id == item.id) {
							$scope.cartList.splice(i, 1);
							if($scope.cartList.length <= 0){
								$scope.noContant = true;
							}
						}
					}
				}
				else if (0 === data.code) {
					alert(data.reason);
					return;
				}
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
	};
	// // 删除购物车商品
	// $scope.deleteCart = function () {
	// 	var idArr = [],
	// 	    indexList = [];
	// 	var flag = 0;    // 代表购物车是否有商品被选中
	// 	for (var i = 0; i < $scope.cartList.length; i++) {
	// 		if ($scope.cartList[i].selected) {
	// 			indexList.push(i);
	// 			idArr.push($scope.cartList[i].goods.id);
	// 			flag = 1;
	// 		}
	// 	}
	// 	if (0 === flag) {
	// 		alert('请先选择要删除的商品!');
	// 		return;
	// 	}
	// 	var data = {
	// 		goodsid: idArr
	// 	};
	// 	var confirm = $window.confirm('确认删除这' + idArr.length + '项商品吗？');
	// 	if (confirm) {
	// 		$http.post('/user/deletecart.json', data, postCfg)
	// 		.success(function (data) {
	// 			if (1 === data.code) {
	// 				// 删除成功
	// 				alert('删除成功');
	// 				for (i = 0; i < indexList.length; i++) {
	// 					$scope.cartList.splice(indexList[i], 1);
	// 				}
	// 			}
	// 			else if (0 === data.code) {
	// 				alert(data.reason);
	// 				return;
	// 			}
	// 		})
	// 		.error(function (data) {
	// 			// alert('数据请求失败，请稍后再试！');
	// 		});
	// 	}
	// };
	// $scope.tback = function(){
	// 	$location.path('mall');
	// };
	$scope.navigate = function (index) {
        var user;
        switch (index) {
            case 1:
                $location.path('/');
                break;
            case 2:
                $location.path('classification');
                break;
            case 3:
                $location.path('cart');
                break;
            case 4:
                $location.path('my');
                // $window.location.href = '/webapp/src/xiaoyue/home.html';
                break;
        }
    };
}]);