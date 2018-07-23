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

        var itemCount = 0;

        if(item.copyStringArrayData) {
            var length = item.copyStringArrayData.length.toString();

            item.copyStringArrayData.forEach(function(element) {
                if(element.copyMessage.length) {
                    itemCount += 1;
                }
            });
        }

        chrome.browserAction.setBadgeText({"text": itemCount.toString()});

        if(!item.copyStringArrayData || item.copyStringArrayData.length != 10) {
            var copyItem = InitializeCacheObject();
            addContextMenu();
            chrome.storage.sync.set({"copyStringArrayData": copyItem });
            return;
        }
    });
}

function copyToSelectedIndex(index) {

    var index = index
    return function(selectionData) {
        chrome.storage.sync.get("copyStringArrayData", function(item) {
            item.copyStringArrayData[(+index)].copyMessage = selectionData.selectionText;

            var itemCount = 0;

            item.copyStringArrayData.forEach(function(element) {
                if(element.copyMessage.length) {
                    itemCount += 1;
                }
            });

            chrome.browserAction.setBadgeText({"text": itemCount.toString()});
            
            chrome.storage.sync.set({"copyStringArrayData": item.copyStringArrayData });
        });
    }
}


function addContextMenu() {

    var parentCopyMenu = chrome.contextMenus.create({
        id: "parentCopyMenu",
        title: "Add to Copy String",
        contexts: ["selection"]
    });

    for(let i=0; i< 10; i++) {
        chrome.contextMenus.create({title: "Copy Data to " + i, parentId: "parentCopyMenu", contexts: ["selection"], "onclick": copyToSelectedIndex(i)});
    }
}

function subscribeToContextMessages() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
        if(request.operation && request.operation == "addToCache") {
            if(request.selectedText.length > 0) {
    
                chrome.storage.sync.get("copyStringArrayData", function(item) {

                    let itemCount = 0;

                    if(item.copyStringArrayData) {

                        if(item.copyStringArrayData.length != 10) {
                            item.copyStringArrayData = InitializeCacheObject();
                        }
                        
                        item.copyStringArrayData[(+request.selectedKey)].copyMessage = request.selectedText;

                        item.copyStringArrayData.forEach(function(element) {
                            if(element.copyMessage.length) {
                                itemCount += 1;
                            }
                        });
                    }
    
                    chrome.browserAction.setBadgeText({"text": itemCount.toString()});
    
                    chrome.storage.sync.set( {"copyStringArrayData": item.copyStringArrayData });
    
                });
            }
        }

        else if(request.operation == "retrieveFromCache") {
            chrome.storage.sync.get("copyStringArrayData", function(item) {
                sendResponse({data: item.copyStringArrayData[+(request.selectedKey)].copyMessage.toString()})
            });

            return true;
        }
    });
}

function initializeExtension() {
    getCacheFromStorage();
    registerForCacheChange();
    subscribeToContextMessages();
}

initializeExtension();

