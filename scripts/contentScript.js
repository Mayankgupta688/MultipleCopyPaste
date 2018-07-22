
console.log("Key Has Been Pressed!");

function getSelectionText(){
    var selectedText = ""
    if (window.getSelection){ // all modern browsers and IE9+
        selectedText = window.getSelection().toString()
    }
    return selectedText;
}

function checkIfEditable() {
    return event.target.isContentEditable || !event.target.readOnly
}

setTimeout(() => {
    $("body").keydown(function(event) {
        
        var validkeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        if(event.altKey === true && validkeys.indexOf(event.key) >= 0) {

            if(!window.getSelectionText().length) {
                return;
            }

            alert(event.key + ": " + window.getSelectionText())

            chrome.runtime.sendMessage({ 
                operation: "addToCache", 
                selectedKey: event.key,
                selectedText: window.getSelectionText()
            });
        }
    });

    $("body").keydown(function(event) {
        var validkeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        if(event.shiftKey === true && event.altKey === true && validkeys.indexOf(event.key) >= 0) {
            if(checkIfEditable()) {
                alert("Hi");
            }
        }
    });
}, 1000);

