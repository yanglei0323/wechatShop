index.controller('collectionCtrl',
    ['$scope', '$http', '$rootScope', '$location',
    function ($scope, $http, $rootScope, $location) {
    $scope.page = 1;
    $scope.goodsList=[];
    $scope.nothing=false;
    $scope.user = JSON.parse(sessionStorage.getItem('user'));
    // 获取商品列表
    function getGoods() {
        if ($scope.loading) {
            return;
        }
        $scope.loading = true;
        var loading = weui.loading('加载中');
        var data = {
            page: $scope.page
        };
        $http.post('/user/mykeepgoods.json',data, postCfg)
        .then(function (resp) {
            if (1 === resp.data.code) {
                var goodsList = resp.data.data.goodslist;
                if (goodsList.length > 0) {
                    for (var i = 0, j = goodsList.length; i < j; i++) {
                        goodsList[i].imgurl = picBasePath + goodsList[i].imgurl;
                        $scope.goodsList.push(goodsList[i]);
                    }
                    $scope.page += 1;
                    $scope.loading = false;
                }
                else {
                    $scope.loaded = true;
                    if($scope.page >= 2){
                        weui.toast('暂无更多', {
                            duration: 1500,
                            className: "bears"
                        });
                    }
                }
                if($scope.goodsList.length === 0){
                    $scope.nothing=true;
                }
            }
            loading.hide();
        }, function (resp) {
            // alert('数据请求失败，请稍后再试！');
        });
    }
    $scope.getGoods=getGoods;
    getGoods();
    // 点赞商品
    $scope.unkeep = function (goods, e) {
        e.stopPropagation();
        var loading = weui.loading('提交中');
        $http.post('/user/unkeepgoods.json', {goodsid: goods.id}, postCfg)
        .success(function (data) {
            if (1 === data.code) {
                for (var i = 0; i < $scope.goodsList.length; i++) {
                    if ($scope.goodsList[i].id == goods.id) {
                        $scope.goodsList.splice(i, 1);
                        if($scope.goodsList.length <= 0){
                            $scope.nothing = true;
                        }
                    }
                }
            }
            loading.hide();
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
    };
    // 跳转到商品详情
    $scope.toGoodsDetail = function (goods, isFlash) {
        $location.path('mall_goods_detail/' + goods.id);
        
    };
}]);