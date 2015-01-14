'use strict';

// Declare app level module which depends on views, and components
var myapp = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);


myapp.controller('MainCtrl', function ($scope) {
  $scope.showContent = function($fileContent){
    //Wrap the log file in open/close JSON tags
    $scope.content = "[";
    $scope.content += $fileContent;

    //The .log entries are delimited with new lines. Replace with commas for JSON
    $scope.content = $scope.content.replace(/\n/g, ",");

    //Remove last instance of comma
    $scope.content = $scope.content.substring(0, $scope.content.length-1);
    $scope.content += "]";
    
    //Check if valid JSON
    $scope.content = JSON.parse($scope.content);
    //$scope.content = JSON.stringify($scope.content);
  };
});

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