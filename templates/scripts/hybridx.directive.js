angular.module(JDBModule.getAppName())
    .directive('<%= name %>', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

            }
        };
    });