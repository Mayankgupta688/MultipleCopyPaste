function registerForCacheChange() {
    chrome.storage.onChanged.addListener(function(changes) {

        var length = changes.copyStringArrayData.newValue.length.toString();

        let itemCount = 0;

        changes.copyStringArrayData.newValue.forEach(function(element) {
            if(element.copyMessage.length) {
                itemCount += 1;
            }
        });

        chrome.browserAction.setBadgeText({"text": itemCount.toString()});
    
        chrome.notifications.create("storageChanged", {
            type: "basic",
            title: "Storage Value Changed",
            message: "Hello Mayank. You have changed the storage Value...",
            iconUrl: "../conversation.png"
        });
    });
}

function InitializeCacheObject() {
    var copyItem = [];
    for(let i = 0; i< 10; i++) {
        copyItem.push({
            keyId: i,
            copyMessage: ""
        })
    }
    return copyItem;
}


function getCacheFromStorage() {
    chrome.storage.sync.get("copyStringArrayData", function(item) {
        var length = item.copyStringArrayData.length.toString();
        if(!item.copyStringArrayData || item.copyStringArrayData.length != 10) {
            var copyItem = InitializeCacheObject();
            chrome.storage.sync.set({"copyStringArrayData": copyItem });
        }
    });
}


function addContextMenu() {
    var contextMenu = {
        "id": "addSelection",
        "title": "Add to Copy String",
        "contexts": ["selection"]
    }
    
    chrome.contextMenus.create(contextMenu);

    chrome.contextMenus.onClicked.addListener(function(selectionData) {
        if(selectionData.menuItemId = "addSelection") {
            chrome.storage.sync.get("copyStringArrayData", function(item) {
                
                var copyItems = item.copyStringArrayData;
    
                copyItems.push({
                    keyId: copyItems.length,
                    copyMessage: selectionData.selectionText
                });
    
                var length = copyItems.length.toString();

                let itemCount = 0;

                copyItems.forEach(function(element) {
                    if(element.copyMessage.length) {
                        itemCount += 1;
                    }
                });

                chrome.browserAction.setBadgeText({"text": itemCount.toString()});
    
                chrome.storage.sync.set( {"copyStringArrayData": copyItems });
            });
        }
    });
}

function subscribeToContextMessages() {
    chrome.runtime.onMessage.addListener(function(request) { 
        if(request.operation && request.operation == "addToCache") {
            if(request.selectedText.length > 0) {
    
                chrome.storage.sync.get("copyStringArrayData", function(item) {

                    if(item.copyStringArrayData.length != 10) {
                        item.copyStringArrayData = InitializeCacheObject();
                    }
                    
                    item.copyStringArrayData[(+request.selectedKey)].copyMessage = request.selectedText;

                    let itemCount = 0;

                    item.copyStringArrayData.forEach(function(element) {
                        if(element.copyMessage.length) {
                            itemCount += 1;
                        }
                    });
    
                    chrome.browserAction.setBadgeText({"text": itemCount.toString()});
    
                    chrome.storage.sync.set( {"copyStringArrayData": item.copyStringArrayData });
    
                });
            }
        }
    });
}





function initializeExtension() {
    getCacheFromStorage();
    registerForCacheChange();
    addContextMenu();
    subscribeToContextMessages();
}

initializeExtension();

