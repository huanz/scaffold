/**
 * @name    main
 * @author  <%= author %>
 * @date    <%= date %>
 */
angular.module('<%= name %>')
.controller('MainCtrl', ['$scope', 'Api', function ($scope, Api) {
    
    /**
     * @desc 每次进入执行，不需要缓存的放在这里
     */
    $scope.$on('$ionicView.enter', function () {

    });

    /**
     * @desc 获取接口数据
     */
     function getData() {

     }
}]);