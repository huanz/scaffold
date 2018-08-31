angular.module('<%= name %>')
    .directive('viewTitle', ['cordovaUtils', function (cordovaUtils) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var title = attr['viewTitle'];
                if (title) {
                    scope.$on('$ionicView.beforeEnter', function () {
                        cordovaUtils.setTitle(title);
                    });
                }
            }
        };
    }]);