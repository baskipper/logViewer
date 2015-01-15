'use strict';

// Declare app level module which depends on views, and components
var myapp = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
    'ngTable'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);


myapp.controller('MainCtrl', function ($scope, $filter, ngTableParams) {
  $scope.showContent = function($fileContent){
    //Wrap the log file in open/close JSON tags
    var data = "[";
    data += $fileContent;

    //The .log entries are delimited with new lines. Replace with commas for JSON
    data = data.replace(/\n/g, ",");

    //Remove last instance of comma
    data = data.substring(0, data.length-1);
    data += "]";
    //Check if valid JSON
    data = JSON.parse(data);
    //$scope.content = JSON.stringify($scope.content);
    console.log(data.length);


    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
    }, {
      total: data.length, // length of data



      getData: function($defer, params) {

        // use build-in angular filter
        var orderedData = params.sorting() ?
            $filter('orderBy')(data, params.orderBy()) :
            data;

        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
  };
});

/*myapp.controller('tableController', function($scope, ngTableParams) {




});*/

myapp.directive('onReadFile', function ($parse) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.onReadFile);

      element.on('change', function(onChangeEvent) {
        var reader = new FileReader();

        reader.onload = function(onLoadEvent) {
          scope.$apply(function() {
            fn(scope, {$fileContent:onLoadEvent.target.result});
          });
        };

        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
      });
    }
  };
});