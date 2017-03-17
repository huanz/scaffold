/**
 * @name    <%= name %>
 * @author  <%= author %>
 * @date    <%= date %>
 */
angular.module(<%= modulename %>)
    .directive('<%= name %>', function () {
        return {
            restrict: 'EA',
            link: function (scope, element, attr) {
                
            }
        };
    });