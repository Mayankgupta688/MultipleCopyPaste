
    var applicationModule = angular.module("applicationModule", [])
    angular.module("applicationModule").controller("appController", function($scope) {
        $scope.copyValuesArray = [];

        $scope.copyValuesArray.push({
            keyId: 1,
            copyMessage: "This is the Demo Version"
        });

        $scope.copyValuesArray.push({
            keyId: 2,
            copyMessage: "Added another Text"
        });
    });
    
