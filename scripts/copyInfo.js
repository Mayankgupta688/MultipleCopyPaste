(function() {

    chrome.storage.sync.set( {"name": "Mayank" });

    var applicationModule = angular.module("applicationModule", [])
    angular.module("applicationModule").controller("appController", function($scope) {
        $scope.copyStringArray = [];

        chrome.storage.sync.get("copyStringArray", function(item) {
            var length = item.copyStringArray.length.toString();
            chrome.browserAction.setBadgeText({"text": length});
            $scope.copyStringArray = item.copyStringArray;
            console.dir($scope.copyStringArray)
            $scope.$apply();
        });

        $scope.addToStorage = function() {
            $scope.copyStringArray.push({
                keyId: $scope.copyStringArray.length,
                copyMessage: "Storage Value Modified by the User"
            });

            chrome.storage.sync.set( {"copyStringArray": $scope.copyStringArray });
        }

        $scope.resetStorage = function() {
            chrome.storage.sync.set( {"copyStringArray": [] }, function() { 
                chrome.notifications.create("storageChanged", {
                    type: "basic",
                    title: "Storage Value Reset",
                    message: "Hello Mayank. You have reset the storage Value...",
                    iconUrl: "../conversation.png"
                });

                chrome.storage.sync.get("copyStringArray", function(item) {
                    var length = $scope.copyStringArray.length.toString();
                    $scope.copyStringArray = item.copyStringArray;
                    chrome.browserAction.setBadgeText({"text": length});
                    $scope.$apply();
                });
            });
        }

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
