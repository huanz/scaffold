require('./services/api');
require('./directives/viewTitle');
require('./controllers/main');

var routesConfig = [{
    stateName: '<%= prefix %>',
    data: {
        url: '/<%= name %>',
        templateUrl: '../<%= name %>/views/main.html',
        controller: '<%= prefix %>Ctrl'
    }
}];

JDBModule.register({
    name: '<%= name %>',
    data: {
        routes: routesConfig
    }
});