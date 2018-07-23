
console.log("Key Has Been Pressed!");

function getSelectionText(){
    var selectedText = ""
    if (window.getSelection){ // all modern browsers and IE9+
        selectedText = window.getSelection().toString()
    }
    return selectedText;
}

function checkIfEditable() {
    debugger;
    return event.target.isContentEditable || !event.target.readOnly || event.target.tagName.toLowerCase() == "input";
}

setTimeout(() => {

    var data = $("iframe");

    alert(data.count)


    $("body").keydown(function(event) {
        
        var validkeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        if(event.altKey === true && validkeys.indexOf(event.key) >= 0 && event.ctrlKey === false ) {

            if(!window.getSelectionText().length) {
                return;
            }

            chrome.runtime.sendMessage({ 
                operation: "addToCache", 
                selectedKey: event.key,
                selectedText: window.getSelectionText()
            });
        }
    });

    $("body").keydown(function(event) {
        
        var validkeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        if(event.ctrlKey === true && event.altKey === true) {
            if(validkeys.indexOf(event.key) >= 0) {
                debugger;
                if(checkIfEditable()) {
                    chrome.runtime.sendMessage({
                        operation: "retrieveFromCache",
                        selectedKey: event.key
                    }, function(response) {
                        debugger;
                        if(event.target.tagName.toLowerCase() == "div") {
                            event.target.innerText = response.data;
                        } else if (event.target.tagName.toLowerCase() == "input") {
                            event.target.value = response.data;
                        } else if (event.target.tagName.toLowerCase() == "textarea") {
                            event.target.value = response.data;
                            event.target.innerText = response.data;
                        } else if(event.target.isContentEditable) {
                            event.target.innerText = response.data;
                        }
                    })
                }
            }
        }
    });
}, 1000);

