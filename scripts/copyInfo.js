(function() {

    chrome.storage.sync.set( {"name": "Mayank" });


    var applicationModule = angular.module("applicationModule", [])
    angular.module("applicationModule").controller("appController", function($scope) {

        $scope.copyStringArrayData = [];

        chrome.storage.sync.get("copyStringArrayData", function(item) {
            var length = item.copyStringArrayData? item.copyStringArrayData.length.toString(): "";
            if(!length) {
                return;
            }
            $scope.copyStringArrayData = item.copyStringArrayData;
            console.dir($scope.copyStringArrayData)
            $scope.$apply();
        });

        $scope.addToStorage = function() {
            $scope.copyStringArrayData.push({
                keyId: $scope.copyStringArrayData.length,
                copyMessage: "Storage Value Modified by the User"
            });

            chrome.storage.sync.set( {"copyStringArrayData": $scope.copyStringArrayData });
        }

        $scope.resetStorage = function() {
            chrome.storage.sync.set( {"copyStringArrayData": [] }, function() { 
                chrome.notifications.create("storageChanged", {
                    type: "basic",
                    title: "Storage Value Reset",
                    message: "Hello Mayank. You have reset the storage Value...",
                    iconUrl: "../conversation.png"
                });

                chrome.storage.sync.get("copyStringArrayData", function(item) {
                    $scope.copyStringArrayData = item.copyStringArrayData;
                    $scope.$apply();
                });
            });
        }

        chrome.storage.onChanged.addListener(function(changes) {
            $scope.copyStringArrayData = changes.copyStringArrayData.newValue;
            $scope.$apply();
        })

        chrome.storage.sync.get("name", function(item) {
            $scope.name = item.name;
            $scope.$apply();

            chrome.notifications.create("info", {
                type: "basic",
                title: "Hello All",
                message: "Hello Mayank. Welcome to the Demo on the Chrome Extension...",
                iconUrl: "../conversation.png"
            })
        });
    });
})();    
