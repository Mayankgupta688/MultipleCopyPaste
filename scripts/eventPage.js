chrome.storage.onChanged.addListener(function(changes) {
    

    var length = changes.copyStringArray.newValue.length.toString();
    chrome.browserAction.setBadgeText({"text": length});
    alert(length);

    chrome.notifications.create("storageChanged", {
        type: "basic",
        title: "Storage Value Changed",
        message: "Hello Mayank. You have changed the storage Value...",
        iconUrl: "../conversation.png"
    });
})

chrome.storage.sync.get("copyStringArray", function(item) {
    var length = item.copyStringArray.length.toString();
    chrome.browserAction.setBadgeText({"text": length});
});
