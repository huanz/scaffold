require('./services/api');
require('./directives/viewTitle');
require('./controllers/main');

var routesConfig = [{
    stateName: 'jdbApp<%= uppername %>',
    data: {
        url: '/<%= name %>',
        templateUrl: '../<%= name %>/views/main.html',
        controller: 'jdbApp<%= uppername %><%= classname %>Ctrl'
    }
}];

JDBModule.register({
    name: '<%= name %>',
    data: {
        routes: routesConfig
    }
});