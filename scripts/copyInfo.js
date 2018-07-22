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

        $scope.deleteEntry = function(index) {
            chrome.storage.sync.get("copyStringArrayData", function(item) {
                var cachedItem = item.copyStringArrayData;

                cachedItem[+(index)].copyMessage = "";

                chrome.storage.sync.set( {"copyStringArrayData": cachedItem });
            });
        }

        $scope.updateEntry = function(index, event) {
            debugger;
            chrome.storage.sync.get("copyStringArrayData", function(item) {
                var cachedItem = item.copyStringArrayData;

                cachedItem[+(index)].copyMessage = event.target.parentElement.firstElementChild.innerText;

                chrome.storage.sync.set( {"copyStringArrayData": cachedItem });
            });
        }

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
        });
    });
})();    
