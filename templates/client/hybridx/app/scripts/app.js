'use strict';
require('./services/api');
require('./directives/viewTitle');
require('./controllers/main');

var routesConfig = [{
    stateName: 'jdbApp<%= _.upperFirst(name) %>',
    data: {
        url: '/<%= name %>',
        templateUrl: '../<%= name %>/views/main.html',
        controller: 'jdbApp<%= _.upperFirst(name) %>MainCtrl'
    }
}];

JDBModule.register({
    name: '<%= name %>',
    data: {
        routes: routesConfig
    }
});