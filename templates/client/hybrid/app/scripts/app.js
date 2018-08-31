'use strict';
document.addEventListener('deviceready', function () {
    CommonParams.commonParams(function (nativeData) {
        angular.module('jdb').constant('commonParams', nativeData);
        angular.bootstrap(document.body, ['<%= name %>']);
    }, function () {
        alert('获取登录信息失败');
    });
});

angular.module('<%= name %>', ['ionic', 'jdb', 'jdbHybridComponent'])
    .run(['$ionicPlatform', function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: '/index',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            });
        $urlRouterProvider.otherwise('/index');
    }]);

require('./services/api');
require('./directives/viewTitle');
require('./controllers/main');