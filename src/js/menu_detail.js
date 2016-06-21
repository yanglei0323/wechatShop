/**
 * Created by hugotan on 2016/5/4.
 */
index.controller('menuDetailCtrl',
	['$scope', '$http', '$location', '$window', '$routeParams',
	function ($scope, $http, $location, $window, $routeParams) {
	
	var menuId = $routeParams.id;
	$scope.title = $location.search().name;

	$scope.goodsList = [];
    $scope.page = 1;
    $scope.loading = false;
    $scope.loaded = false;
    $scope.type = 'hot';

    (function init() {
    	// getGoods();
    })();


    $scope.getGoods = getGoods;
    // 获取商品列表
    function getGoods() {
        if ($scope.loading) {
            return;
        }
        $scope.loading = true;
        var data = {
        	goodskindid: menuId,
            page: $scope.page,
            sort: $scope.type
        };
        $http.post('/shop/searchgoodsbygoodskindandcondition.json',data, postCfg)
        .then(function (resp) {
        	console.log(resp);
            if (1 === resp.data.code) {
                var goodsList = resp.data.data.goodslist;
                if (goodsList.length > 0) {
                    for (var i = 0, j = goodsList.length; i < j; i++) {
                        goodsList[i].imgurl = picBasePath + goodsList[i].imgurl1;
                        $scope.goodsList.push(goodsList[i]);
                    }
                    $scope.page += 1;
                    $scope.loading = false;
                }
                else {
                    $scope.loaded = true;
                }
            }
        }, function (resp) {
            console.log(resp);
        });
    }

    // 选择排序方式
    $scope.setSort = function (type) {
        if ($scope.type && $scope.type === type) {
            return;
        }
        $scope.type = type;
        $scope.goodsList = [];
        $scope.page = 1;
        $scope.loaded = false;
        $scope.loading = false;
        getGoods();
    };

    // 跳转到商品详情
    $scope.toGoodsDetail = function (goods) {
        $location.path('mall_goods_detail/' + goods.id);
    };

}]);